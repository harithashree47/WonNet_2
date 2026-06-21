import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
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
  const [statusFilter, setStatusFilter] = useState('');
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

  // Updated filter with status filter
  const filtered = types.filter((t) => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
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
    if (!formData.name.trim()) {
      alert('Please enter a type name');
      return;
    }

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

      {/* Stats Cards - Updated to ApplicationsPage style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="clipboard" tone="primary" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Total Types</div>
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

      {/* Employment Types Table */}
      <Card>
        <CardHeader title="All Employment Types" subtitle={`${filtered.length} types found`} />
        
        {/* Search and Filter - Now with Status Filter */}
        <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
            <Input
              placeholder="Search types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="search"
              className="w-full"
            />
          </div>
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            placeholder="All Status"
            className="w-full sm:w-44"
          />
        </div>

        <div className="overflow-x-auto">
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
                <TR>
                  <TD colSpan={3} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filtered.length === 0 ? (
                <TR>
                  <TD colSpan={3} className="text-center py-8 text-slate-500">
                    No employment types found
                  </TD>
                </TR>
              ) : (
                filtered.map((t) => (
                  <TR key={t.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                          {t.name?.[0] || 'T'}
                        </div>
                        <span className="font-semibold text-slate-900 truncate">{t.name}</span>
                      </div>
                    </TD>
                    <TD>
                      <Badge tone={statusTone(t.status)} dot>{t.status}</Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => openViewModal(t)}
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
                          onClick={() => openEditModal(t)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 text-white hover:bg-black transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => confirmDelete(t)}
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
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
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