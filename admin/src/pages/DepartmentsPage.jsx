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
  getDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../api/department';
import { isAuthenticated, getCurrentUser } from '../api/auth';

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

export const DepartmentsPage = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({ name: '', status: 'active' });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    const result = await getDepartments();
    if (result.success) {
      setDepartments(result.data);
      updateStats(result.data);
    }
    setLoading(false);
  };

  const updateStats = (list) => {
    setStats({
      total: list.length,
      active: list.filter(d => d.status === 'active').length,
      inactive: list.filter(d => d.status === 'inactive').length,
    });
  };

  const filteredDepartments = departments.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter department name');
      return;
    }

    setLoading(true);
    const action = selectedDepartment 
      ? updateDepartment(selectedDepartment.id, { name: form.name, status: form.status })
      : createDepartment({ name: form.name, status: form.status });

    const result = await action;
    if (result.success) {
      await fetchDepartments();
      setOpen(false);
      resetForm();
    } else {
      alert(result.error?.message || 'Action failed');
    }
    setLoading(false);
  };

  const handleSave = () => {
    const formEvent = new Event('submit', { bubbles: true });
    const formElement = document.getElementById('department-form');
    if (formElement) {
      formElement.dispatchEvent(formEvent);
    }
  };

  const resetForm = () => {
    setSelectedDepartment(null);
    setForm({ name: '', status: 'active' });
  };

  const handleView = (department) => {
    setSelectedDepartment(department);
    setViewOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setForm({ name: department.name, status: department.status });
    setOpen(true);
  };

  const confirmDelete = (department) => {
    setDeleteTarget(department);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteDepartment(deleteTarget.id);
    if (result.success) {
      await fetchDepartments();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert(result.error?.message || 'Failed to delete department');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Departments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage departments (Master Data)</p>
        </div>
        <div className="flex gap-2">
          <Button icon="plus" onClick={() => { resetForm(); setOpen(true); }}>
            Add Department
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="building" tone="primary" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Departments</div>
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

      {/* Departments Table */}
      <Card>
        <CardHeader title="All Departments" subtitle={`${filteredDepartments.length} departments found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search departments..."
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
                <TH>Department Name</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {loading && departments.length === 0 ? (
                <TR>
                  <TD colSpan={3} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filteredDepartments.length === 0 ? (
                <TR>
                  <TD colSpan={3} className="text-center py-8 text-slate-500">
                    No departments found
                  </TD>
                </TR>
              ) : (
                filteredDepartments.map((d) => (
                  <TR key={d.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs">
                          {d.name?.charAt(0) || 'D'}
                        </div>
                        <span className="font-semibold text-slate-900">{d.name}</span>
                      </div>
                    </TD>
                    <TD>
                      <Badge tone={statusTone(d.status)} dot>
                        {d.status}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" icon="eye" onClick={() => handleView(d)} />
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(d)} />
                        <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => confirmDelete(d)} />
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* View Department Modal */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Department Details"
        subtitle="View complete department information"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selectedDepartment && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-lg font-bold text-cyan-700">{selectedDepartment.name?.charAt(0) || 'D'}</span>
              </div>
            </div>
            <p className="text-base font-bold text-slate-900">{selectedDepartment.name}</p>
            <p className="text-xs font-bold text-slate-500 -mt-2">Department Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</span>
                <Badge tone={statusTone(selectedDepartment.status)} dot>{selectedDepartment.status}</Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Department Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selectedDepartment ? 'Edit Department' : 'Add Department'}
        subtitle={selectedDepartment ? 'Update department information' : 'Create a new department'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button icon="check" onClick={handleSave} loading={loading}>
              {selectedDepartment ? 'Save Changes' : 'Create Department'}
            </Button>
          </>
        }
      >
        <form id="department-form" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Department Name"
              placeholder="e.g. Engineering"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
            />
            {selectedDepartment && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
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
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => { if (!loading) { setDeleteOpen(false); setDeleteTarget(null); } }}
        title="Delete Department"
        subtitle="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }} disabled={loading}>
              Cancel
            </Button>
            <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete} loading={loading}>
              Delete Department
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
              This will permanently remove this department<br />and all associated data from the system.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DepartmentsPage;