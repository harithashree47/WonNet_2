import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { 
  getJobTypes, 
  createJobType, 
  updateJobType, 
  deleteJobType 
} from '../api/jobtype';
import { getCurrentUser, isAuthenticated } from '../api/auth';

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

export const EmploymentTypesPage = () => {
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [formData, setFormData] = useState({ name: '', status: 'active' });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchJobTypes();
  }, []);

  const fetchJobTypes = async () => {
    setLoading(true);
    const result = await getJobTypes();
    if (result.success) {
      setTypes(result.data);
      updateStats(result.data);
    }
    setLoading(false);
  };

  const updateStats = (data) => {
    const total = data.length;
    const active = data.filter(t => t.status === 'active').length;
    const inactive = data.filter(t => t.status === 'inactive').length;
    setStats({ total, active, inactive });
  };

  const filtered = types.filter((t) => {
    const s = search.toLowerCase();
    return !s || t.name.toLowerCase().includes(s);
  });

  const openAddModal = () => {
    setFormData({ name: '', status: 'active' });
    setSelectedItem(null);
    setModalMode('add');
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const openEditModal = (item) => {
    setFormData({ name: item.name, status: item.status });
    setSelectedItem(item);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleSave = async () => {
    setLoading(true);
    if (modalMode === 'add') {
      const result = await createJobType({ name: formData.name, status: formData.status });
      if (result.success) { await fetchJobTypes(); closeModal(); }
      else { alert(result.error?.message || 'Failed to create job type'); }
    } else if (modalMode === 'edit' && selectedItem) {
      const result = await updateJobType(selectedItem.id, { name: formData.name, status: formData.status });
      if (result.success) { await fetchJobTypes(); closeModal(); }
      else { alert(result.error?.message || 'Failed to update job type'); }
    }
    setLoading(false);
  };

  const confirmDelete = (item) => {
    setDeleteTarget(item);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteJobType(deleteTarget.id);
    if (result.success) {
      await fetchJobTypes();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert(result.error?.message || 'Failed to delete job type');
    }
    setLoading(false);
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
          <Button icon="plus" onClick={openAddModal}>Add Type</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="clipboard" tone="primary" size="md" />
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Types</div>
            <div className="text-xl font-extrabold text-slate-900">{stats.total}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="check-circle" tone="success" size="md" />
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active</div>
            <div className="text-xl font-extrabold text-slate-900">{stats.active}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="x-circle" tone="danger" size="md" />
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Inactive</div>
            <div className="text-xl font-extrabold text-slate-900">{stats.inactive}</div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="All Employment Types" subtitle={`${filtered.length} types found`} />
        <div className="px-6 pb-4">
          <Input
            placeholder="Search types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
            className="max-w-sm"
          />
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Type Name</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {loading && types.length === 0 ? (
              <TR><TD colSpan={3} className="text-center py-8 text-slate-500">Loading...</TD></TR>
            ) : filtered.length === 0 ? (
              <TR><TD colSpan={3} className="text-center py-8 text-slate-500">No employment types found</TD></TR>
            ) : (
              filtered.map((t) => (
                <TR key={t.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                        {(t.name?.[0] || 'T')}
                      </div>
                      <span className="font-semibold text-slate-900">{t.name}</span>
                    </div>
                  </TD>
                  <TD><Badge tone={statusTone(t.status)} dot>{t.status}</Badge></TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="xs" icon="eye" onClick={() => openViewModal(t)} />
                      <Button variant="ghost" size="xs" icon="pencil" onClick={() => openEditModal(t)} />
                      <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => confirmDelete(t)} />
                    </div>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </Card>

      {/* View Modal */}
      <Modal
        open={modalMode === 'view'}
        onClose={closeModal}
        title={modalTitle}
        subtitle={modalSubtitle}
        size="sm"
        footer={<Button variant="secondary" onClick={closeModal}>Close</Button>}
      >
        {selectedItem && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-700">{selectedItem.name?.[0] || 'T'}</span>
              </div>
            </div>
            <p className="text-base font-bold text-slate-900">{selectedItem.name}</p>
            <p className="text-xs font-bold text-slate-500 -mt-2">Employment Type Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</span>
                <Badge tone={statusTone(selectedItem.status)} dot>{selectedItem.status}</Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        open={modalMode === 'add' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalTitle}
        subtitle={modalSubtitle}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button icon="check" onClick={handleSave} loading={loading}>
              {modalMode === 'add' ? 'Create Type' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Type Name"
            placeholder="e.g. Full-time"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
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
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => { if (!loading) { setDeleteOpen(false); setDeleteTarget(null); } }}
        title="Delete Employment Type"
        subtitle="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }} disabled={loading}>Cancel</Button>
            <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete} loading={loading}>Delete Type</Button>
          </>
        }
      >
        {deleteTarget && (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">Delete "{deleteTarget.name}"?</p>
            <p className="text-xs text-slate-500">This will permanently remove this employment type<br />and all associated data from the system.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmploymentTypesPage;