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
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill 
} from '../api/skill';
import { isAuthenticated, getCurrentUser } from '../api/auth';

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

export const SkillsPage = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({
    name: '',
    category: '',
    status: 'active'
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const result = await getSkills();
    if (result.success) {
      setSkills(result.data);
      updateStats(result.data);
    }
    setLoading(false);
  };

  const updateStats = (list) => {
    setStats({
      total: list.length,
      active: list.filter(s => s.status === 'active').length,
      inactive: list.filter(s => s.status === 'inactive').length,
    });
  };

  const filteredSkills = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || s.status === statusFilter;
    const matchesCategory = !categoryFilter || s.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter skill name');
      return;
    }

    setLoading(true);
    const action = selectedSkill 
      ? updateSkill(selectedSkill.id, form)
      : createSkill(form);

    const result = await action;
    if (result.success) {
      await fetchSkills();
      setOpen(false);
      resetForm();
    } else {
      alert(result.error?.message || 'Action failed');
    }
    setLoading(false);
  };

  const handleSave = () => {
    const formEvent = new Event('submit', { bubbles: true });
    const formElement = document.getElementById('skill-form');
    if (formElement) {
      formElement.dispatchEvent(formEvent);
    }
  };

  const resetForm = () => {
    setSelectedSkill(null);
    setForm({
      name: '',
      category: '',
      status: 'active'
    });
  };

  const handleEdit = (skill) => {
    setSelectedSkill(skill);
    setForm({
      name: skill.name,
      category: skill.category || '',
      status: skill.status
    });
    setOpen(true);
  };

  const handleView = (skill) => {
    setSelectedSkill(skill);
    setViewOpen(true);
  };

  const confirmDelete = (skill) => {
    setDeleteTarget(skill);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteSkill(deleteTarget.id);
    if (result.success) {
      await fetchSkills();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert(result.error?.message || 'Failed to delete skill');
    }
    setLoading(false);
  };

  const categoryOptions = [...new Map(skills.map(s => [s.category, s.category])).values()].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Skills</h1>
          <p className="text-sm text-slate-500 mt-1">Manage job skills and competencies (Master Data)</p>
        </div>
        <Button icon="plus" onClick={() => { resetForm(); setOpen(true); }}>
          Add Skill
        </Button>
      </div>

      {/* Stats Cards - Updated to ApplicationsPage style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="code" tone="primary" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Total Skills</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.total}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="check-circle" tone="success" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Active</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.active}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="x-circle" tone="danger" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Inactive</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.inactive}</div>
        </Card>
      </div>

      {/* Skills Table */}
      <Card>
        <CardHeader title="All Skills" subtitle={`${filteredSkills.length} skills found`} />
        
        {/* Search and Filters - Responsive */}
        <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
            <Input
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="search"
              className="w-full"
            />
          </div>
          <Select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categoryOptions.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))}
            placeholder="All Categories"
            className="w-full sm:w-44"
          />
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
            placeholder="All Status"
            className="w-full sm:w-44"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Skill Name</TH>
                <TH className="hidden sm:table-cell">Category</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {loading && skills.length === 0 ? (
                <TR>
                  <TD colSpan={4} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filteredSkills.length === 0 ? (
                <TR>
                  <TD colSpan={4} className="text-center py-8 text-slate-500">
                    No skills found
                  </TD>
                </TR>
              ) : (
                filteredSkills.map((s) => (
                  <TR key={s.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                          {s.name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-semibold text-slate-900 truncate">{s.name}</span>
                      </div>
                    </TD>
                    <TD className="hidden sm:table-cell">
                      <Badge tone="info" className="capitalize">
                        {s.category || 'General'}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge tone={statusTone(s.status)} dot>
                        {s.status}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleView(s)}
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
                          onClick={() => handleEdit(s)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 text-white hover:bg-black transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => confirmDelete(s)}
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

      {/* View Skill Modal */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Skill Details"
        subtitle="View complete skill information"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selectedSkill && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-lg font-bold text-indigo-700">{selectedSkill.name?.charAt(0) || 'S'}</span>
              </div>
            </div>
            <p className="text-base font-bold text-slate-900">{selectedSkill.name}</p>
            <p className="text-xs font-bold text-slate-500 -mt-2">Skill Information</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Category</span>
                <span className="text-sm text-slate-700 capitalize">{selectedSkill.category || 'General'}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</span>
                <Badge tone={statusTone(selectedSkill.status)} dot>{selectedSkill.status}</Badge>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Skill ID</span>
                <span className="text-sm text-slate-700 font-mono">#{selectedSkill.id}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Skill Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selectedSkill ? 'Edit Skill' : 'Add Skill'}
        subtitle={selectedSkill ? 'Update skill information' : 'Add a new skill'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button icon="check" onClick={handleSave} loading={loading}>
              {selectedSkill ? 'Save Changes' : 'Create Skill'}
            </Button>
          </>
        }
      >
        <form id="skill-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-base font-semibold mb-4 text-slate-900">Skill Information</h3>
            <div className="space-y-4">
              <Input 
                label="Skill Name"
                placeholder="e.g. React.js, Python, Project Management" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} 
                required 
              />
              
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="cloud">Cloud</option>
                  <option value="devops">DevOps</option>
                  <option value="design">Design</option>
                  <option value="soft-skill">Soft Skill</option>
                  <option value="management">Management</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {selectedSkill && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
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
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => { if (!loading) { setDeleteOpen(false); setDeleteTarget(null); } }}
        title="Delete Skill"
        subtitle="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }} disabled={loading}>
              Cancel
            </Button>
            <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete} loading={loading}>
              Delete Skill
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
              This will permanently remove this skill<br />and all associated data from the system.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SkillsPage;