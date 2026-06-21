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

export const HrManagementPage = () => {
  const [open, setOpen] = useState(false);
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
    fetchHrs();
    fetchCompanies();
  }, []);

  const fetchHrs = async () => {
    const result = await getHrs();
    if (result.success) {
      const hrsOnly = result.data.filter(user => user.role?.toUpperCase() === 'HR');
      setHrList(hrsOnly);
      updateStats(hrsOnly);
    }
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
    setLoading(true);

    if (selectedHr) {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;

      const result = await updateHr(selectedHr.id, updateData);
      if (result.success) {
        await fetchHrs();
        setOpen(false);
        setSelectedHr(null);
        setForm({ name: '', email: '', password: '', mobile: '', designation: '', companyId: '', status: 'active' });
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
        setForm({ name: '', email: '', password: '', mobile: '', designation: '', companyId: '', status: 'active' });
      } else {
        alert(result.error?.message || 'Failed to create HR');
      }
    }
    setLoading(false);
  };

  const handleEdit = (hr) => {
    setSelectedHr(hr);
    setForm({
      name: hr.name,
      email: hr.email,
      password: '',
      mobile: hr.mobile,
      designation: hr.designation,
      companyId: hr.companyId || '',
      status: hr.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to restrict this HR account?')) {
      const result = await deleteHr(id);
      if (result.success) fetchHrs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage HR accounts with admin panel access</p>
        </div>
        <Button
          icon="user-plus"
          onClick={() => {
            setSelectedHr(null);
            setForm({ name: '', email: '', password: '', mobile: '', designation: '', companyId: '', status: 'active' });
            setOpen(true);
          }}
        >
          Add New HR
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="users" tone="primary" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total HRs</div>
            <div className="text-xl font-bold text-slate-900">{stats.total}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="user-check" tone="success" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active HR</div>
            <div className="text-xl font-bold text-slate-900">{stats.active}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="user-x" tone="danger" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inactive</div>
            <div className="text-xl font-bold text-slate-900">{stats.inactive}</div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="HR Accounts" subtitle="All users with role: HR" />
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
              { value: 'inactive', label: 'Inactive' },
            ]}
            placeholder="All Status"
            className="md:w-44"
          />
        </div>
        <div className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>HR Member</TH>
                <TH>Designation</TH>
                <TH>Contact</TH>
                <TH>Role</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredHrs.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-center py-8 text-slate-500">
                    No HR accounts found
                  </TD>
                </TR>
              ) : (
                filteredHrs.map((hr) => (
                  <TR key={hr.id}>
                    <TD>
                      <div className="font-semibold text-slate-900">{hr.name}</div>
                      <div className="text-xs text-slate-400">{hr.email}</div>
                    </TD>
                    <TD className="text-sm text-slate-600">{hr.designation || 'N/A'}</TD>
                    <TD className="text-sm text-slate-600">{hr.mobile}</TD>
                    <TD>
                      <Badge tone="primary">{hr.role?.replace('_', ' ')}</Badge>
                    </TD>
                    <TD>
                      <Badge tone={hr.status === 'active' ? 'success' : 'default'} dot>
                        {hr.status || 'active'}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(hr)} />
                        <Button
                          variant="ghost"
                          size="xs"
                          icon="trash-2"
                          className="text-rose-500"
                          onClick={() => handleDelete(hr.id)}
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

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="md"
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

export default HrManagementPage;