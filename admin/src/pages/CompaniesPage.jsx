import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ToneIcon } from '../components/ui/ToneIcon';
import { 
  getCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany 
} from '../api/company';
import { getActiveLocations } from '../api/location';
import { isAuthenticated, getCurrentUser } from '../api/auth';
import { uploadImage } from '../api/upload'; 

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

// Helper to resolve image paths
const getLogoUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  
  if (path.startsWith('http://') || path.startsWith('https://') || 
      path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const baseUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:3000')
    .toString()
    .trim()
    .replace(/^['"]|['"]$/g, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${baseUrl}/${cleanPath}`;
};

export const CompaniesPage = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    locationId: '',
    logo: '',
    logoFile: null,
    logoPreview: '',
    status: 'active'
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchCompanies();
    fetchLocations();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const result = await getCompanies();
    if (result.success) {
      const processedData = result.data.map(company => ({
        ...company,
        logo: company.logo ? getLogoUrl(company.logo) : null
      }));
      setCompanies(processedData);
      updateStats(processedData);
    }
    setLoading(false);
  };

  const fetchLocations = async () => {
    const result = await getActiveLocations();
    if (result.success) {
      setLocations(result.data);
    }
  };

  const updateStats = (list) => {
    setStats({
      total: list.length,
      active: list.filter(c => c.status === 'active').length,
      inactive: list.filter(c => c.status === 'inactive').length,
    });
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          (c.email && c.email.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    
    setForm(prev => ({ 
      ...prev, 
      logoPreview: localPreviewUrl, 
      logoFile: file,
      logo: ''
    }));

    setUploading(true);
    try {
      const result = await uploadImage(file);
      
      if (result.success) {
        const imageUrl = result.url || result.data?.url;
        const fullUrl = imageUrl.startsWith('http') ? imageUrl : getLogoUrl(imageUrl);
        setForm(prev => ({ 
          ...prev, 
          logo: fullUrl,
          logoPreview: fullUrl
        }));
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter company name');
      return;
    }

    setLoading(true);
    const submitData = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      website: form.website || undefined,
      locationId: form.locationId ? parseInt(form.locationId) : undefined,
      logo: form.logo || undefined,
      status: form.status
    };

    const action = selectedCompany 
      ? updateCompany(selectedCompany.id, submitData)
      : createCompany(submitData);

    const result = await action;
    if (result.success) {
      await fetchCompanies();
      setOpen(false);
      resetForm();
    } else {
      alert(result.error?.message || 'Action failed');
    }
    setLoading(false);
  };

  const handleSave = () => {
    const formEvent = new Event('submit', { bubbles: true });
    const formElement = document.getElementById('company-form');
    if (formElement) {
      formElement.dispatchEvent(formEvent);
    }
  };

  const resetForm = () => {
    setSelectedCompany(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      website: '',
      locationId: '',
      logo: '',
      logoFile: null,
      logoPreview: '',
      status: 'active'
    });
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setForm({
      name: company.name,
      email: company.email || '',
      phone: company.phone || '',
      website: company.website || '',
      locationId: company.locationId?.toString() || '',
      logo: company.logo || '',
      logoFile: null,
      logoPreview: company.logo || '',
      status: company.status
    });
    setOpen(true);
  };

  const handleView = (company) => {
    setSelectedCompany(company);
    setViewOpen(true);
  };

  const confirmDelete = (company) => {
    setDeleteTarget(company);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteCompany(deleteTarget.id);
    if (result.success) {
      await fetchCompanies();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert(result.error?.message || 'Failed to delete company');
    }
    setLoading(false);
  };

  const getLocationDisplay = (company) => {
    if (company.location) {
      return `${company.location.city}, ${company.location.state}`;
    }
    return '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Companies</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all registered companies</p>
        </div>
        <Button icon="building" onClick={() => { resetForm(); setOpen(true); }}>
          Add Company
        </Button>
      </div>

      {/* Stats Cards - Updated to ApplicationsPage style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="building" tone="primary" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Total Companies</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.total}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="check-circle" tone="success" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Active</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.active}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="x-circle" tone="danger" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Inactive</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.inactive}</div>
        </Card>
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader title="All Companies" subtitle={`${filteredCompanies.length} companies found`} />
        
        {/* Responsive Search Bar - Reduced Width */}
        <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="search"
              className="w-full"
            />
          </div>
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
            placeholder="All Status"
            className="w-full sm:w-44"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH className="w-20">Logo</TH>
                <TH>Company Name</TH>
                <TH className="hidden sm:table-cell">Email</TH>
                <TH className="hidden md:table-cell">Phone</TH>
                <TH className="hidden lg:table-cell">Location</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {loading && companies.length === 0 ? (
                <TR>
                  <TD colSpan={7} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filteredCompanies.length === 0 ? (
                <TR>
                  <TD colSpan={7} className="text-center py-8 text-slate-500">
                    No companies found
                  </TD>
                </TR>
              ) : (
                filteredCompanies.map((c) => (
                  <TR key={c.id}>
                    <TD>
                      <div className="w-10 h-10 sm:w-12 sm:h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                        <img 
                          src={c.logo || 'https://placehold.co/48x40/f1f5f9/94a3b8?text=Logo'} 
                          alt={c.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/48x40/f1f5f9/94a3b8?text=Logo'; 
                          }}
                        />
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900 truncate">{c.name}</span>
                      </div>
                    </TD>
                    <TD className="text-sm text-slate-600 hidden sm:table-cell">{c.email || '-'}</TD>
                    <TD className="text-sm text-slate-600 hidden md:table-cell">{c.phone || '-'}</TD>
                    <TD className="text-sm text-slate-600 hidden lg:table-cell">{getLocationDisplay(c)}</TD>
                    <TD>
                      <Badge tone={statusTone(c.status)} dot>
                        {c.status}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleView(c)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
                          title="View Details"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(c)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 text-white hover:bg-black transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => confirmDelete(c)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all duration-200"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* View Company Modal */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Company Details"
        subtitle="View complete company information"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selectedCompany && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center shadow-premium overflow-hidden">
                {selectedCompany.logo ? (
                  <img
                    src={selectedCompany.logo}
                    className="w-full h-full object-cover"
                    alt={selectedCompany.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/100x100/f1f5f9/94a3b8?text=Logo';
                    }}
                  />
                ) : (
                  <Icon name="building" size={32} className="text-indigo-500" />
                )}
              </div>
            </div>
            
            <p className="text-base font-bold text-slate-900">{selectedCompany.name}</p>
            <p className="text-xs font-bold text-slate-500 -mt-2">Company Information</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email</span>
                <span className="text-xs text-slate-700 max-w-[55%] break-words text-right">{selectedCompany.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Phone</span>
                <span className="text-xs text-slate-700 text-right">{selectedCompany.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Website</span>
                <span className="text-xs text-right max-w-[55%] break-words">
                  {selectedCompany.website ? (
                    <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{selectedCompany.website}</a>
                  ) : 'Not provided'}
                </span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Location</span>
                <span className="text-xs text-slate-700 text-right">{getLocationDisplay(selectedCompany)}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</span>
                <Badge tone={statusTone(selectedCompany.status)} dot>{selectedCompany.status}</Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Company Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selectedCompany ? 'Edit Company' : 'Add Company'}
        subtitle={selectedCompany ? 'Update company information' : 'Add a new company'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button icon="check" onClick={handleSave} loading={loading}>
              {selectedCompany ? 'Save Changes' : 'Create Company'}
            </Button>
          </>
        }
      >
        <form id="company-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-slate-900 text-center">Company Logo</h3>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="logo-upload"
              disabled={uploading}
            />

            <div className="flex justify-center">
              <div
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="w-44 h-44 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer"
              >
                {form.logoPreview ? (
                  <>
                    <img
                      src={form.logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                      <span className="text-white text-xs font-bold opacity-0 hover:opacity-100 uppercase tracking-wider pointer-events-none">Change</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm({...form, logo: '', logoPreview: '', logoFile: null});
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-white/90 text-rose-500 rounded-full flex items-center justify-center shadow hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Icon name="x" size={10} strokeWidth={3} />
                    </button>
                  </>
                ) : (
                  <>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span className="text-xs font-semibold text-slate-500 mt-2">Upload Logo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Click or drag</span>
                  </>
                )}
              </div>
            </div>

            <div className="text-center mt-3">
              {uploading && (
                <span className="inline-flex items-center gap-2 text-sm text-indigo-600 font-medium">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75"/>
                  </svg>
                  Uploading logo...
                </span>
              )}
              {form.logo && !uploading && (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Logo uploaded successfully
                </span>
              )}
              {!form.logo && !uploading && (
                <span className="text-xs text-slate-400">PNG, JPG or GIF &bull; Max 5MB</span>
              )}
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-slate-900">Company Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="Company Name"
                placeholder="Enter company name" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} 
                required 
              />
              
              <Input 
                label="Email"
                type="email"
                placeholder="contact@company.com" 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})} 
              />
              
              <Input 
                label="Phone"
                placeholder="+1 234 567 8900" 
                value={form.phone} 
                onChange={(e) => setForm({...form, phone: e.target.value})} 
              />
              
              <Input 
                label="Website"
                placeholder="https://company.com" 
                value={form.website} 
                onChange={(e) => setForm({...form, website: e.target.value})} 
              />
              
              <Select 
                label="Location"
                value={form.locationId}
                onChange={(e) => setForm({...form, locationId: e.target.value})}
                options={locations.map((loc) => ({ value: loc.id, label: `${loc.city}, ${loc.state}` }))}
                placeholder="Select location"
              />
              
              {selectedCompany && (
                <Select 
                  label="Status"
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => { if (!loading) { setDeleteOpen(false); setDeleteTarget(null); } }}
        title="Delete Company"
        subtitle="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }} disabled={loading}>
              Cancel
            </Button>
            <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete} loading={loading}>
              Delete Company
            </Button>
          </>
        }
      >
        {deleteTarget && (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Delete "{deleteTarget.name}"?
            </p>
            <p className="text-xs text-slate-500">
              This will permanently remove this company<br />and all associated data from the system.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompaniesPage;