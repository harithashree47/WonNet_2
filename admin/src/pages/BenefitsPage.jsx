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
  getBenefits, 
  createBenefit, 
  updateBenefit, 
  deleteBenefit 
} from '../api/benefit';
import { isAuthenticated, getCurrentUser } from '../api/auth';
// Import Lucide Icons
import { 
  Heart, 
  Shield, 
  Eye, 
  DollarSign, 
  Home, 
  Clock, 
  TrendingUp, 
  Umbrella, 
  Dumbbell, 
  BookOpen, 
  Utensils, 
  Car,
  Gift,
  Briefcase,
  Coffee,
  Plane,
  Wifi,
  Phone,
  Smile,
  Zap
} from 'lucide-react';

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

// Benefit icons mapping with Lucide icons
const benefitIcons = [
  { value: 'heart', label: 'Health Insurance', icon: Heart, color: 'text-rose-500' },
  { value: 'shield', label: 'Dental Insurance', icon: Shield, color: 'text-blue-500' },
  { value: 'eye', label: 'Vision Insurance', icon: Eye, color: 'text-indigo-500' },
  { value: 'dollar-sign', label: '401(k) Match', icon: DollarSign, color: 'text-emerald-500' },
  { value: 'home', label: 'Remote Work', icon: Home, color: 'text-teal-500' },
  { value: 'clock', label: 'Flexible Hours', icon: Clock, color: 'text-amber-500' },
  { value: 'trending-up', label: 'Stock Options', icon: TrendingUp, color: 'text-green-500' },
  { value: 'umbrella', label: 'Paid Time Off', icon: Umbrella, color: 'text-sky-500' },
  { value: 'dumbbell', label: 'Gym Membership', icon: Dumbbell, color: 'text-purple-500' },
  { value: 'book-open', label: 'Learning Budget', icon: BookOpen, color: 'text-orange-500' },
  { value: 'utensils', label: 'Free Meals', icon: Utensils, color: 'text-amber-600' },
  { value: 'car', label: 'Transportation', icon: Car, color: 'text-slate-500' },
  { value: 'coffee', label: 'Coffee & Snacks', icon: Coffee, color: 'text-amber-700' },
  { value: 'plane', label: 'Travel Benefits', icon: Plane, color: 'text-cyan-500' },
  { value: 'wifi', label: 'Internet Stipend', icon: Wifi, color: 'text-indigo-400' },
  { value: 'phone', label: 'Phone Reimbursement', icon: Phone, color: 'text-emerald-600' },
  { value: 'smile', label: 'Wellness Program', icon: Smile, color: 'text-lime-500' },
  { value: 'zap', label: 'Performance Bonus', icon: Zap, color: 'text-yellow-500' },
];

// Helper to get icon component by name
const getIconComponent = (iconName) => {
  const icon = benefitIcons.find(i => i.value === iconName);
  if (icon && icon.icon) {
    return icon.icon;
  }
  return Gift; // Default icon
};

// Helper to get icon color
const getIconColor = (iconName) => {
  const icon = benefitIcons.find(i => i.value === iconName);
  return icon ? icon.color : 'text-slate-400';
};

