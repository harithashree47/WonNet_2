import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { getJobs, createJob, updateJob, deleteJob, updateJobStatus } from '../api/job';
import { getCompanies } from '../api/company';
import { getActiveCategories } from '../api/category';
import { getActiveJobTypes } from '../api/jobtype';
import { getActiveWorkModes } from '../api/workmode';
import { getActiveExperienceLevels } from '../api/experienceLevel';
import { getActiveEducationLevels } from '../api/educationLevel';
import { getActiveLocations } from '../api/location';
import { getActiveDepartments } from '../api/department';
import { getActiveSkills } from '../api/skill';
import { getActiveBenefits } from '../api/benefit';
import { isAuthenticated, getCurrentUser } from '../api/auth';

const statusTone = (s) => {
  const tones = { published: 'success', draft: 'warning', closed: 'default' };
  return tones[s] || 'default';
};

const getLogoUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  if (path.startsWith('http://') || path.startsWith('https://') || 
      path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
  const cleanPath = path.replace(/^\/+/, '');
  return `${baseUrl}/${cleanPath}`;
};

const STEPS = [
  { id: 'basics', label: 'Basic Info', desc: 'Role, company & location', icon: 'file-text' },
  { id: 'details', label: 'Job Details', desc: 'Description & requirements', icon: 'briefcase' },
  { id: 'pay', label: 'Pay & Perks', desc: 'Compensation & benefits', icon: 'dollar-sign' },
  { id: 'review', label: 'Review', desc: 'Final checklist', icon: 'check' },
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: '$ USD' },
  { value: 'INR', label: '₹ INR' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
];

