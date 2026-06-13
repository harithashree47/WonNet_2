import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ToneIcon } from '../components/ui/ToneIcon';
import { getWorkModes, createWorkMode, updateWorkMode, deleteWorkMode } from '../api/workmode';
import { isAuthenticated, getCurrentUser } from '../api/auth';

export const WorkModePage = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workModes, setWorkModes] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({ name: '', status: 'active' });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchWorkModes();
  }, []);

  const fetchWorkModes = async () => {
    const result = await getWorkModes();
    if (result.success) {
      setWorkModes(result.data);
      updateStats(result.data);
    }
  };

  const updateStats = (list) => {
    setStats({
      total: list.length,
      active: list.filter(w => w.status === 'active').length,
      inactive: list.filter(w => w.status === 'inactive').length,
    });
  };

  const filteredWorkModes = workModes.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const action = selectedWorkMode 
      ? updateWorkMode(selectedWorkMode.id, form)
      : createWorkMode(form);

    const result = await action;
    if (result.success) {
      await fetchWorkModes();
      setOpen(false);
      resetForm();
    } else {
      alert(result.error?.message || 'Action failed');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedWorkMode(null);
    setForm({ name: '', status: 'active' });
  };

  const handleEdit = (workMode) => {
    setSelectedWorkMode(workMode);
    setForm({ name: workMode.name, status: workMode.status });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to restrict this work mode?')) {
      const result = await deleteWorkMode(id);
      if (result.success) fetchWorkModes();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Modes</h1>
          <p className="text-sm text-slate-500 mt-1">Manage work arrangement options (Remote, On-site, Hybrid, etc.)</p>
        </div>
        <Button icon="plus" onClick={() => { resetForm(); setOpen(true); }}>
          Add Work Mode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="briefcase" tone="primary" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Work Modes</div>
            <div className="text-xl font-bold text-slate-900">{stats.total}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="check" tone="success" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active</div>
            <div className="text-xl font-bold text-slate-900">{stats.active}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="x" tone="danger" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inactive</div>
            <div className="text-xl font-bold text-slate-900">{stats.inactive}</div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Work Mode List" subtitle="Manage work arrangements for job postings" />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search work modes..."
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
                <TH>Work Mode Name</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredWorkModes.length === 0 ? (
                <TR><TD colSpan={3} className="text-center py-8 text-slate-500">No work modes found</TD></TR>
              ) : (
                filteredWorkModes.map((w) => (
                  <TR key={w.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {w.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900">{w.name}</span>
                      </div>
                    </TD>
                    <TD>
                      <Badge tone={w.status === 'active' ? 'success' : 'default'} dot>
                        {w.status}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(w)} />
                        <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => handleDelete(w.id)} />
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
        title={selectedWorkMode ? 'Edit Work Mode' : 'Create Work Mode'}
        subtitle={selectedWorkMode ? 'Update work mode information' : 'Add a new work arrangement option'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="workmode-form" loading={loading}>
              {selectedWorkMode ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="workmode-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Work Mode Name *</label>
            <Input 
              placeholder="e.g. Remote, On-site, Hybrid" 
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              required 
            />
          </div>
          {selectedWorkMode && (
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
        </form>
      </Modal>
    </div>
  );
};

export default WorkModePage;