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
  getLocations, 
  createLocation, 
  updateLocation, 
  deleteLocation
} from '../api/location';
import { isAuthenticated, getCurrentUser } from '../api/auth';

const statusTone = (s) => ({ active: 'success', inactive: 'default' }[s] || 'default');

export const LocationsPage = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({ state: '', city: '', status: 'active' });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    const result = await getLocations();
    if (result.success) {
      setLocations(result.data);
      updateStats(result.data);
    }
    setLoading(false);
  };

  const updateStats = (list) => {
    setStats({
      total: list.length,
      active: list.filter(l => l.status === 'active').length,
      inactive: list.filter(l => l.status === 'inactive').length,
    });
  };

  const filteredLocations = locations.filter(l => {
    const matchesSearch = l.city.toLowerCase().includes(search.toLowerCase()) || 
                          l.state.toLowerCase().includes(search.toLowerCase());
    const matchesState = !stateFilter || l.state === stateFilter;
    const matchesStatus = !statusFilter || l.status === statusFilter;
    return matchesSearch && matchesState && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.state || !form.city) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const action = selectedLocation 
      ? updateLocation(selectedLocation.id, { state: form.state, city: form.city, status: form.status })
      : createLocation({ state: form.state, city: form.city, status: form.status });

    const result = await action;
    if (result.success) {
      await fetchLocations();
      setOpen(false);
      resetForm();
    } else {
      alert(result.error?.message || 'Action failed');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedLocation(null);
    setForm({ state: '', city: '', status: 'active' });
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setForm({ state: location.state, city: location.city, status: location.status });
    setOpen(true);
  };

  const handleDelete = async (id, city, state) => {
    if (window.confirm(`Are you sure you want to delete "${city}, ${state}"?`)) {
      setLoading(true);
      const result = await deleteLocation(id);
      if (result.success) {
        await fetchLocations();
      } else {
        alert(result.error?.message || 'Failed to delete location');
      }
      setLoading(false);
    }
  };

  const uniqueStates = [...new Map(locations.map(l => [l.state, l.state])).values()];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Locations</h1>
          <p className="text-sm text-slate-500 mt-1">Manage job locations (State & City)</p>
        </div>
        <Button icon="map-pin" onClick={() => { resetForm(); setOpen(true); }}>
          Add Location
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="map-pin" tone="primary" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Locations</div>
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

      {/* Locations Table */}
      <Card>
        <CardHeader title="Location List" subtitle="Manage your platform's job locations" />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search by city or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>
          <Select 
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            options={uniqueStates.map(s => ({ value: s, label: s }))}
            placeholder="All States"
            className="md:w-48"
          />
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
                <TH>State</TH>
                <TH>City</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {loading && locations.length === 0 ? (
                <TR>
                  <TD colSpan={4} className="text-center py-8 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </TD>
                </TR>
              ) : filteredLocations.length === 0 ? (
                <TR>
                  <TD colSpan={4} className="text-center py-8 text-slate-500">
                    No locations found
                  </TD>
                </TR>
              ) : (
                filteredLocations.map((l) => (
                  <TR key={l.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {l.state?.charAt(0) || 'S'}
                        </div>
                        <span className="font-semibold text-slate-900">{l.state}</span>
                      </div>
                    </TD>
                    <TD className="text-sm text-slate-600">{l.city}</TD>
                    <TD>
                      <Badge tone={statusTone(l.status)} dot>
                        {l.status}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(l)} />
                        <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => handleDelete(l.id, l.city, l.state)} />
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Location Modal - Simple Text Inputs */}
      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        title={selectedLocation ? 'Edit Location' : 'Add Location'}
        subtitle={selectedLocation ? 'Update location information' : 'Add a new location (State & City)'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="location-form" loading={loading}>
              {selectedLocation ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="location-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">State *</label>
            <Input 
              placeholder="e.g. California, Texas, New York" 
              value={form.state} 
              onChange={(e) => setForm({...form, state: e.target.value})} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">City *</label>
            <Input 
              placeholder="e.g. San Francisco, Austin, New York City" 
              value={form.city} 
              onChange={(e) => setForm({...form, city: e.target.value})} 
              required 
            />
          </div>

          {selectedLocation && (
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

export default LocationsPage;