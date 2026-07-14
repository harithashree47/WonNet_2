import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Key } from 'lucide-react';
import { createAdmin, getCurrentUser, isAuthenticated, getAdmins, updateAdmin, deleteAdmin } from '../api/auth';

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

export const StaffManagementPage = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    restricted: 0
  });
  const [resetPwStaff, setResetPwStaff] = useState(null);
  const [resetPwOpen, setResetPwOpen] = useState(false);
  const [resetNewPw, setResetNewPw] = useState('');
  const [resetPwLoading, setResetPwLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('wonnet_admin');
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    designation: '',
    status: 'active'
  });

  useEffect(() => {
    const user = getCurrentUser();
    const role = user?.role?.toUpperCase() || '';
    if (!isAuthenticated() || !role.includes('ADMIN')) {
      window.location.href = '/login';
    }
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    const result = await getAdmins();
    if (result.success) {
      const adminsOnly = result.data.filter(user => user.role === 'ADMIN');
      setStaffList(adminsOnly);
      updateStats(adminsOnly);
    }
    setLoading(false);
  };

  const updateStats = (list) => {
    const total = list.length;
    const active = list.filter(staff => !staff.status || staff.status === 'active').length;
    const restricted = list.filter(staff => staff.status === 'inactive').length;
    setStats({ total, active, restricted });
  };

  const filteredStaff = staffList.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || 
                         user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert('Please enter staff name');
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
    if (!selectedStaff && !form.password.trim()) {
      alert('Please enter a password');
      return;
    }

    setLoading(true);

    if (selectedStaff) {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;

      const result = await updateAdmin(selectedStaff.id, updateData);
      if (result.success) {
        await fetchStaff();
        setOpen(false);
        setSelectedStaff(null);
        resetForm();
      } else {
        alert(result.message || 'Failed to update admin');
      }
    } else {
      const result = await createAdmin(form);
      if (result.success) {
        await fetchStaff();
        setOpen(false);
        resetForm();
      } else {
        alert(result.message || 'Failed to create admin');
      }
    }
    setLoading(false);
  };

  const handleSave = () => {
    const formEvent = new Event('submit', { bubbles: true });
    const formElement = document.getElementById('staff-form');
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
      status: 'active'
    });
  };

  const handleView = (staff) => {
    setSelectedStaff(staff);
    setViewOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setForm({
      name: staff.name,
      email: staff.email,
      password: '',
      mobile: staff.mobile || '',
      designation: staff.designation || '',
      status: staff.status || 'active'
    });
    setOpen(true);
  };

  const confirmDelete = (staff) => {
    setDeleteTarget(staff);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteAdmin(deleteTarget.id);
    if (result.success) {
      await fetchStaff();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert(result.message || 'Failed to delete admin');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetPwStaff || resetNewPw.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    setResetPwLoading(true);
    try {
      const API_BASE_URL = 'http://localhost:3000';
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: resetPwStaff.email, newPassword: resetNewPw }),
      });
      if (response.ok) {
        alert(`Password reset successfully for ${resetPwStaff.name}`);
        setResetPwOpen(false);
        setResetPwStaff(null);
        setResetNewPw('');
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to reset password');
      }
    } catch (error) {
      alert('Network error occurred');
    } finally {
      setResetPwLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Staff Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage administrative access and team roles</p>
        </div>
        <Button 
          icon="user-plus" 
          onClick={() => {
            setSelectedStaff(null);
            resetForm();
            setOpen(true);
          }}
        >
          Add New Admin
        </Button>
      </div>

      {/* Stats Cards - Updated to ApplicationsPage style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="shield" tone="primary" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Total Admins</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.total}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="user-check" tone="success" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Active Staff</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.active}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="user-x" tone="danger" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Restricted</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.restricted}</div>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader 
          title="Administrative Accounts" 
          subtitle={`${filteredStaff.length} staff members found`}
        />
        
        {/* Search and Filter - Responsive */}
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
              { value: 'inactive', label: 'Inactive' }
            ]}
            placeholder="All Status"
            className="w-full sm:w-44"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Staff Member</TH>
                <TH className="hidden sm:table-cell">Designation</TH>
                <TH className="hidden md:table-cell">Contact</TH>
                <TH className="hidden lg:table-cell">Role</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {loading && staffList.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filteredStaff.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center py-8 text-slate-500">
                    No staff members found
                  </TD>
                </TR>
              ) : (
                filteredStaff.map((staff) => (
                  <TR key={staff.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs flex-shrink-0">
                          {staff.name?.charAt(0) || 'S'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{staff.name}</div>
                          <div className="text-xs text-slate-400 truncate">{staff.email}</div>
                        </div>
                      </div>
                    </TD>
                    <TD className="text-sm text-slate-600 hidden sm:table-cell">{staff.designation || 'N/A'}</TD>
                    <TD className="text-sm text-slate-600 hidden md:table-cell">{staff.mobile || 'N/A'}</TD>
                    <TD className="hidden lg:table-cell">
                      <Badge tone={staff.role === 'SUPER_ADMIN' ? 'purple' : 'primary'}>
                        {staff.role?.replace('_', ' ')}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge tone={statusTone(staff.status || 'active')} dot>
                        {staff.status || 'active'}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleView(staff)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
                          title="View Details"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Reset Password Button - SUPER_ADMIN only */}
                        {currentUser?.role === 'SUPER_ADMIN' && staff.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => { setResetPwStaff(staff); setResetPwOpen(true); }}
                            className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-600 transition-all duration-200"
                            title="Reset Password"
                          >
                            <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(staff)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 text-white hover:bg-black transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => confirmDelete(staff)}
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

      {/* View Staff Modal */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Staff Details"
        subtitle="View complete staff information"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selectedStaff && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-700">{selectedStaff.name?.charAt(0) || 'S'}</span>
              </div>
            </div>
            <p className="text-base font-bold text-slate-900">{selectedStaff.name}</p>
            <p className="text-xs font-bold text-slate-500 -mt-2">Staff Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email</span>
                <span className="text-xs text-slate-700">{selectedStaff.email}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Designation</span>
                <span className="text-xs text-slate-700">{selectedStaff.designation || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Mobile</span>
                <span className="text-xs text-slate-700">{selectedStaff.mobile || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Role</span>
                <Badge tone={selectedStaff.role === 'SUPER_ADMIN' ? 'purple' : 'primary'}>
                  {selectedStaff.role?.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</span>
                <Badge tone={statusTone(selectedStaff.status || 'active')} dot>
                  {selectedStaff.status || 'active'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Staff Modal */}
      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        size="lg"
        title={selectedStaff ? 'Edit Admin Account' : 'Create Admin Account'}
        subtitle="Provide credentials and details for the administrator"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="staff-form" loading={loading}>
              {selectedStaff ? 'Update Account' : 'Create Account'}
            </Button>
          </>
        }
      >
        <form id="staff-form" onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="e.g. System Admin" 
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
              placeholder="admin@won.net" 
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
            {!selectedStaff && (
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
          </div>
          {selectedStaff && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Password (Optional)</label>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                />
              </div>
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
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => { if (!loading) { setDeleteOpen(false); setDeleteTarget(null); } }}
        title="Delete Admin Account"
        subtitle="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }} disabled={loading}>
              Cancel
            </Button>
            <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete} loading={loading}>
              Delete Admin
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
              This will permanently remove this admin account<br />and all associated data from the system.
            </p>
          </div>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        open={resetPwOpen}
        onClose={() => { setResetPwOpen(false); setResetPwStaff(null); setResetNewPw(''); }}
        title="Reset Password"
        subtitle={`Changing password for ${resetPwStaff?.name || '...'}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setResetPwOpen(false); setResetPwStaff(null); setResetNewPw(''); }}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={resetPwLoading || resetNewPw.length < 8} loading={resetPwLoading}>
              Reset Password
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-4">
          {resetPwStaff && (
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Key className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm font-semibold text-slate-900">{resetPwStaff.name}</p>
              <p className="text-xs text-slate-500">{resetPwStaff.email}</p>
            </div>
          )}
          <Input
            type="password"
            label="New Password"
            placeholder="Enter new password (min 8 characters)"
            value={resetNewPw}
            onChange={(e) => setResetNewPw(e.target.value)}
            hint="Must be at least 8 characters"
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagementPage;