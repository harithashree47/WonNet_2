import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ToneIcon } from '../components/ui/ToneIcon';
import { getHrs, createHr, updateHr, deleteHr } from '../api/hr';
import { getCompanies } from '../api/company';
import { isAuthenticated, getCurrentUser } from '../api/auth';

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

export const HrManagementPage = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedHr, setSelectedHr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hrList, setHrList] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    designation: '',
    companyId: '',
    status: 'active',
  });

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchHrs();
    fetchCompanies();
  }, []);

  const fetchHrs = async () => {
    setLoading(true);
    const result = await getHrs();
    if (result.success) {
      const hrsOnly = result.data.filter(user => user.role?.toUpperCase() === 'HR');
      setHrList(hrsOnly);
      updateStats(hrsOnly);
    }
    setLoading(false);
  };

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    const result = await getCompanies();
    if (result.success) {
      setCompanies(result.data || []);
    }
    setLoadingCompanies(false);
  };

  const filteredHrs = hrList.filter(hr => {
    const matchesSearch = hr.name?.toLowerCase().includes(search.toLowerCase()) ||
      hr.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || hr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStats = (list) => {
    const total = list.length;
    const active = list.filter(hr => !hr.status || hr.status === 'active').length;
    const inactive = list.filter(hr => hr.status === 'inactive').length;
    setStats({ total, active, inactive });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert('Please enter HR name');
      return;
    }
    if (!form.email.trim()) {
      alert('Please enter email address');
      return;
    }
    if (!form.mobile.trim()) {
      alert('Please enter mobile number');
      return;
    }
    if (!selectedHr && !form.password.trim()) {
      alert('Please enter a password');
      return;
    }

    setLoading(true);

    if (selectedHr) {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;

      const result = await updateHr(selectedHr.id, updateData);
      if (result.success) {
        await fetchHrs();
        setOpen(false);
        setSelectedHr(null);
        resetForm();
      } else {
        alert(result.error?.message || 'Failed to update HR');
      }
    } else {
      const { status, companyId, ...rest } = form;
      const payload = {
        ...rest,
        companyId: companyId ? Number(companyId) : undefined,
      };
      const result = await createHr(payload);
      if (result.success) {
        await fetchHrs();
        setOpen(false);
        resetForm();
      } else {
        alert(result.error?.message || 'Failed to create HR');
      }
    }
    setLoading(false);
  };

  const handleSave = () => {
    const formEvent = new Event('submit', { bubbles: true });
    const formElement = document.getElementById('hr-form');
    if (formElement) {
      formElement.dispatchEvent(formEvent);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      mobile: '',
      designation: '',
      companyId: '',
      status: 'active',
    });
  };

  const handleView = (hr) => {
    setSelectedHr(hr);
    setViewOpen(true);
  };

  const handleEdit = (hr) => {
    setSelectedHr(hr);
    setForm({
      name: hr.name,
      email: hr.email,
      password: '',
      mobile: hr.mobile || '',
      designation: hr.designation || '',
      companyId: hr.companyId?.toString() || '',
      status: hr.status || 'active',
    });
    setOpen(true);
  };

  const confirmDelete = (hr) => {
    setDeleteTarget(hr);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteHr(deleteTarget.id);
    if (result.success) {
      await fetchHrs();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert(result.error?.message || 'Failed to delete HR');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">HR Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage HR accounts with admin panel access</p>
        </div>
        <Button
          icon="user-plus"
          onClick={() => {
            setSelectedHr(null);
            resetForm();
            setOpen(true);
          }}
        >
          Add New HR
        </Button>
      </div>

      {/* Stats Cards - Updated to ApplicationsPage style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="users" tone="primary" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Total HRs</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.total}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="user-check" tone="success" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Active HR</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.active}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="user-x" tone="danger" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Inactive</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.inactive}</div>
        </Card>
      </div>

      {/* HR Table */}
      <Card>
        <CardHeader title="HR Accounts" subtitle={`${filteredHrs.length} HRs found`} />
        
        {/* Search and Filter */}
        <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="search"
              className="w-full"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            placeholder="All Status"
            className="w-full sm:w-44"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>HR Member</TH>
                <TH className="hidden sm:table-cell">Designation</TH>
                <TH className="hidden md:table-cell">Contact</TH>
                <TH className="hidden lg:table-cell">Role</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {loading && hrList.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filteredHrs.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center py-8 text-slate-500">
                    No HR accounts found
                  </TD>
                </TR>
              ) : (
                filteredHrs.map((hr) => (
                  <TR key={hr.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                          {hr.name?.charAt(0) || 'H'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{hr.name}</div>
                          <div className="text-xs text-slate-400">{hr.email}</div>
                        </div>
                      </div>
                    </TD>
                    <TD className="text-sm text-slate-600 hidden sm:table-cell">{hr.designation || 'N/A'}</TD>
                    <TD className="text-sm text-slate-600 hidden md:table-cell">{hr.mobile || 'N/A'}</TD>
                    <TD className="hidden lg:table-cell">
                      <Badge tone="primary">{hr.role?.replace('_', ' ')}</Badge>
                    </TD>
                    <TD>
                      <Badge tone={statusTone(hr.status || 'active')} dot>
                        {hr.status || 'active'}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleView(hr)}
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
                          onClick={() => handleEdit(hr)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 text-white hover:bg-black transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => confirmDelete(hr)}
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

      {/* View HR Modal */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="HR Details"
        subtitle="View complete HR information"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selectedHr && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-lg font-bold text-indigo-700">{selectedHr.name?.charAt(0) || 'H'}</span>
              </div>
            </div>
            <p className="text-base font-bold text-slate-900">{selectedHr.name}</p>
            <p className="text-xs font-bold text-slate-500 -mt-2">HR Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email</span>
                <span className="text-xs text-slate-700">{selectedHr.email}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Designation</span>
                <span className="text-xs text-slate-700">{selectedHr.designation || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Mobile</span>
                <span className="text-xs text-slate-700">{selectedHr.mobile || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Role</span>
                <Badge tone="primary">{selectedHr.role?.replace('_', ' ')}</Badge>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</span>
                <Badge tone={statusTone(selectedHr.status || 'active')} dot>{selectedHr.status || 'active'}</Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit HR Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={selectedHr ? 'Edit HR Account' : 'Create HR Account'}
        subtitle="Provide credentials and details for the HR user"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="hr-form" loading={loading}>
              {selectedHr ? 'Update Account' : 'Create Account'}
            </Button>
          </>
        }
      >
        <form id="hr-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Full Name *</label>
              <Input
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Designation *</label>
              <Input
                placeholder="e.g. HR Manager"
                value={form.designation}
                onChange={(e) => setForm({...form, designation: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Email Address *</label>
            <Input
              type="email"
              placeholder="hr@won.net"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Mobile Number *</label>
              <Input
                placeholder="+1..."
                value={form.mobile}
                onChange={(e) => setForm({...form, mobile: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Company *</label>
              <select
                value={form.companyId}
                onChange={(e) => setForm({...form, companyId: e.target.value ? Number(e.target.value) : ''})}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {loadingCompanies && <p className="text-[10px] text-slate-400 mt-1">Loading companies...</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!selectedHr && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Password *</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  required
                />
              </div>
            )}
            {selectedHr && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Password (Optional)</label>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                />
              </div>
            )}
            {selectedHr && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Status *</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => { if (!loading) { setDeleteOpen(false); setDeleteTarget(null); } }}
        title="Delete HR Account"
        subtitle="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }} disabled={loading}>
              Cancel
            </Button>
            <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete} loading={loading}>
              Delete HR
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
              This will permanently remove this HR account<br />and all associated data from the system.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HrManagementPage;