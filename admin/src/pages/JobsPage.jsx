import React, { useState, useRef, useCallback } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { recentJobs } from '../data/mockData';

const statusTone = (s) => ({ active: 'success', pending: 'warning', closed: 'default' }[s] || 'default');

const jobStats = [
  { label: 'Total Jobs', value: '1,254', icon: 'briefcase', tone: 'primary' },
  { label: 'Active', value: '892', icon: 'check-circle', tone: 'success' },
  { label: 'Pending Review', value: '48', icon: 'clock', tone: 'warning' },
  { label: 'Closed', value: '314', icon: 'x-circle', tone: 'danger' },
];

const STEPS = [
  { id: 'basics', label: 'Basic Info', desc: 'Role, company & location', icon: 'file-text' },
  { id: 'details', label: 'Job Details', desc: 'Description & requirements', icon: 'briefcase' },
  { id: 'pay', label: 'Pay & Perks', desc: 'Compensation & benefits', icon: 'dollar-sign' },
  { id: 'review', label: 'Review', desc: 'Final checklist', icon: 'check' },
];

const initialJobState = {
  title: '',
  company: '',
  category: '',
  type: 'fulltime',
  location: '',
  remoteOption: 'office',
  description: '',
  responsibilities: '',
  qualifications: '',
  experience: 'mid',
  skills: [],
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  applyDeadline: '',
  vacancies: '1',
  benefits: [],
  education: 'bachelors',
  department: '',
};

const CATEGORIES = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'legal', label: 'Legal' },
  { value: 'product', label: 'Product' },
  { value: 'other', label: 'Other' },
];

const BENEFITS = ['Health Insurance', 'Dental', 'Vision', '401(k) Match', 'Remote Work', 'Flexible Hours', 'Stock Options', 'Unlimited PTO', 'Gym', 'Learning Budget', 'Free Meals', 'Parental Leave'];

const TYPE_OPTIONS = [
  { value: 'fulltime', label: 'Full-time' },
  { value: 'parttime', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

const EXP_OPTIONS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead / Manager' },
  { value: 'director', label: 'Director+' },
];

const EDU_OPTIONS = [
  { value: 'highschool', label: 'High School' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD' },
  { value: 'any', label: 'Any' },
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: '$ USD' },
  { value: 'INR', label: '₹ INR' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
];

/* ─── Tag Input ─── */
const SkillInput = ({ tags, onChange }) => {
  const [v, setV] = useState('');
  const ref = useRef(null);

  const add = useCallback(() => {
    const t = v.trim();
    if (!t || tags.includes(t)) return;
    onChange([...tags, t]);
    setV('');
  }, [v, tags, onChange]);

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Required Skills</label>
      <div
        onClick={() => ref.current?.focus()}
        className="flex flex-wrap items-center gap-1.5 p-2.5 min-h-[44px] rounded-xl border border-slate-200 focus-within:border-indigo-400 focus-within:bg-indigo-50/30 transition-all cursor-text bg-slate-50/30"
      >
        {tags.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-indigo-900 transition-colors ml-0.5">
              <Icon name="x" size={10} strokeWidth={3} />
            </button>
          </span>
        ))}
        <input
          ref={ref}
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
            if (e.key === 'Backspace' && !v && tags.length) onChange(tags.slice(0, -1));
          }}
          onBlur={add}
          placeholder={tags.length ? '' : 'Type skill & press Enter...'}
          className="flex-1 min-w-[100px] outline-none text-sm bg-transparent text-slate-700 placeholder:text-slate-400 py-0.5"
        />
      </div>
    </div>
  );
};

/* ─── Benefit Chips ─── */
const BenefitChips = ({ value, onChange }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Benefits & Perks</label>
    <div className="flex flex-wrap gap-2">
      {BENEFITS.map((b) => {
        const active = value.includes(b);
        return (
          <button
            key={b}
            type="button"
            onClick={() => onChange(active ? value.filter((v) => v !== b) : [...value, b])}
            className={[
              active
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50',
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            ].join(' ')}
          >
            {active && <Icon name="check" size={10} className="inline mr-1" />}{b}
          </button>
        );
      })}
    </div>
  </div>
);

