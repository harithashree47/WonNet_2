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

  // ADD THIS FUNCTION - handleSubmit for form submission
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

  // ADD THIS FUNCTION - handleSave for modal button
  const handleSave = () => {
    // Trigger the form submission
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

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setForm({ name: department.name, status: department.status });
    setOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete department "${name}"?`)) {
      setLoading(true);
      const result = await deleteDepartment(id);
      if (result.success) {
        await fetchDepartments();
      } else {
        alert(result.error?.message || 'Failed to delete department');
      }
      setLoading(false);
    }
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
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(d)} />
                        <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => handleDelete(d.id, d.name)} />
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Card>

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
    </div>
  );
};

export default DepartmentsPage;