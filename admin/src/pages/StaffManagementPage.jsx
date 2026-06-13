import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ToneIcon } from '../components/ui/ToneIcon';
import { createAdmin, getCurrentUser, isAuthenticated, getAdmins, updateAdmin, deleteAdmin } from '../api/auth';

export const StaffManagementPage = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]); // Empty array - no hardcoded data
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    restricted: 0
  });
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '', // Added mobile field
    designation: '', // Added designation field
    status: 'active' // Add status field with a default
  });

  // Check authentication and role on component mount
  useEffect(() => {
    const user = getCurrentUser();
    const role = user?.role?.toUpperCase() || '';
    if (!isAuthenticated() || !role.includes('ADMIN')) {
      window.location.href = '/login';
    }
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const result = await getAdmins();
    if (result.success) {
      // Filter out SUPER_ADMIN accounts to show only standard ADMINs
      const adminsOnly = result.data.filter(user => user.role === 'ADMIN');
      setStaffList(adminsOnly);
      updateStats(adminsOnly);
    }
  };

  // Filter staff based on search
  const filteredStaff = staffList.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || 
                         user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (selectedStaff) {
      // Remove password from form data for updates if it's empty to avoid validation errors
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;

      const result = await updateAdmin(selectedStaff.id, updateData);
      if (result.success) {
        await fetchStaff();
        setOpen(false);
        setSelectedStaff(null);
        setForm({ name: '', email: '', password: '', mobile: '', designation: '', status: 'active' });
      }
    } else {
      // Create new admin using the API function
      const result = await createAdmin(form);
      
      if (result.success) {
        await fetchStaff();
        setOpen(false); // Close modal on success
        setForm({ name: '', email: '', password: '', mobile: '', designation: '', status: 'active' }); // Reset form
      } else {
        alert(result.message || 'Failed to create admin');
      }
    }
    setLoading(false);
  };

  const updateStats = (list) => {
    const total = list.length;
    const active = list.filter(staff => !staff.status || staff.status === 'active').length;
    const restricted = list.filter(staff => staff.status === 'inactive').length;
    setStats({ total, active, restricted });
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setForm({
      name: staff.name,
      email: staff.email,
      password: '',
      mobile: staff.mobile,
      designation: staff.designation,
      status: staff.status // Populate status for editing
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to restrict this admin account?')) {
      const result = await deleteAdmin(id);
      if (result.success) fetchStaff();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage administrative access and team roles</p>
        </div>
        <Button 
          icon="user-plus" 
          onClick={() => {
            setSelectedStaff(null); // Clear selected staff for new creation
            setForm({ name: '', email: '', password: '', mobile: '', designation: '', status: 'active' }); // Reset form with default status
            setOpen(true);
          }}
        >
          Add New Admin
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="shield" tone="primary" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Admins</div>
            <div className="text-xl font-bold text-slate-900">{stats.total}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="user-check" tone="success" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Staff</div>
            <div className="text-xl font-bold text-slate-900">{stats.active}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="user-x" tone="danger" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Restricted</div>
            <div className="text-xl font-bold text-slate-900">{stats.restricted}</div>
          </div>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader 
          title="Administrative Accounts" 
          subtitle="Comprehensive list of users with backend access"
        />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all"
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
            className="md:w-44"
          />
        </div>
        <div className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Staff Member</TH>
                <TH>Designation</TH>
                <TH>Contact</TH>
                <TH>Role</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredStaff.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center py-8 text-slate-500">
                    No staff members found
                  </TD>
                </TR>
              ) : (
                filteredStaff.map((staff) => (
                  <TR key={staff.id}>
                    <TD>
                      <div className="font-semibold text-slate-900">{staff.name}</div>
                      <div className="text-xs text-slate-400">{staff.email}</div>
                    </TD>
                    <TD className="text-sm text-slate-600">{staff.designation || 'N/A'}</TD>
                    <TD className="text-sm text-slate-600">{staff.mobile}</TD>
                    <TD>
                      <Badge tone={staff.role === 'SUPER_ADMIN' ? 'purple' : 'primary'}>
                        {staff.role?.replace('_', ' ')}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge tone={staff.status === 'active' ? 'success' : 'default'} dot>
                        {staff.status || 'active'}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(staff)} />
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          icon="trash-2" 
                          className="text-rose-500" 
                          onClick={() => handleDelete(staff.id)}
                        />
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* Create/Edit Admin Modal */}
      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        size="md"
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Mobile Number *</label>
              <Input 
                placeholder="+1..." 
                value={form.mobile} 
                onChange={(e) => setForm({...form, mobile: e.target.value})} 
                required 
              />
            </div>
            {/* Conditionally render password field */}
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
            {/* Status Dropdown */}
            {selectedStaff && ( // Only show status dropdown when editing
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
    </div>
  );
};

export default StaffManagementPage;