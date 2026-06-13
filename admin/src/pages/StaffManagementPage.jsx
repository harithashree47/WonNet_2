import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ToneIcon } from '../components/ui/ToneIcon';

// Mock data representing existing administrative staff
const INITIAL_STAFF = [
  { id: 1, name: 'Alex Thompson', email: 'alex@won.net', mobile: '+1 234 567 8901', designation: 'Operations Director', role: 'SUPER_ADMIN', status: 'active' },
  { id: 2, name: 'Sarah Chen', email: 'sarah.c@won.net', mobile: '+1 987 654 3210', designation: 'Senior HR Manager', role: 'ADMIN', status: 'active' },
  { id: 3, name: 'Michael Ross', email: 'm.ross@won.net', mobile: '+1 555 012 3456', designation: 'Technical Lead', role: 'ADMIN', status: 'inactive' },
];

export const StaffManagementPage = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    designation: ''
  });

  const filteredStaff = INITIAL_STAFF.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStaff) {
      // API logic for updating existing admin
      console.log('Updating admin:', selectedStaff.id, form);
    } else {
      // API logic for creating new admin
      console.log('Submitting new admin:', form);
    }
    setOpen(false);
    setSelectedStaff(null);
    setForm({ name: '', email: '', password: '', mobile: '', designation: '' });
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setForm({
      name: staff.name,
      email: staff.email,
      password: '', // Keep password empty unless being changed
      mobile: staff.mobile,
      designation: staff.designation
    });
    setOpen(true);
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
            setSelectedStaff(null);
            setForm({ name: '', email: '', password: '', mobile: '', designation: '' });
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
            <div className="text-xl font-bold text-slate-900">12</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="user-check" tone="success" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Staff</div>
            <div className="text-xl font-bold text-slate-900">10</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="user-x" tone="danger" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Restricted</div>
            <div className="text-xl font-bold text-slate-900">2</div>
          </div>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader 
          title="Administrative Accounts" 
          subtitle="Comprehensive list of users with backend access"
        />
        <div className="px-6 pb-4">
          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search staff members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>
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
              {filteredStaff.map((staff) => (
                <TR key={staff.id}>
                  <TD>
                    <div className="font-semibold text-slate-900">{staff.name}</div>
                    <div className="text-xs text-slate-400">{staff.email}</div>
                  </TD>
                  <TD className="text-sm text-slate-600">{staff.designation}</TD>
                  <TD className="text-sm text-slate-600">{staff.mobile}</TD>
                  <TD><Badge tone={staff.role === 'SUPER_ADMIN' ? 'warning' : 'indigo'}>{staff.role.replace('_', ' ')}</Badge></TD>
                  <TD><Badge tone={staff.status === 'active' ? 'success' : 'default'} dot>{staff.status}</Badge></TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(staff)} />
                      <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" />
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* Create Admin Modal */}
      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        size="md"
        title={selectedStaff ? 'Edit Admin Account' : 'Create Admin Account'}
        subtitle="Provide credentials and details for the administrator"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="staff-form">{selectedStaff ? 'Update Account' : 'Create Account'}</Button>
          </>
        }
      >
        <form id="staff-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Full Name</label><Input placeholder="e.g. John Doe" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Designation</label><Input placeholder="e.g. System Admin" value={form.designation} onChange={(e) => setForm({...form, designation: e.target.value})} required /></div>
          </div>
          <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Email Address</label><Input type="email" placeholder="admin@won.net" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Mobile Number</label><Input placeholder="+1..." value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} required /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-slate-500">Password</label><Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required={!selectedStaff} /></div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffManagementPage;
