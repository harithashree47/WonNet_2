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

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

export const CompaniesPage = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    locationId: '',
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
      setCompanies(result.data);
      updateStats(result.data);
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
      status: company.status
    });
    setOpen(true);
  };

  const handleView = (company) => {
    setSelectedCompany(company);
    setViewOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete company "${name}"?`)) {
      setLoading(true);
      const result = await deleteCompany(id);
      if (result.success) {
        await fetchCompanies();
      } else {
        alert(result.error?.message || 'Failed to delete company');
      }
      setLoading(false);
    }
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="building" tone="primary" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Companies</div>
            <div className="text-xl font-extrabold text-slate-900">{stats.total}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="check-circle" tone="success" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active</div>
            <div className="text-xl font-extrabold text-slate-900">{stats.active}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="x-circle" tone="danger" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Inactive</div>
            <div className="text-xl font-extrabold text-slate-900">{stats.inactive}</div>
          </div>
        </Card>
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader title="All Companies" subtitle={`${filteredCompanies.length} companies found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
            placeholder="All Status"
            className="md:w-44"
          />
        </div>
        <div className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Company Name</TH>
                <TH>Email</TH>
                <TH>Phone</TH>
                <TH>Location</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {loading && companies.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filteredCompanies.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center py-8 text-slate-500">
                    No companies found
                  </TD>
                </TR>
              ) : (
                filteredCompanies.map((c) => (
                  <TR key={c.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {c.name?.charAt(0) || 'C'}
                        </div>
                        <span className="font-semibold text-slate-900">{c.name}</span>
                      </div>
                    </TD>
                    <TD className="text-sm text-slate-600">{c.email || '-'}</TD>
                    <TD className="text-sm text-slate-600">{c.phone || '-'}</TD>
                    <TD className="text-sm text-slate-600">{getLocationDisplay(c)}</TD>
                    <TD>
                      <Badge tone={statusTone(c.status)} dot>
                        {c.status}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" icon="eye" onClick={() => handleView(c)} />
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(c)} />
                        <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => handleDelete(c.id, c.name)} />
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
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selectedCompany && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                {selectedCompany.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedCompany.name}</h2>
                <p className="text-sm text-slate-500">Company Information</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-sm text-slate-800 mt-1">{selectedCompany.email || 'Not provided'}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Phone</p>
                <p className="text-sm text-slate-800 mt-1">{selectedCompany.phone || 'Not provided'}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Website</p>
                <p className="text-sm text-slate-800 mt-1">
                  {selectedCompany.website ? (
                    <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      {selectedCompany.website}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Location</p>
                <p className="text-sm text-slate-800 mt-1">{getLocationDisplay(selectedCompany)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status</p>
                <p className="mt-1">
                  <Badge tone={statusTone(selectedCompany.status)} dot>
                    {selectedCompany.status}
                  </Badge>
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Company ID</p>
                <p className="text-sm text-slate-800 mt-1 font-mono">#{selectedCompany.id}</p>
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
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button icon="check" onClick={handleSave} loading={loading}>
              {selectedCompany ? 'Save Changes' : 'Create Company'}
            </Button>
          </>
        }
      >
        <form id="company-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Company Name *</label>
              <Input 
                placeholder="e.g. Tech Corp" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Email</label>
              <Input 
                type="email"
                placeholder="contact@company.com" 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Phone</label>
              <Input 
                placeholder="+1 234 567 8900" 
                value={form.phone} 
                onChange={(e) => setForm({...form, phone: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Website</label>
              <Input 
                placeholder="https://company.com" 
                value={form.website} 
                onChange={(e) => setForm({...form, website: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Location</label>
            <select
              value={form.locationId}
              onChange={(e) => setForm({...form, locationId: e.target.value})}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.city}, {loc.state}
                </option>
              ))}
            </select>
          </div>

          {selectedCompany && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({...form, status: e.target.value})}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default CompaniesPage;