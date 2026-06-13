import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';

const initialDepartments = [
  { id: 1, name: 'Engineering', slug: 'engineering', head: 'Alice Chen', employees: 124, jobs: 32, status: 'active' },
  { id: 2, name: 'Design', slug: 'design', head: 'Bob Martinez', employees: 45, jobs: 12, status: 'active' },
  { id: 3, name: 'Marketing', slug: 'marketing', head: 'Carol Smith', employees: 38, jobs: 8, status: 'active' },
  { id: 4, name: 'Sales', slug: 'sales', head: 'David Johnson', employees: 52, jobs: 15, status: 'active' },
  { id: 5, name: 'Human Resources', slug: 'hr', head: 'Eve Williams', employees: 18, jobs: 4, status: 'active' },
  { id: 6, name: 'Finance', slug: 'finance', head: 'Frank Brown', employees: 22, jobs: 6, status: 'active' },
  { id: 7, name: 'Operations', slug: 'operations', head: 'Grace Lee', employees: 35, jobs: 10, status: 'active' },
  { id: 8, name: 'Legal', slug: 'legal', head: 'Henry Davis', employees: 12, jobs: 3, status: 'inactive' },
  { id: 9, name: 'Product', slug: 'product', head: 'Ivy Wilson', employees: 28, jobs: 9, status: 'active' },
];

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

const stats = [
  { label: 'Total Departments', value: '9', icon: 'building', tone: 'primary' },
  { label: 'Active', value: '8', icon: 'check-circle', tone: 'success' },
  { label: 'Total Employees', value: '374', icon: 'users', tone: 'info' },
  { label: 'Total Jobs', value: '99', icon: 'briefcase', tone: 'warning' },
];

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'view' | 'edit' | null
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', head: '', status: 'active' });

  const filtered = departments.filter((d) => {
    const s = search.toLowerCase();
    return !s || d.name.toLowerCase().includes(s) || d.slug.toLowerCase().includes(s) || d.head.toLowerCase().includes(s);
  });

  const openAddModal = () => {
    setFormData({ name: '', slug: '', head: '', status: 'active' });
    setSelectedItem(null);
    setModalMode('add');
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const openEditModal = (item) => {
    setFormData({ name: item.name, slug: item.slug, head: item.head, status: item.status });
    setSelectedItem(item);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
        head: formData.head,
        employees: 0,
        jobs: 0,
        status: formData.status,
      };
      setDepartments([...departments, newItem]);
    } else if (modalMode === 'edit' && selectedItem) {
      setDepartments(departments.map((d) =>
        d.id === selectedItem.id
          ? { ...d, name: formData.name, slug: formData.slug.toLowerCase().replace(/\s+/g, '-'), head: formData.head, status: formData.status }
          : d
      ));
    }
    closeModal();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const modalTitle = modalMode === 'add' ? 'Add Department' : modalMode === 'edit' ? 'Edit Department' : 'Department Details';
  const modalSubtitle = modalMode === 'add' ? 'Create a new department' : modalMode === 'edit' ? 'Update department information' : 'View full department information';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Departments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage departments (Master Data)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon="download">Export</Button>
          <Button icon="plus" onClick={openAddModal}>Add Department</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
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
        <CardHeader title="All Departments" subtitle={`${filtered.length} departments found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
            className="flex-1"
          />
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Department</TH>
              <TH>Slug</TH>
              <TH>Head</TH>
              <TH>Employees</TH>
              <TH>Jobs</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((d) => (
              <TR key={d.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs">
                      {(d.name[0])}
                    </div>
                    <span className="font-semibold text-slate-900">{d.name}</span>
                  </div>
                </TD>
                <TD className="text-sm text-slate-500 font-mono">{d.slug}</TD>
                <TD className="text-sm text-slate-600">{d.head}</TD>
                <TD className="text-sm text-slate-600">{d.employees}</TD>
                <TD><Badge tone="primary" icon="briefcase">{d.jobs}</Badge></TD>
                <TD><Badge tone={statusTone(d.status)} dot>{d.status}</Badge></TD>
                <TD align="right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="xs" icon="eye" onClick={() => openViewModal(d)} />
                    <Button variant="ghost" size="xs" icon="pencil" onClick={() => openEditModal(d)} />
                    <Button variant="ghost" size="xs" icon="more-vertical" />
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>

      <Modal
        open={modalMode !== null}
        onClose={closeModal}
        title={modalTitle}
        subtitle={modalSubtitle}
        size="md"
        footer={
          modalMode !== 'view' ? (
            <>
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button icon="check" onClick={handleSave}>
                {modalMode === 'add' ? 'Create Department' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={closeModal}>Close</Button>
          )
        }
      >
        {modalMode === 'view' && selectedItem ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-lg">
                {selectedItem.name[0]}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selectedItem.name}</h4>
                <p className="text-sm text-slate-500 font-mono">{selectedItem.slug}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Department Head</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{selectedItem.head}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Employees</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{selectedItem.employees}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Jobs</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{selectedItem.jobs}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status</p>
                <p className="mt-1"><Badge tone={statusTone(selectedItem.status)} dot>{selectedItem.status}</Badge></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Department Name"
              placeholder="e.g. Engineering"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input
              label="Slug"
              placeholder="e.g. engineering"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
            />
            <Input
              label="Department Head"
              placeholder="e.g. Alice Chen"
              value={formData.head}
              onChange={(e) => handleChange('head', e.target.value)}
            />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DepartmentsPage;
