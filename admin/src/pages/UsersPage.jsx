import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { recentUsers } from '../data/mockData';

const statusTone = (s) => ({ active: 'success', pending: 'warning', inactive: 'default' }[s] || 'default');

const userStats = [
  { label: 'Total Users', value: '12,847', icon: 'users', tone: 'primary' },
  { label: 'Active', value: '9,420', icon: 'check-circle', tone: 'success' },
  { label: 'Pending', value: '342', icon: 'clock', tone: 'warning' },
  { label: 'Inactive', value: '3,085', icon: 'circle-pause', tone: 'danger' },
];

export const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [view, setView] = useState(null);

  const filtered = recentUsers.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    const matchRole = !role || u.role === role;
    const matchStatus = !status || u.status === status;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all registered users on the platform</p>
        </div>
        <div className="flex gap-2">
          <Button icon="user-plus">Add User</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <ToneIcon icon={s.icon} tone={s.tone} size="md" />
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{s.label}</div>
              <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="All Users" subtitle={`${filtered.length} users found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
            className="flex-1"
          />
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'Job Seeker', label: 'Job Seeker' },
              { value: 'Employer', label: 'Employer' },
              { value: 'Recruiter', label: 'Recruiter' },
            ]}
            placeholder="All Roles"
            className="md:w-48"
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            placeholder="All Status"
            className="md:w-48"
          />
        </div>
        <Table>
          <THead>
            <TR>
              <TH>User</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH>Joined</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((u) => (
              <TR key={u.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" status={u.status === 'active' ? 'online' : 'offline'} />
                    <div>
                      <div className="font-semibold text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </TD>
                <TD><Badge tone="primary">{u.role}</Badge></TD>
                <TD><Badge tone={statusTone(u.status)} dot>{u.status}</Badge></TD>
                <TD className="text-sm text-slate-500">{u.joined}</TD>
                <TD align="right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="xs" icon="eye" onClick={() => setView(u)} />
                    <Button variant="ghost" size="xs" icon="pencil" />
                    <Button variant="ghost" size="xs" icon="more-vertical" />
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 1-{filtered.length} of {recentUsers.length} users</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" icon="chevron-left">Prev</Button>
            <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-xs font-semibold">2</button>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-xs font-semibold">3</button>
            <Button variant="ghost" size="sm" iconRight="chevron-right">Next</Button>
          </div>
        </div>
      </Card>

      <Modal open={!!view} onClose={() => setView(null)} title={view?.name} subtitle={view?.email} size="lg">
        {view && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={view.name} size="xl" status={view.status === 'active' ? 'online' : 'offline'} />
              <div>
                <h4 className="text-lg font-bold text-slate-900">{view.name}</h4>
                <p className="text-sm text-slate-500">{view.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge tone="primary">{view.role}</Badge>
                  <Badge tone={statusTone(view.status)} dot>{view.status}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50">
                <div className="text-xs text-slate-500">Joined</div>
                <div className="font-semibold text-slate-900">{view.joined}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <div className="text-xs text-slate-500">Applications</div>
                <div className="font-semibold text-slate-900">12</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;
