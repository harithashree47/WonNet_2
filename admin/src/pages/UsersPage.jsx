import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { getUsers, updateUserStatus } from '../api/auth';

const statusTone = (s) => ({ active: 'success', pending: 'warning', inactive: 'default' }[s] || 'default');

export const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [view, setView] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewMode, setViewMode] = useState('view');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const fetchUsers = async () => {
    setLoading(true);
    const res = await getUsers();
    if (res.success) {
      const transformedUsers = res.data.map((u) => ({
        id: u.id,
        name: u.name || u.email?.split('@')[0] || 'Unknown',
        email: u.email || 'N/A',
        role: u.role || 'USER',
        status: u.status || 'active', 
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      }));
      setUsers(transformedUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    const matchRole = !role || u.role.toLowerCase() === role.toLowerCase();
    const matchStatus = !status || u.status === status;
    return matchSearch && matchRole && matchStatus;
  });

  const userStats = [
    { label: 'Total Users', value: users.length.toLocaleString(), icon: 'users', tone: 'primary' },
    { label: 'Active', value: users.filter(u => u.status === 'active').length.toLocaleString(), icon: 'check-circle', tone: 'success' },
    { label: 'Other Status', value: users.filter(u => u.status !== 'active').length.toLocaleString(), icon: 'clock', tone: 'warning' },
  ];

  const confirmDelete = (user) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    // Note: You'll need to implement deleteUser API call
    alert('Delete functionality coming soon');
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userStats.map((s) => (
          <Card key={s.label} className="p-4 flex flex-col items-center justify-center">
            <ToneIcon icon={s.icon} tone={s.tone} size="md" />
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">{s.label}</div>
            <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader title="All Users" subtitle={`${filtered.length} users found`} />
        
        {/* Search and Filters */}
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            placeholder="All Status"
            className="w-full sm:w-44"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-sm text-slate-500">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>User</TH>
                  <TH className="hidden sm:table-cell">Role</TH>
                  <TH className="hidden md:table-cell">Joined</TH>
                  <TH align="right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((u) => (
                  <TR key={u.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" className="flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{u.name}</div>
                          <div className="text-xs text-slate-500 truncate">{u.email}</div>
                        </div>
                      </div>
                    </TD>
                    <TD className="hidden sm:table-cell">
                      <Badge tone="primary">{u.role}</Badge>
                    </TD>
                    <TD className="text-sm text-slate-500 hidden md:table-cell">{u.joined}</TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => { setView(u); setViewMode('view'); }}
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
                          onClick={() => { setView(u); setViewMode('edit'); }}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 text-white hover:bg-black transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => confirmDelete(u)}
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
                ))}
              </TBody>
            </Table>
          </div>
        )}
        
        {!loading && filtered.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <span>Showing 1-{filtered.length} of {filtered.length} users</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" icon="chevron-left">Prev</Button>
              <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-bold">1</button>
              <Button variant="ghost" size="sm" iconRight="chevron-right">Next</Button>
            </div>
          </div>
        )}
      </Card>

      {/* View User Modal - StaffManagement Style */}
      <Modal
        open={viewMode === 'view' && !!view}
        onClose={() => setView(null)}
        title="User Details"
        subtitle="View complete user information"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setView(null)}>Close</Button>
          </>
        }
      >
        {view && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-lg font-bold text-indigo-700">{view.name?.charAt(0) || 'U'}</span>
              </div>
            </div>
            <p className="text-base font-bold text-slate-900">{view.name}</p>
            <p className="text-xs font-bold text-slate-500 -mt-2">User Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email</span>
                <span className="text-xs text-slate-700">{view.email}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Role</span>
                <Badge tone="primary">{view.role}</Badge>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Joined</span>
                <span className="text-xs text-slate-700">{view.joined}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</span>
                <Badge tone={statusTone(view.status)} dot>{view.status}</Badge>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">User ID</span>
                <span className="text-sm text-slate-700 font-mono">#{view.id}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal - StaffManagement Style */}
      <Modal
        open={viewMode === 'edit' && !!view}
        onClose={() => setView(null)}
        title="Edit User"
        subtitle="Update user information"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setView(null)}>Cancel</Button>
            <Button 
              onClick={async () => {
                setUpdatingId(view?.id);
                const res = await updateUserStatus(view?.id, view?.status);
                if (res.success) {
                  await fetchUsers();
                  setView(null);
                } else {
                  alert('Failed to update status');
                }
                setUpdatingId(null);
              }}
              disabled={updatingId === view?.id}
              loading={updatingId === view?.id}
            >
              Update Status
            </Button>
          </>
        }
      >
        {view && (
          <div className="space-y-6">
            <div className="text-center py-2">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {view.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <p className="text-base font-bold text-slate-900 mt-2">{view.name}</p>
              <p className="text-sm text-slate-500">{view.email}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50">
                <div className="text-xs text-slate-500">Role</div>
                <div className="font-semibold text-slate-900">{view.role}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <div className="text-xs text-slate-500">Joined</div>
                <div className="font-semibold text-slate-900">{view.joined}</div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
              <select
                value={view.status}
                onChange={(e) => setView({ ...view, status: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteTarget(null); }}
        title="Delete User"
        subtitle="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }}>
              Cancel
            </Button>
            <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete}>
              Delete User
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
              This will permanently remove this user<br />and all associated data from the system.
            </p>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default UsersPage;