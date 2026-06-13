import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { companyList } from '../data/mockData';

const statusTone = (s) => ({ verified: 'success', pending: 'warning' }[s] || 'default');

const companyStats = [
  { label: 'Total Companies', value: '320', icon: 'building', tone: 'primary' },
  { label: 'Verified', value: '278', icon: 'check-circle', tone: 'success' },
  { label: 'Pending', value: '32', icon: 'clock', tone: 'warning' },
  { label: 'Active Jobs', value: '1,254', icon: 'briefcase', tone: 'info' },
];

export const CompaniesPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [industry, setIndustry] = useState('');

  const filtered = companyList.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch = !s || c.name.toLowerCase().includes(s) || c.industry.toLowerCase().includes(s);
    const matchStatus = !status || c.status === status;
    const matchIndustry = !industry || c.industry === industry;
    return matchSearch && matchStatus && matchIndustry;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Companies</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all registered companies</p>
        </div>
        <div className="flex gap-2">
          <Button icon="plus">Add Company</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {companyStats.map((s) => (
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
        <CardHeader title="All Companies" subtitle={`${filtered.length} companies found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
            className="flex-1"
          />
          <Select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            options={[
              { value: 'Technology', label: 'Technology' },
              { value: 'Design', label: 'Design' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'SaaS', label: 'SaaS' },
            ]}
            placeholder="All Industries"
            className="md:w-48"
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'verified', label: 'Verified' },
              { value: 'pending', label: 'Pending' },
            ]}
            placeholder="All Status"
            className="md:w-48"
          />
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Company</TH>
              <TH>Industry</TH>
              <TH>Jobs</TH>
              <TH>Employees</TH>
              <TH>Location</TH>
              <TH>Status</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((c) => (
              <TR key={c.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size="sm" />
                    <span className="font-semibold text-slate-900">{c.name}</span>
                  </div>
                </TD>
                <TD className="text-sm text-slate-600">{c.industry}</TD>
                <TD><Badge tone="primary" icon="briefcase">{c.jobs}</Badge></TD>
                <TD className="text-sm text-slate-600">{c.employees}</TD>
                <TD className="text-sm text-slate-500">{c.location}</TD>
                <TD><Badge tone={statusTone(c.status)} dot>{c.status}</Badge></TD>
                <TD align="right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="xs" icon="eye" />
                    {c.status === 'pending' && <Button variant="success" size="xs" icon="check">Approve</Button>}
                    <Button variant="ghost" size="xs" icon="more-vertical" />
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
};

export default CompaniesPage;
