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
  getExperienceLevels, 
  createExperienceLevel, 
  updateExperienceLevel, 
  deleteExperienceLevel 
} from '../api/experienceLevel';
import { isAuthenticated, getCurrentUser } from '../api/auth';

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

export const ExperienceLevelsPage = () => {
  const [levels, setLevels] = useState([]);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'view' | 'edit' | null
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    avgRange: '0-0 yrs'
  });
  const [formData, setFormData] = useState({ 
    label: '', 
    status: 'active', 
    minYears: '', 
    maxYears: '' 
  });

  // Check authentication
  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchExperienceLevels();
  }, []);

  // Fetch experience levels from API
  const fetchExperienceLevels = async () => {
    setLoading(true);
    const result = await getExperienceLevels();
    if (result.success) {
      setLevels(result.data);
      updateStats(result.data);
    } else {
      console.error('Failed to fetch experience levels:', result.error);
    }
    setLoading(false);
  };

  // Update statistics
  const updateStats = (data) => {
    const total = data.length;
    const active = data.filter(l => l.status === 'active').length;
    
    // Calculate average range
    const avgMin = Math.floor(data.reduce((sum, l) => sum + l.minYears, 0) / (data.length || 1));
    const avgMax = Math.floor(data.reduce((sum, l) => sum + l.maxYears, 0) / (data.length || 1));
    
    setStats({
      total,
      active,
      avgRange: `${avgMin}–${avgMax} yrs`
    });
  };

  const filtered = levels.filter((l) => {
    const s = search.toLowerCase();
    return !s || l.label.toLowerCase().includes(s);
  });

  const openAddModal = () => {
    setFormData({ label: '', status: 'active', minYears: '', maxYears: '' });
    setSelectedItem(null);
    setModalMode('add');
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const openEditModal = (item) => {
    setFormData({ 
      label: item.label, 
      status: item.status, 
      minYears: String(item.minYears), 
      maxYears: String(item.maxYears) 
    });
    setSelectedItem(item);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleSave = async () => {
    const minY = parseInt(formData.minYears, 10) || 0;
    const maxY = parseInt(formData.maxYears, 10) || 0;

    // Validate minYears <= maxYears
    if (minY > maxY) {
      alert('Minimum years cannot be greater than maximum years');
      return;
    }

    setLoading(true);

    if (modalMode === 'add') {
      const result = await createExperienceLevel({
        label: formData.label,
        minYears: minY,
        maxYears: maxY,
        status: formData.status
      });
      
      if (result.success) {
        await fetchExperienceLevels();
        closeModal();
      } else {
        alert(result.error?.message || 'Failed to create experience level');
      }
    } 
    else if (modalMode === 'edit' && selectedItem) {
      const result = await updateExperienceLevel(selectedItem.id, {
        label: formData.label,
        minYears: minY,
        maxYears: maxY,
        status: formData.status
      });
      
      if (result.success) {
        await fetchExperienceLevels();
        closeModal();
      } else {
        alert(result.error?.message || 'Failed to update experience level');
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id, label) => {
    if (window.confirm(`Are you sure you want to delete "${label}"?`)) {
      setLoading(true);
      const result = await deleteExperienceLevel(id);
      if (result.success) {
        await fetchExperienceLevels();
      } else {
        alert(result.error?.message || 'Failed to delete experience level');
      }
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const modalTitle = modalMode === 'add' ? 'Add Experience Level' : modalMode === 'edit' ? 'Edit Experience Level' : 'Experience Level Details';
  const modalSubtitle = modalMode === 'add' ? 'Create a new experience level' : modalMode === 'edit' ? 'Update experience level information' : 'View full experience level information';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Experience Levels</h1>
          <p className="text-sm text-slate-500 mt-1">Manage experience level options (Master Data)</p>
        </div>
        <div className="flex gap-2">
          <Button icon="plus" onClick={openAddModal}>Add Level</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="layers" tone="primary" size="md" />
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Levels</div>
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
          <ToneIcon icon="activity" tone="warning" size="md" />
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg. Range</div>
            <div className="text-xl font-extrabold text-slate-900">{stats.avgRange}</div>
          </div>
        </Card>
      </div>

      {/* Experience Levels Table */}
      <Card>
        <CardHeader title="All Experience Levels" subtitle={`${filtered.length} levels found`} />
        <div className="px-6 pb-4">
          <Input
            placeholder="Search levels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
            className="max-w-sm"
          />
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Level Name</TH>
              <TH>Experience Range</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {loading && levels.length === 0 ? (
              <TR>
                <TD colSpan={4} className="text-center py-8 text-slate-500">
                  Loading...
                </TD>
              </TR>
            ) : filtered.length === 0 ? (
              <TR>
                <TD colSpan={4} className="text-center py-8 text-slate-500">
                  No experience levels found
                </TD>
              </TR>
            ) : (
              filtered.map((l) => (
                <TR key={l.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                        {l.label?.charAt(0) || 'L'}
                      </div>
                      <span className="font-semibold text-slate-900">{l.label}</span>
                    </div>
                  </TD>
                  <TD className="text-sm text-slate-600">
                    {l.minYears} – {l.maxYears >= 99 ? '∞' : l.maxYears} years
                  </TD>
                  <TD>
                    <Badge tone={statusTone(l.status)} dot>{l.status}</Badge>
                  </TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="xs" icon="eye" onClick={() => openViewModal(l)} />
                      <Button variant="ghost" size="xs" icon="pencil" onClick={() => openEditModal(l)} />
                      <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => handleDelete(l.id, l.label)} />
                    </div>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </Card>

      {/* Modal */}
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
              <Button icon="check" onClick={handleSave} loading={loading}>
                {modalMode === 'add' ? 'Create Level' : 'Save Changes'}
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
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                {selectedItem.label?.charAt(0) || 'L'}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selectedItem.label}</h4>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Experience Range</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedItem.minYears} – {selectedItem.maxYears >= 99 ? '∞' : selectedItem.maxYears} years
                </p>
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
              label="Level Name"
              placeholder="e.g. Senior Level"
              value={formData.label}
              onChange={(e) => handleChange('label', e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min Years"
                type="number"
                placeholder="0"
                value={formData.minYears}
                onChange={(e) => handleChange('minYears', e.target.value)}
                required
              />
              <Input
                label="Max Years"
                type="number"
                placeholder="99"
                value={formData.maxYears}
                onChange={(e) => handleChange('maxYears', e.target.value)}
                required
              />
            </div>
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

export default ExperienceLevelsPage;