export const BenefitsPage = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // ← Status filter state
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({
    name: '',
    icon: '',
    status: 'active'
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    setLoading(true);
    const result = await getBenefits();
    if (result.success) {
      setBenefits(result.data);
      updateStats(result.data);
    }
    setLoading(false);
  };

  const updateStats = (list) => {
    setStats({
      total: list.length,
      active: list.filter(b => b.status === 'active').length,
      inactive: list.filter(b => b.status === 'inactive').length,
    });
  };

  // Apply filters (search + status)
  const filteredBenefits = benefits.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter benefit name');
      return;
    }

    setLoading(true);
    const action = selectedBenefit 
      ? updateBenefit(selectedBenefit.id, form)
      : createBenefit(form);

    const result = await action;
    if (result.success) {
      await fetchBenefits();
      setOpen(false);
      resetForm();
    } else {
      alert(result.error?.message || 'Action failed');
    }
    setLoading(false);
  };

  const handleSave = () => {
    const formEvent = new Event('submit', { bubbles: true });
    const formElement = document.getElementById('benefit-form');
    if (formElement) {
      formElement.dispatchEvent(formEvent);
    }
  };

  const resetForm = () => {
    setSelectedBenefit(null);
    setForm({
      name: '',
      icon: '',
      status: 'active'
    });
  };

  const handleEdit = (benefit) => {
    setSelectedBenefit(benefit);
    setForm({
      name: benefit.name,
      icon: benefit.icon || '',
      status: benefit.status
    });
    setOpen(true);
  };

  const handleView = (benefit) => {
    setSelectedBenefit(benefit);
    setViewOpen(true);
  };

  const confirmDelete = (benefit) => {
    setDeleteTarget(benefit);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteBenefit(deleteTarget.id);
    if (result.success) {
      await fetchBenefits();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert(result.error?.message || 'Failed to delete benefit');
    }
    setLoading(false);
  };

  // Render icon component helper
  const renderIcon = (iconName, className = "w-5 h-5") => {
    const IconComponent = getIconComponent(iconName);
    const colorClass = getIconColor(iconName);
    return <IconComponent className={`${className} ${colorClass}`} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Benefits</h1>
          <p className="text-sm text-slate-500 mt-1">Manage employee benefits and perks (Master Data)</p>
        </div>
        <Button icon="gift" onClick={() => { resetForm(); setOpen(true); }}>
          Add Benefit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="gift" tone="primary" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Benefits</div>
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

      {/* Benefits Table with Search and Status Filter */}
      <Card>
        <CardHeader title="All Benefits" subtitle={`${filteredBenefits.length} benefits found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search benefits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>
          
          {/* Status Filter Dropdown */}
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            placeholder="All Status"
            className="md:w-44"
          />
        </div>
        <div className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Icon</TH>
                <TH>Benefit Name</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {loading && benefits.length === 0 ? (
                <TR>
                  <TD colSpan={4} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filteredBenefits.length === 0 ? (
                <TR>
                  <TD colSpan={4} className="text-center py-8 text-slate-500">
                    No benefits found
                  </TD>
                </TR>
              ) : (
                filteredBenefits.map((b) => (
                  <TR key={b.id}>
                    <TD>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        {renderIcon(b.icon, "w-5 h-5")}
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900">{b.name}</span>
                      </div>
                    </TD>
                    <TD>
                      <Badge tone={statusTone(b.status)} dot>
                        {b.status}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" icon="eye" onClick={() => handleView(b)} />
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(b)} />
                        <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => confirmDelete(b)} />
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* View Benefit Modal */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Benefit Details"
        subtitle="View complete benefit information"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selectedBenefit && (
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center shadow-premium overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center">
                    {renderIcon(selectedBenefit.icon, "w-8 h-8")}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-base font-bold text-slate-900">{selectedBenefit.name}</p>
            <p className="text-xs font-bold text-slate-500 -mt-2">Benefit Information</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Icon</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  {renderIcon(selectedBenefit.icon, "w-4 h-4")}
                </div>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</span>
                <Badge tone={statusTone(selectedBenefit.status)} dot>{selectedBenefit.status}</Badge>
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Benefit ID</span>
                <span className="text-sm text-slate-700 font-mono">#{selectedBenefit.id}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Benefit Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selectedBenefit ? 'Edit Benefit' : 'Add Benefit'}
        subtitle={selectedBenefit ? 'Update benefit information' : 'Add a new benefit'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button icon="check" onClick={handleSave} loading={loading}>
              {selectedBenefit ? 'Save Changes' : 'Create Benefit'}
            </Button>
          </>
        }
      >
        <form id="benefit-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-base font-semibold mb-4 text-slate-900">Benefit Information</h3>
            <div className="space-y-4">
              <Input 
                label="Benefit Name"
                placeholder="e.g. Health Insurance, Remote Work, Stock Options" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} 
                required 
              />
              
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block">Icon</label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {benefitIcons.map((icon) => {
                    const IconComponent = icon.icon;
                    const isSelected = form.icon === icon.value;
                    return (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => setForm({...form, icon: icon.value})}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                          isSelected 
                            ? 'bg-indigo-100 border-2 border-indigo-500 shadow-sm' 
                            : 'bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 ${icon.color}`} />
                        <span className="text-[10px] text-slate-600 text-center">{icon.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-2">Click on an icon to select it for this benefit</p>
              </div>
              
              {selectedBenefit && (
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
        title="Delete Benefit"
        subtitle="This action cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }} disabled={loading}>
              Cancel
            </Button>
            <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete} loading={loading}>
              Delete Benefit
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
              This will permanently remove this benefit<br />and all associated data from the system.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BenefitsPage;