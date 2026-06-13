import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';

const initialTypes = [
  { id: 1, name: 'Full-time', slug: 'fulltime', jobs: 486, status: 'active' },
  { id: 2, name: 'Part-time', slug: 'parttime', jobs: 124, status: 'active' },
  { id: 3, name: 'Contract', slug: 'contract', jobs: 215, status: 'active' },
  { id: 4, name: 'Internship', slug: 'internship', jobs: 89, status: 'active' },
  { id: 5, name: 'Freelance', slug: 'freelance', jobs: 67, status: 'active' },
];

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

const stats = [
  { label: 'Total Types', value: '5', icon: 'clipboard', tone: 'primary' },
  { label: 'Active', value: '5', icon: 'check-circle', tone: 'success' },
  { label: 'Total Jobs', value: '981', icon: 'briefcase', tone: 'info' },
  { label: 'Most Used', value: 'Full-time', icon: 'trending-up', tone: 'warning' },
];

export const EmploymentTypesPage = () => {
  const [types, setTypes] = useState(initialTypes);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'view' | 'edit' | null
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', status: 'active' });

  const filtered = types.filter((t) => {
    const s = search.toLowerCase();
    return !s || t.name.toLowerCase().includes(s) || t.slug.toLowerCase().includes(s);
  });

  const openAddModal = () => {
    setFormData({ name: '', slug: '', status: 'active' });
    setSelectedItem(null);
    setModalMode('add');
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const openEditModal = (item) => {
    setFormData({ name: item.name, slug: item.slug, status: item.status });
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
        jobs: 0,
        status: formData.status,
      };
      setTypes([...types, newItem]);
    } else if (modalMode === 'edit' && selectedItem) {
      setTypes(types.map((t) =>
        t.id === selectedItem.id
          ? { ...t, name: formData.name, slug: formData.slug.toLowerCase().replace(/\s+/g, '-'), status: formData.status }
          : t
      ));
    }
    closeModal();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const modalTitle = modalMode === 'add' ? 'Add Employment Type' : modalMode === 'edit' ? 'Edit Employment Type' : 'Employment Type Details';
  const modalSubtitle = modalMode === 'add' ? 'Create a new employment type' : modalMode === 'edit' ? 'Update employment type information' : 'View full employment type information';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employment Types</h1>
          <p className="text-sm text-slate-500 mt-1">Manage employment type options (Master Data)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon="download">Export</Button>
          <Button icon="plus" onClick={openAddModal}>Add Type</Button>
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
        <CardHeader title="All Employment Types" subtitle={`${filtered.length} types found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
            className="flex-1"
          />
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Type Name</TH>
              <TH>Slug</TH>
              <TH>Jobs</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((t) => (
              <TR key={t.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      {(t.name[0])}
                    </div>
                    <span className="font-semibold text-slate-900">{t.name}</span>
                  </div>
                </TD>
                <TD className="text-sm text-slate-500 font-mono">{t.slug}</TD>
                <TD><Badge tone="primary" icon="briefcase">{t.jobs}</Badge></TD>
                <TD><Badge tone={statusTone(t.status)} dot>{t.status}</Badge></TD>
                <TD align="right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="xs" icon="eye" onClick={() => openViewModal(t)} />
                    <Button variant="ghost" size="xs" icon="pencil" onClick={() => openEditModal(t)} />
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
                {modalMode === 'add' ? 'Create Type' : 'Save Changes'}
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
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                {selectedItem.name[0]}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selectedItem.name}</h4>
                <p className="text-sm text-slate-500 font-mono">{selectedItem.slug}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Jobs</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{selectedItem.jobs}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status</p>
                <p className="mt-1"><Badge tone={statusTone(selectedItem.status)} dot>{selectedItem.status}</Badge></p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ID</p>
              <p className="text-sm text-slate-700 mt-1 font-mono">#{selectedItem.id}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Type Name"
              placeholder="e.g. Full-time"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input
              label="Slug"
              placeholder="e.g. fulltime"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
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

export default EmploymentTypesPage;
