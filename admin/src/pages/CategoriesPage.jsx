import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ToneIcon } from '../components/ui/ToneIcon';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/category';
import { isAuthenticated, getCurrentUser } from '../api/auth';

export const CategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({ name: '', slug: '', status: 'active' });

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const result = await getCategories();
    if (result.success) {
      setCategories(result.data);
      updateStats(result.data);
    }
  };

  const updateStats = (list) => {
    setStats({
      total: list.length,
      active: list.filter(c => c.status === 'active').length,
      inactive: list.filter(c => c.status === 'inactive').length,
    });
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const action = selectedCategory 
      ? updateCategory(selectedCategory.id, form)
      : createCategory(form);

    const result = await action;
    if (result.success) {
      await fetchCategories();
      setOpen(false);
      resetForm();
    } else {
      alert(result.error?.message || 'Action failed');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setForm({ name: '', slug: '', status: 'active' });
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setForm({ name: category.name, slug: category.slug || '', status: category.status });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to restrict this category?')) {
      const result = await deleteCategory(id);
      if (result.success) fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Manage job categories and classifications</p>
        </div>
        <Button icon="grid-plus" onClick={() => { resetForm(); setOpen(true); }}>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <ToneIcon icon="grid" tone="primary" size="md" />
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Categories</div>
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
        <CardHeader title="Category List" subtitle="Manage your platform's job categories" />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search categories..."
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
                <TH>Category Name</TH>
                <TH>Slug</TH>
                <TH>Status</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredCategories.length === 0 ? (
                <TR><TD colSpan={4} className="text-center py-8 text-slate-500">No categories found</TD></TR>
              ) : (
                filteredCategories.map((c) => (
                  <TR key={c.id}>
                    <TD className="font-semibold text-slate-900">{c.name}</TD>
                    <TD className="text-sm text-slate-500">{c.slug || '-'}</TD>
                    <TD>
                      <Badge tone={c.status === 'active' ? 'success' : 'default'} dot>
                        {c.status}
                      </Badge>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" icon="pencil" onClick={() => handleEdit(c)} />
                        <Button variant="ghost" size="xs" icon="trash-2" className="text-rose-500" onClick={() => handleDelete(c.id)} />
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
        title={selectedCategory ? 'Edit Category' : 'Create Category'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="category-form" loading={loading}>
              {selectedCategory ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Category Name *</label>
            <Input placeholder="e.g. Technology" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Slug (Optional)</label>
            <Input placeholder="e.g. technology" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} />
          </div>
          {selectedCategory && (
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