export const JobsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [view, setView] = useState('grid');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, closed: 0 });
  
  // Master data states
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [benefits, setBenefits] = useState([]);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    companyId: '',
    categoryId: '',
    jobTypeId: '',
    workModeId: '',
    experienceLevelId: '',
    educationLevelId: '',
    locationId: '',
    departmentId: '',
    vacancies: '1',
    salaryMin: '',
    salaryMax: '',
    currency: 'INR',
    applyDeadline: '',
    status: 'draft',
    skillIds: [],
    benefitIds: []
  });
  
  const [errs, setErrs] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
    fetchJobs();
    fetchMasterData();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const result = await getJobs();
    if (result.success) {
      setJobs(result.data);
      updateStats(result.data);
    }
    setLoading(false);
  };

  const updateStats = (data) => {
    setStats({
      total: data.length,
      published: data.filter(j => j.status === 'published').length,
      draft: data.filter(j => j.status === 'draft').length,
      closed: data.filter(j => j.status === 'closed').length,
    });
  };

  const fetchMasterData = async () => {
    const [companiesRes, categoriesRes, jobTypesRes, workModesRes, expLevelsRes, eduLevelsRes, locationsRes, deptsRes, skillsRes, benefitsRes] = await Promise.all([
      getCompanies(), getActiveCategories(), getActiveJobTypes(), getActiveWorkModes(),
      getActiveExperienceLevels(), getActiveEducationLevels(), getActiveLocations(),
      getActiveDepartments(), getActiveSkills(), getActiveBenefits()
    ]);
    
    if (companiesRes.success) setCompanies(companiesRes.data);
    if (categoriesRes.success) setCategories(categoriesRes.data);
    if (jobTypesRes.success) setJobTypes(jobTypesRes.data);
    if (workModesRes.success) setWorkModes(workModesRes.data);
    if (expLevelsRes.success) setExperienceLevels(expLevelsRes.data);
    if (eduLevelsRes.success) setEducationLevels(eduLevelsRes.data);
    if (locationsRes.success) setLocations(locationsRes.data);
    if (deptsRes.success) setDepartments(deptsRes.data);
    if (skillsRes.success) setSkills(skillsRes.data);
    if (benefitsRes.success) setBenefits(benefitsRes.data);
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                          (j.company?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || j.status === statusFilter;
    const matchesType = !typeFilter || j.jobType?.name === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const valid = (stepNum) => {
    const e = {};
    if (stepNum === 0) {
      if (!form.title.trim()) e.title = 'Required';
      if (!form.companyId) e.companyId = 'Required';
      if (!form.locationId) e.locationId = 'Required';
    }
    if (stepNum === 1) {
      if (!form.description || form.description.trim().length < 30) e.description = 'Need at least 30 characters';
      if (form.skillIds.length === 0) e.skillIds = 'Add at least one skill';
    }
    if (stepNum === 2) {
      if (form.salaryMin && form.salaryMax && Number(form.salaryMax) < Number(form.salaryMin)) {
        e.salary = 'Max must be ≥ min';
      }
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (valid(step)) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const resetForm = () => {
    setForm({
      title: '', description: '', responsibilities: '', qualifications: '',
      companyId: '', categoryId: '', jobTypeId: '', workModeId: '',
      experienceLevelId: '', educationLevelId: '', locationId: '', departmentId: '',
      vacancies: '1', salaryMin: '', salaryMax: '', currency: 'INR',
      applyDeadline: '', status: 'draft', skillIds: [], benefitIds: []
    });
    setErrs({});
    setStep(0);
  };

  const handleSubmit = async () => {
    if (step !== STEPS.length - 1) { next(); return; }
    if (!valid(step)) return;
    
    setLoading(true);
    const submitData = {
      ...form,
      vacancies: parseInt(form.vacancies),
      salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
      companyId: parseInt(form.companyId),
      categoryId: parseInt(form.categoryId),
      jobTypeId: parseInt(form.jobTypeId),
      workModeId: parseInt(form.workModeId),
      experienceLevelId: parseInt(form.experienceLevelId),
      educationLevelId: form.educationLevelId ? parseInt(form.educationLevelId) : undefined,
      locationId: parseInt(form.locationId),
      departmentId: form.departmentId ? parseInt(form.departmentId) : undefined,
      skillIds: form.skillIds.map(id => parseInt(id)),
      benefitIds: form.benefitIds.map(id => parseInt(id)),
    };
    
    const result = await createJob(submitData);
    if (result.success) {
      await fetchJobs();
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        resetForm();
      }, 1500);
    } else {
      alert(result.error?.message || 'Failed to create job');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!valid(step)) return;
    
    setLoading(true);
    const submitData = {
      ...form,
      vacancies: parseInt(form.vacancies),
      salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
      companyId: parseInt(form.companyId),
      categoryId: parseInt(form.categoryId),
      jobTypeId: parseInt(form.jobTypeId),
      workModeId: parseInt(form.workModeId),
      experienceLevelId: parseInt(form.experienceLevelId),
      educationLevelId: form.educationLevelId ? parseInt(form.educationLevelId) : undefined,
      locationId: parseInt(form.locationId),
      departmentId: form.departmentId ? parseInt(form.departmentId) : undefined,
      skillIds: form.skillIds.map(id => parseInt(id)),
      benefitIds: form.benefitIds.map(id => parseInt(id)),
    };
    
    const result = await updateJob(selectedJob.id, submitData);
    if (result.success) {
      await fetchJobs();
      setEditOpen(false);
      resetForm();
      alert('Job updated successfully!');
    } else {
      alert(result.error?.message || 'Failed to update job');
    }
    setLoading(false);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setForm({
      title: job.title || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      qualifications: job.qualifications || '',
      companyId: job.companyId?.toString() || '',
      categoryId: job.categoryId?.toString() || '',
      jobTypeId: job.jobTypeId?.toString() || '',
      workModeId: job.workModeId?.toString() || '',
      experienceLevelId: job.experienceLevelId?.toString() || '',
      educationLevelId: job.educationLevelId?.toString() || '',
      locationId: job.locationId?.toString() || '',
      departmentId: job.departmentId?.toString() || '',
      vacancies: job.vacancies?.toString() || '1',
      salaryMin: job.salaryMin?.toString() || '',
      salaryMax: job.salaryMax?.toString() || '',
      currency: job.currency || 'INR',
      applyDeadline: job.applyDeadline ? job.applyDeadline.split('T')[0] : '',
      status: job.status || 'draft',
      skillIds: job.skills?.map(s => s.skill?.id || s.skillId) || [],
      benefitIds: job.benefits?.map(b => b.benefit?.id || b.benefitId) || []
    });
    setStep(0);
    setEditOpen(true);
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setViewOpen(true);
  };

  const confirmDelete = (job) => {
    setDeleteTarget(job);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteJob(deleteTarget.id);
    if (result.success) {
      await fetchJobs();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } else {
      alert(result.error?.message || 'Failed to delete job');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await updateJobStatus(id, newStatus);
    if (result.success) await fetchJobs();
    else alert(result.error?.message || 'Failed to update status');
  };

  const upd = (key) => (e) => setForm(p => ({ ...p, [key]: e?.target ? e.target.value : e }));

  const toggleSkill = (skillId) => {
    setForm(p => ({
      ...p,
      skillIds: p.skillIds.includes(skillId)
        ? p.skillIds.filter(id => id !== skillId)
        : [...p.skillIds, skillId]
    }));
  };

  const toggleBenefit = (benefitId) => {
    setForm(p => ({
      ...p,
      benefitIds: p.benefitIds.includes(benefitId)
        ? p.benefitIds.filter(id => id !== benefitId)
        : [...p.benefitIds, benefitId]
    }));
  };

  const toLakhs = (val) => {
    if (!val) return null;
    return val <= 1000 ? Number(val).toFixed(1) : (val / 100000).toFixed(1);
  };
  const formatSalary = (job) => {
    const currency = job.currency || 'INR';
    const min = toLakhs(job.salaryMin);
    const max = toLakhs(job.salaryMax);
    if (min && max) return `${currency} ${min} - ${max} LPA`;
    if (min) return `${currency} ${min}+ LPA`;
    if (max) return `Up to ${currency} ${max} LPA`;
    return 'Not specified';
  };

  const jobStats = [
    { label: 'Total Jobs', value: stats.total, icon: 'briefcase', tone: 'primary' },
    { label: 'Published', value: stats.published, icon: 'check-circle', tone: 'success' },
    { label: 'Draft', value: stats.draft, icon: 'clock', tone: 'warning' },
    { label: 'Closed', value: stats.closed, icon: 'x-circle', tone: 'danger' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Jobs</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all job postings on the platform</p>
        </div>
        <Button icon="plus" onClick={() => { resetForm(); setOpen(true); }}>Post New Job</Button>
      </div>

      {/* Stats - Updated to ApplicationsPage style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {jobStats.map((s) => (
          <Card key={s.label} className="p-4 flex flex-col items-center justify-center">
            <ToneIcon icon={s.icon} tone={s.tone} size="md" />
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">{s.label}</div>
            <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Job Listings */}
      <Card>
        <CardHeader title="All Job Postings" subtitle={`${filteredJobs.length} jobs found`} action={
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setView('grid')} className={['px-3 py-1.5 rounded-md text-xs font-medium transition', view === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'].join(' ')}>
              <Icon name="grip" size={14} />
            </button>
            <button onClick={() => setView('list')} className={['px-3 py-1.5 rounded-md text-xs font-medium transition', view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'].join(' ')}>
              <Icon name="bar-chart" size={14} />
            </button>
          </div>
        } />
        
        {/* Search and Filters - Responsive */}
        <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
            <Input 
              placeholder="Search jobs..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              icon="search" 
              className="w-full" 
            />
          </div>
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            options={[{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }, { value: 'closed', label: 'Closed' }]} 
            placeholder="All Status" 
            className="w-full sm:w-44" 
          />
          <Select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)} 
            options={jobTypes.map(jt => ({ value: jt.name, label: jt.name }))} 
            placeholder="All Types" 
            className="w-full sm:w-44" 
          />
        </div>

        {view === 'list' ? (
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Job</TH>
                  <TH className="hidden sm:table-cell">Company</TH>
                  <TH className="hidden md:table-cell">Type</TH>
                  <TH className="hidden lg:table-cell">Applicants</TH>
                  <TH>Status</TH>
                  <TH align="right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {filteredJobs.map((j) => (
                  <TR key={j.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <img 
                          src={getLogoUrl(j.company?.logo) || 'https://placehold.co/32x32/f1f5f9/94a3b8?text=Logo'} 
                          alt={j.company?.name}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://placehold.co/32x32/f1f5f9/94a3b8?text=Logo'; }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{j.title}</div>
                          <div className="text-xs text-slate-500 truncate">{j.location?.city}, {j.location?.state} · {j.workMode?.name}</div>
                        </div>
                      </div>
                    </TD>
                    <TD className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{j.company?.name}</span>
                      </div>
                    </TD>
                    <TD className="hidden md:table-cell">
                      <Badge tone="info">{j.jobType?.name}</Badge>
                    </TD>
                    <TD className="hidden lg:table-cell">
                      <Badge tone="primary" icon="users">{j._count?.applications || 0}</Badge>
                    </TD>
                    <TD>
                      <select
                        value={j.status}
                        onChange={(e) => handleStatusChange(j.id, e.target.value)}
                        className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white w-full sm:w-auto"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="closed">Closed</option>
                      </select>
                    </TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(j)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
                          title="View Details"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(j)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 text-white hover:bg-black transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(j)}
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
                ))}
              </TBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 sm:p-6 pt-2">
            {filteredJobs.map((j) => (
              <div key={j.id} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <img 
                      src={getLogoUrl(j.company?.logo) || 'https://placehold.co/40x40/f1f5f9/94a3b8?text=Logo'} 
                      alt={j.company?.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://placehold.co/40x40/f1f5f9/94a3b8?text=Logo'; }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{j.company?.name}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone(j.status)} dot className="flex-shrink-0">{j.status}</Badge>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mt-2 truncate">{j.title}</h3>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 truncate">
                  <Icon name="map-pin" size={12} className="flex-shrink-0" /> 
                  <span className="truncate">{j.location?.city}, {j.location?.state}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 truncate">
                  <Icon name="wallet" size={12} className="flex-shrink-0" /> 
                  <span className="truncate">{formatSalary(j)}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <Badge tone="info" icon="users">{j._count?.applications || 0} applicants</Badge>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleView(j)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
                      title="View Details"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(j)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white hover:bg-black transition-all duration-200"
                      title="Edit"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => confirmDelete(j)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all duration-200"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* View Job Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Job Details" subtitle="View complete job information" size="lg" footer={<Button variant="secondary" onClick={() => setViewOpen(false)}>Close</Button>}>
        {selectedJob && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b flex-wrap">
              <img 
                src={getLogoUrl(selectedJob.company?.logo) || 'https://placehold.co/64x64/f1f5f9/94a3b8?text=Logo'} 
                alt={selectedJob.company?.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900 truncate">{selectedJob.title}</h2>
                <p className="text-slate-500 truncate">{selectedJob.company?.name}</p>
                <Badge tone={statusTone(selectedJob.status)} dot>{selectedJob.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Location</p><p className="font-medium">{selectedJob.location?.city}, {selectedJob.location?.state}</p></div>
              <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Job Type</p><p className="font-medium">{selectedJob.jobType?.name}</p></div>
              <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Work Mode</p><p className="font-medium">{selectedJob.workMode?.name}</p></div>
              <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Experience</p><p className="font-medium">{selectedJob.experienceLevel?.label}</p></div>
              <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Salary</p><p className="font-medium">{formatSalary(selectedJob)}</p></div>
              <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Vacancies</p><p className="font-medium">{selectedJob.vacancies}</p></div>
            </div>
            <div><p className="text-xs text-slate-500 mb-1">Description</p><p className="text-sm">{selectedJob.description}</p></div>
            {selectedJob.skills?.length > 0 && (<div><p className="text-xs text-slate-500 mb-1">Skills</p><div className="flex flex-wrap gap-1">{selectedJob.skills.map(s => (<span key={s.id} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">{s.skill?.name}</span>))}</div></div>)}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Job" subtitle="This action cannot be undone" size="sm" footer={
        <>
          <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button icon="trash-2" className="!bg-rose-600 hover:!bg-rose-700" onClick={handleDelete} loading={loading}>Delete Job</Button>
        </>
      }>
        {deleteTarget && (<div className="text-center py-4"><div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div><p className="text-sm font-semibold text-slate-900 mb-1">Delete "{deleteTarget.title}"?</p><p className="text-xs text-slate-500">This will permanently remove this job and all associated data.</p></div>)}
      </Modal>

      {/* Add/Edit Job Modal */}
      <Modal open={open || editOpen} onClose={() => { setOpen(false); setEditOpen(false); resetForm(); }} size="lg" title={open ? "Post a New Job" : "Edit Job"} subtitle={open ? "Fill in the details to publish a new listing" : "Update job information"} footer={
        <>
          <Button variant="ghost" onClick={() => { setOpen(false); setEditOpen(false); resetForm(); }}>Cancel</Button>
          <div className="flex-1" />
          <div className="flex gap-2">
            {step > 0 && <Button variant="secondary" onClick={back} disabled={loading}>Back</Button>}
            {step < STEPS.length - 1 ? <Button onClick={next}>Continue</Button> : <Button onClick={open ? handleSubmit : handleUpdate} loading={loading}>{loading ? (open ? 'Publishing...' : 'Updating...') : (open ? 'Publish Job' : 'Update Job')}</Button>}
          </div>
        </>
      }>
        {done ? (
          <div className="py-12 text-center"><div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-4"><Icon name="check" size={28} className="text-emerald-600" /></div><h3 className="text-lg font-bold text-slate-900 mb-1">Job Posted!</h3><p className="text-sm text-slate-500">Your job listing is now live</p></div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">{STEPS.map((_, i) => (<div key={i} className={['flex-1 h-1 rounded-full transition-all', i <= step ? 'bg-indigo-500' : 'bg-slate-200'].join(' ')} />))}</div>
            <div className="mb-5"><span className="text-xs font-semibold text-indigo-600">Step {step + 1} of {STEPS.length}</span><h2 className="text-lg font-bold text-slate-800 mt-0.5">{STEPS[step].label}</h2><p className="text-xs text-slate-400 mt-0.5">{STEPS[step].desc}</p></div>
            
            <div className="min-h-[320px]">
              {step === 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-500">Job Title *</label><input value={form.title} onChange={upd('title')} placeholder="e.g. Senior Frontend Engineer" className={`w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none ${errs.title ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-400'}`} /></div>
                    <div><label className="block text-xs font-semibold text-slate-500">Company *</label><select value={form.companyId} onChange={upd('companyId')} className={`w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none ${errs.companyId ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-400'}`}><option value="">Select Company</option>{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-500">Location *</label><select value={form.locationId} onChange={upd('locationId')} className={`w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none ${errs.locationId ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-400'}`}><option value="">Select Location</option>{locations.map(l => <option key={l.id} value={l.id}>{l.city}, {l.state}</option>)}</select></div>
                    <div><label className="block text-xs font-semibold text-slate-500">Department</label><select value={form.departmentId} onChange={upd('departmentId')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"><option value="">Select Department</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-500">Category</label><select value={form.categoryId} onChange={upd('categoryId')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"><option value="">Select Category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-500">Employment Type</label><select value={form.jobTypeId} onChange={upd('jobTypeId')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"><option value="">Select Type</option>{jobTypes.map(jt => <option key={jt.id} value={jt.id}>{jt.name}</option>)}</select></div>
                    <div><label className="block text-xs font-semibold text-slate-500">Work Mode</label><select value={form.workModeId} onChange={upd('workModeId')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"><option value="">Select Work Mode</option>{workModes.map(wm => <option key={wm.id} value={wm.id}>{wm.name}</option>)}</select></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-500">Experience Level</label><select value={form.experienceLevelId} onChange={upd('experienceLevelId')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"><option value="">Select Experience</option>{experienceLevels.map(el => <option key={el.id} value={el.id}>{el.label}</option>)}</select></div>
                    <div><label className="block text-xs font-semibold text-slate-500">Education Level</label><select value={form.educationLevelId} onChange={upd('educationLevelId')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"><option value="">Select Education</option>{educationLevels.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}</select></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-500">Vacancies</label><input type="number" min="1" value={form.vacancies} onChange={upd('vacancies')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400" /></div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <div><label className="block text-xs font-semibold text-slate-500">Job Description *</label><textarea value={form.description} onChange={upd('description')} rows={4} placeholder="Describe the role..." className={`w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none resize-none ${errs.description ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-400'}`} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-500">Responsibilities</label><textarea value={form.responsibilities} onChange={upd('responsibilities')} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400 resize-none" /></div><div><label className="block text-xs font-semibold text-slate-500">Qualifications</label><textarea value={form.qualifications} onChange={upd('qualifications')} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400 resize-none" /></div></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-2">Required Skills</label><div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-slate-50 max-h-32 overflow-y-auto">{skills.map(skill => (<button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)} className={['px-3 py-1.5 rounded-lg text-xs font-medium transition-all', form.skillIds.includes(skill.id) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'].join(' ')}>{skill.name}</button>))}</div>{errs.skillIds && <p className="text-xs text-rose-500 mt-1">{errs.skillIds}</p>}</div>
                  <div><label className="block text-xs font-semibold text-slate-500">Application Deadline</label><input type="date" value={form.applyDeadline} onChange={upd('applyDeadline')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400" /></div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-2">Salary Range</label><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"><select value={form.currency} onChange={upd('currency')} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm w-full sm:w-auto"><option value="">Currency</option>{CURRENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select><input type="number" value={form.salaryMin} onChange={upd('salaryMin')} placeholder="Min" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm" /><span className="text-slate-300 hidden sm:block">—</span><input type="number" value={form.salaryMax} onChange={upd('salaryMax')} placeholder="Max" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm" /></div>{errs.salary && <p className="text-xs text-rose-500 mt-1">{errs.salary}</p>}</div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-2">Benefits & Perks</label><div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-slate-50 max-h-32 overflow-y-auto">{benefits.map(benefit => (<button key={benefit.id} type="button" onClick={() => toggleBenefit(benefit.id)} className={['px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1', form.benefitIds.includes(benefit.id) ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'].join(' ')}>{benefit.icon && <span>{benefit.icon}</span>}{benefit.name}</button>))}</div></div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-4"><h3 className="font-semibold mb-2">Job Preview</h3><p className="font-bold">{form.title || 'Job Title'}</p><p className="text-sm text-slate-500">{companies.find(c => c.id == form.companyId)?.name || 'Company'}</p><div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2"><span>{locations.find(l => l.id == form.locationId)?.city}, {locations.find(l => l.id == form.locationId)?.state}</span><span>{jobTypes.find(jt => jt.id == form.jobTypeId)?.name}</span><span>{workModes.find(wm => wm.id == form.workModeId)?.name}</span></div><p className="text-sm mt-3">{form.description?.substring(0, 150)}...</p><div className="flex flex-wrap gap-1 mt-3">{form.skillIds.slice(0, 3).map(sid => <span key={sid} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">{skills.find(s => s.id == sid)?.name}</span>)}</div></div>
                  <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs font-semibold text-slate-600 mb-2">Publish Checklist</p><div className="space-y-1.5">{[
                    { ok: form.title && form.companyId && form.locationId, label: 'Title, company & location filled' },
                    { ok: form.description?.length >= 30, label: 'Description is complete' },
                    { ok: form.skillIds.length > 0, label: 'At least one skill added' },
                    { ok: !(form.salaryMin && form.salaryMax && Number(form.salaryMax) < Number(form.salaryMin)), label: 'Salary range is valid' },
                  ].map((item, i) => (<div key={i} className="flex items-center gap-2 text-xs"><div className={['w-4 h-4 rounded-full flex items-center justify-center', item.ok ? 'bg-emerald-500' : 'bg-slate-300'].join(' ')}>{item.ok && <Icon name="check" size={8} className="text-white" />}</div><span className={item.ok ? 'text-slate-700' : 'text-slate-400'}>{item.label}</span></div>))}</div></div>
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );  
};

export default JobsPage;