/* ─── Remote toggle ─── */
const RemoteToggle = ({ value, onChange }) => {
  const opts = [
    { value: 'office', label: 'On-site', icon: 'building' },
    { value: 'hybrid', label: 'Hybrid', icon: 'activity' },
    { value: 'remote', label: 'Remote', icon: 'globe' },
  ];
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Work Arrangement</label>
      <div className="grid grid-cols-3 gap-2">
        {opts.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={[
                'flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                active
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50',
              ].join(' ')}
            >
              <Icon name={o.icon} size={14} /> {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Salary Range ─── */
const SalaryInputs = ({ min, max, onMin, onMax, currency, onCurrency, error }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Salary Range</label>
    <div className="flex items-center gap-2">
      <select value={currency} onChange={(e) => onCurrency(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 cursor-pointer">
        {CURRENCY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <input type="number" value={min} onChange={onMin} placeholder="Min" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 transition-all" />
      <span className="text-slate-300">—</span>
      <input type="number" value={max} onChange={onMax} placeholder="Max" className={['flex-1 px-3 py-2 rounded-lg border bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all', error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-400'].join(' ')} />
    </div>
    {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
  </div>
);

/* ─── Preview Card ─── */
const JobCardPreview = ({ form }) => {
  const hasData = form.title || form.company || form.description;
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4">
        {hasData ? (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {(form.company || 'C')[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{form.title || 'Job Title'}</h3>
                  <p className="text-xs text-slate-500">{form.company || 'Company'}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">{form.type === 'fulltime' ? 'Full-time' : form.type === 'parttime' ? 'Part-time' : form.type === 'contract' ? 'Contract' : form.type === 'internship' ? 'Internship' : 'Freelance'}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><Icon name="map-pin" size={12} /> {form.location || 'Location'}</span>
              <span className="flex items-center gap-1"><Icon name="wallet" size={12} /> {form.salaryMin || form.salaryMax ? `${form.currency === 'USD' ? '$' : '₹'}${form.salaryMin || '0'} - ${form.currency === 'USD' ? '$' : '₹'}${form.salaryMax || '∞'}` : 'Salary not specified'}</span>
            </div>
            {form.description && <p className="text-sm text-slate-600 mb-3 line-clamp-2">{form.description}</p>}
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {form.skills.slice(0, 3).map((s, i) => <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{s}</span>)}
                {form.skills.length > 3 && <span className="px-2 py-0.5 text-xs text-slate-400">+{form.skills.length - 3}</span>}
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center">
            <Icon name="eye" size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Step Indicator ─── */
const StepIndicator = ({ current, total }) => (
  <div className="flex items-center gap-2 mb-6">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={[
          'flex-1 h-1 rounded-full transition-all duration-500',
          i <= current ? 'bg-indigo-500' : 'bg-slate-200',
        ].join(' ')}
      />
    ))}
  </div>
);

/* ─── Step Label ─── */
const StepLabel = ({ current, total }) => (
  <div className="mb-5">
    <span className="text-xs font-semibold text-indigo-600">Step {current + 1} of {total}</span>
    <h2 className="text-lg font-bold text-slate-800 mt-0.5">{STEPS[current].label}</h2>
    <p className="text-xs text-slate-400 mt-0.5">{STEPS[current].desc}</p>
  </div>
);

/* ─── Section Card ─── */
const SectionCard = ({ children, className = '' }) => (
  <div className={['bg-white rounded-lg border border-slate-200 p-4', className].join(' ')}>
    {children}
  </div>
);

/* ─── Field wrapper ─── */
const FieldLabel = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-slate-500">
      {label} {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);


/* ─── Main ─── */
export const JobsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [view, setView] = useState('grid');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [f, setF] = useState(initialJobState);
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const filtered = recentJobs.filter((j) => {
    const q = search.toLowerCase();
    return (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)) && (!status || j.status === status) && (!type || j.type === type);
  });

  const upd = (key) => (e) => setF((p) => ({ ...p, [key]: e?.target ? e.target.value : e }));

  const valid = (s) => {
    const e = {};
    if (s === 0) { if (!f.title.trim()) e.title = 'Required'; if (!f.company.trim()) e.company = 'Required'; if (!f.location.trim()) e.location = 'Required'; }
    if (s === 1) { if (!f.description || f.description.trim().length < 30) e.desc = 'Need at least 30 characters'; if (f.skills.length === 0) e.skills = 'Add at least one skill'; }
    if (s === 2) { if (f.salaryMin && f.salaryMax && Number(f.salaryMax) < Number(f.salaryMin)) e.salary = 'Max must be ≥ min'; }
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (valid(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    if (step !== STEPS.length - 1) { next(); return; }
    if (!valid(step)) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  };

  const close = () => {
    if (loading) return;
    setOpen(false);
    setTimeout(() => { setF(initialJobState); setStep(0); setErrs({}); setDone(false); }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all job postings on the platform</p>
        </div>
        <div className="flex gap-2">
          <Button icon="plus" onClick={() => setOpen(true)}>Post New Job</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {jobStats.map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <ToneIcon icon={s.icon} tone={s.tone} size="md" />
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{s.label}</div>
              <div className="text-xl font-bold text-slate-900">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Job Listings */}
      <Card>
        <CardHeader title="All Job Postings" subtitle={`${filtered.length} jobs found`} action={
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setView('grid')} className={['px-3 py-1.5 rounded-md text-xs font-medium transition', view === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'].join(' ')}>
              <Icon name="grip" size={14} />
            </button>
            <button onClick={() => setView('list')} className={['px-3 py-1.5 rounded-md text-xs font-medium transition', view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'].join(' ')}>
              <Icon name="bar-chart" size={14} />
            </button>
          </div>
        } />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} icon="search" className="flex-1" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' }, { value: 'closed', label: 'Closed' }]} placeholder="All Status" className="md:w-48" />
          <Select value={type} onChange={(e) => setType(e.target.value)} options={[{ value: 'Full-time', label: 'Full-time' }, { value: 'Part-time', label: 'Part-time' }, { value: 'Contract', label: 'Contract' }]} placeholder="All Types" className="md:w-48" />
        </div>

        {view === 'list' ? (
          <Table><THead><TR><TH>Job</TH><TH>Company</TH><TH>Type</TH><TH>Applicants</TH><TH>Status</TH><TH align="right">Actions</TH></TR></THead><TBody>{filtered.map((j) => (<TR key={j.id}><TD><div className="font-semibold text-slate-900">{j.title}</div><div className="text-xs text-slate-500">{j.location} · {j.salary}</div></TD><TD><div className="flex items-center gap-2"><Avatar name={j.company} size="xs" /><span className="font-medium">{j.company}</span></div></TD><TD><Badge tone="info">{j.type}</Badge></TD><TD><Badge tone="primary" icon="users">{j.applicants}</Badge></TD><TD><Badge tone={statusTone(j.status)} dot>{j.status}</Badge></TD><TD align="right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="xs" icon="eye" /><Button variant="ghost" size="xs" icon="pencil" /><Button variant="ghost" size="xs" icon="more-vertical" /></div></TD></TR>))}</TBody></Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6 pt-2">
            {filtered.map((j) => (
              <div key={j.id} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3"><Avatar name={j.company} size="md" /><Badge tone={statusTone(j.status)} dot>{j.status}</Badge></div>
                <h3 className="text-base font-semibold text-slate-900">{j.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{j.company}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500"><Icon name="map-pin" size={12} /> {j.location}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500"><Icon name="wallet" size={12} /> {j.salary}</div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100"><Badge tone="info" icon="users">{j.applicants} applicants</Badge><span className="text-xs text-slate-500">{j.posted}</span></div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Post New Job Modal */}
      <Modal 
        open={open} 
        onClose={close} 
        size="lg"
        title={done ? null : "Post a New Job"}
        subtitle={done ? null : "Fill in the details to publish a new listing"}
        footer={done ? null : (
          <>
            <Button variant="ghost" onClick={close}>Cancel</Button>
            <div className="flex-1" />
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="secondary" onClick={back} disabled={loading}>Back</Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={next}>Continue</Button>
              ) : (
                <Button onClick={submit} loading={loading}>
                  {loading ? 'Publishing...' : 'Publish Job'}
                </Button>
              )}
            </div>
          </>
        )}
      >
        {done ? (
          /* Success State */
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-4">
              <Icon name="check" size={28} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Job Posted!</h3>
            <p className="text-sm text-slate-500">Your job listing is now live</p>
            <div className="mt-6 p-3 rounded-lg bg-slate-50 max-w-sm mx-auto text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center">
                  <Icon name="briefcase" size={14} className="text-indigo-600" />
                </div>
                <div>
                  <span className="font-medium text-sm text-slate-800">{f.title}</span>
                  <p className="text-xs text-slate-500">{f.company} · {f.location}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2 justify-center">
              <Button variant="outline" onClick={close}>Close</Button>
              <Button onClick={close}>View Listing</Button>
            </div>
          </div>
        ) : (
          <>
            <StepIndicator current={step} total={STEPS.length} />

            {/* Step Content */}
            <div className="min-h-[320px]">
              <StepLabel current={step} total={STEPS.length} />

              {/* Step 0: Basic Info */}
              {step === 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel label="Job Title" required>
                        <input
                          value={f.title}
                          onChange={upd('title')}
                          placeholder="e.g. Senior Frontend Engineer"
                          className={['w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none transition-all', errs.title ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-400'].join(' ')}
                        />
                        {errs.title && <p className="text-xs text-rose-500 mt-1">{errs.title}</p>}
                      </FieldLabel>
                    </div>
                    <div>
                      <FieldLabel label="Company" required>
                        <input
                          value={f.company}
                          onChange={upd('company')}
                          placeholder="e.g. TechCorp Inc."
                          className={['w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none transition-all', errs.company ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-400'].join(' ')}
                        />
                        {errs.company && <p className="text-xs text-rose-500 mt-1">{errs.company}</p>}
                      </FieldLabel>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel label="Location" required>
                        <input
                          value={f.location}
                          onChange={upd('location')}
                          placeholder="e.g. San Francisco, CA"
                          className={['w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none transition-all', errs.location ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-400'].join(' ')}
                        />
                        {errs.location && <p className="text-xs text-rose-500 mt-1">{errs.location}</p>}
                      </FieldLabel>
                    </div>
                    <div>
                      <FieldLabel label="Department">
                        <input
                          value={f.department}
                          onChange={upd('department')}
                          placeholder="e.g. Engineering"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400 transition-all"
                        />
                      </FieldLabel>
                    </div>
                  </div>

                  <div>
                    <FieldLabel label="Category">
                      <select
                        value={f.category}
                        onChange={upd('category')}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="" disabled>Select a category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel label="Employment Type">
                        <select value={f.type} onChange={upd('type')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400">
                          {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </FieldLabel>
                    </div>
                    <div>
                      <FieldLabel label="Experience Level">
                        <select value={f.experience} onChange={upd('experience')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400">
                          {EXP_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </FieldLabel>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel label="Vacancies">
                        <input type="number" min="1" value={f.vacancies} onChange={upd('vacancies')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400" />
                      </FieldLabel>
                    </div>
                    <div>
                      <FieldLabel label="Education">
                        <select value={f.education} onChange={upd('education')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400">
                          {EDU_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </FieldLabel>
                    </div>
                  </div>

                  <div>
                    <RemoteToggle value={f.remoteOption} onChange={upd('remoteOption')} />
                  </div>
                </div>
              )}

              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-3">
                  <div>
                    <FieldLabel label="Job Description" required>
                      <textarea
                        value={f.description}
                        onChange={upd('description')}
                        rows={4}
                        placeholder="Describe the role, responsibilities, requirements..."
                        className={['w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none transition-all resize-none', errs.desc ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-400'].join(' ')}
                      />
                      {errs.desc && <p className="text-xs text-rose-500 mt-1">{errs.desc}</p>}
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel label="Responsibilities">
                        <textarea value={f.responsibilities} onChange={upd('responsibilities')} rows={3} placeholder="Key responsibilities..." className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400 resize-none" />
                      </FieldLabel>
                    </div>
                    <div>
                      <FieldLabel label="Qualifications">
                        <textarea value={f.qualifications} onChange={upd('qualifications')} rows={3} placeholder="Required qualifications..." className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400 resize-none" />
                      </FieldLabel>
                    </div>
                  </div>

                  <div>
                    <SkillInput tags={f.skills} onChange={upd('skills')} />
                    {errs.skills && <p className="text-xs text-rose-500 mt-1">{errs.skills}</p>}
                  </div>

                  <div>
                    <FieldLabel label="Application Deadline">
                      <input type="date" value={f.applyDeadline} onChange={upd('applyDeadline')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400" />
                    </FieldLabel>
                  </div>
                </div>
              )}

              {/* Step 2: Pay & Perks */}
              {step === 2 && (
                <div className="space-y-3">
                  <SalaryInputs
                    min={f.salaryMin}
                    max={f.salaryMax}
                    onMin={upd('salaryMin')}
                    onMax={upd('salaryMax')}
                    currency={f.currency}
                    onCurrency={upd('currency')}
                    error={errs.salary}
                  />

                  <BenefitChips value={f.benefits} onChange={upd('benefits')} />
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-3">
                  <JobCardPreview form={f} />
                  
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Publish Checklist</p>
                    <div className="space-y-1.5">
                      {[
                        { ok: f.title && f.company && f.location, label: 'Title, company & location filled' },
                        { ok: f.description?.length >= 30, label: 'Description is complete' },
                        { ok: f.skills.length > 0, label: 'At least one skill added' },
                        { ok: !(f.salaryMin && f.salaryMax && Number(f.salaryMax) < Number(f.salaryMin)), label: 'Salary range is valid' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className={['w-4 h-4 rounded-full flex items-center justify-center', item.ok ? 'bg-emerald-500' : 'bg-slate-300'].join(' ')}>
                            {item.ok && <Icon name="check" size={8} strokeWidth={3} className="text-white" />}
                          </div>
                          <span className={item.ok ? 'text-slate-700' : 'text-slate-400'}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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