import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { recentApplications } from '../data/mockData';

const statusTone = (s) => ({
  reviewing: 'info', shortlisted: 'primary', interview: 'purple', rejected: 'danger', hired: 'success',
}[s] || 'default');

const appStats = [
  { label: 'Total', value: '5,632', icon: 'file-check', tone: 'primary' },
  { label: 'Reviewing', value: '1,284', icon: 'eye', tone: 'info' },
  { label: 'Shortlisted', value: '842', icon: 'thumbs-up', tone: 'primary' },
  { label: 'Interview', value: '324', icon: 'message-square', tone: 'purple' },
  { label: 'Hired', value: '186', icon: 'trophy', tone: 'success' },
];

export const ApplicationsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const filtered = recentApplications.filter((a) => {
    const s = search.toLowerCase();
    const matchSearch = !s || a.candidate.toLowerCase().includes(s) || a.job.toLowerCase().includes(s);
    const matchStatus = !status || a.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Applications</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage all job applications</p>
        </div>
        <div className="flex gap-2">
          <Button icon="filter">Advanced Filters</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {appStats.map((s) => (
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
        <CardHeader title="All Applications" subtitle={`${filtered.length} applications found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search by candidate or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
            className="flex-1"
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'reviewing', label: 'Reviewing' },
              { value: 'shortlisted', label: 'Shortlisted' },
              { value: 'interview', label: 'Interview' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'hired', label: 'Hired' },
            ]}
            placeholder="All Status"
            className="md:w-48"
          />
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Candidate</TH>
              <TH>Job</TH>
              <TH>Experience</TH>
              <TH>Status</TH>
              <TH align="right">Applied</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((a) => (
              <TR key={a.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <Avatar name={a.candidate} size="sm" />
                    <span className="font-semibold text-slate-900">{a.candidate}</span>
                  </div>
                </TD>
                <TD>
                  <div className="font-medium text-slate-800">{a.job}</div>
                  <div className="text-xs text-slate-500">{a.company}</div>
                </TD>
                <TD><Badge tone="info">{a.experience}</Badge></TD>
                <TD><Badge tone={statusTone(a.status)} dot>{a.status}</Badge></TD>
                <TD align="right" className="text-xs text-slate-500">{a.applied}</TD>
                <TD align="right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="success" size="xs" icon="check">Shortlist</Button>
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

export default ApplicationsPage;
