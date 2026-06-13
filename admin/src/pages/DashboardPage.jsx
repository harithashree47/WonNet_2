import React from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ToneIcon } from '../components/ui/ToneIcon';
import { StatCard } from '../components/dashboard/StatCard';
import { AreaChart, BarChart, DonutChart } from '../components/charts/Sparkline';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Progress } from '../components/ui/Progress';
import {
  stats,
  revenueData,
  applicationsData,
  userDistribution,
  recentUsers,
  recentJobs,
  recentApplications,
  activities,
  topCompanies,
  trafficSources,
} from '../data/mockData';

const statusTone = (s) => ({
  active: 'success', pending: 'warning', inactive: 'default', closed: 'default',
  reviewing: 'info', shortlisted: 'primary', interview: 'purple', rejected: 'danger',
}[s] || 'default');

export const DashboardPage = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-slate-800 p-6 lg:p-8 text-white relative overflow-hidden shadow-premium-lg">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-white/5 translate-y-1/2"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
           
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Welcome back, Super Admin 
            </h2>
            <p className="text-white/70 mt-1 text-sm">
              Here's what's happening with your job portal today.
            </p>
          </div>
          
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue Overview"
            subtitle="Monthly revenue for the current year"
            action={
              <div className="flex items-center gap-2">
                <Badge tone="success" dot>+$12.5k this month</Badge>
                <Button variant="ghost" size="sm" icon="fa-solid fa-ellipsis-vertical" />
              </div>
            }
          />
          <CardBody>
            <AreaChart data={revenueData.values} labels={revenueData.labels} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="User Distribution" subtitle="By account type" />
          <CardBody className="flex flex-col items-center">
            <DonutChart data={userDistribution} size={180} thickness={22} />
            <div className="w-full mt-6 space-y-2">
              {userDistribution.map((u) => (
                <div key={u.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: u.color }}></span>
                    <span className="text-slate-700 font-medium">{u.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{u.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Applications This Week"
            subtitle="Daily application submissions"
            action={<Button variant="ghost" size="sm" icon="fa-solid fa-arrow-up-right-from-square" iconRight="fa-solid fa-arrow-right" />}
          />
          <CardBody>
            <BarChart data={applicationsData.values} labels={applicationsData.labels} tone="success" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Traffic Sources" subtitle="Where visitors come from" />
          <CardBody className="space-y-4">
            {trafficSources.map((t) => (
              <div key={t.source}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-700">{t.source}</span>
                  <span className="text-slate-500 font-medium">{t.visits.toLocaleString()} · {t.percent}%</span>
                </div>
                <Progress value={t.percent} tone={t.tone} size="sm" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Recent Jobs"
            subtitle="Latest job postings"
            action={<Button size="sm" variant="outline" icon="fa-solid fa-arrow-right" onClick={() => onNavigate?.('jobs')}>View All</Button>}
          />
          <Table>
            <THead>
              <TR>
                <TH>Job Title</TH>
                <TH>Company</TH>
                <TH>Applicants</TH>
                <TH>Status</TH>
                <TH align="right">Posted</TH>
              </TR>
            </THead>
            <TBody>
              {recentJobs.slice(0, 5).map((j) => (
                <TR key={j.id}>
                  <TD>
                    <div className="font-semibold text-slate-900">{j.title}</div>
                    <div className="text-xs text-slate-500">{j.location} · {j.salary}</div>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Avatar name={j.company} size="xs" />
                      <span className="font-medium">{j.company}</span>
                    </div>
                  </TD>
                  <TD>
                    <Badge tone="info">{j.applicants} applied</Badge>
                  </TD>
                  <TD><Badge tone={statusTone(j.status)} dot>{j.status}</Badge></TD>
                  <TD align="right" className="text-slate-500 text-xs">{j.posted}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Activity Feed" subtitle="Latest system events" action={<Button variant="ghost" size="sm" icon="fa-solid fa-rotate" />} />
          <div className="p-3 space-y-1">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition">
                <ToneIcon icon={a.icon} tone={a.tone} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">
                    <span className="font-semibold text-slate-900">{a.user}</span> {a.action}{' '}
                    {a.target && <span className="font-semibold text-slate-900">{a.target}</span>}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Recent Applications"
            subtitle="New applications to review"
            action={<Button size="sm" variant="outline" icon="fa-solid fa-arrow-right" onClick={() => onNavigate?.('applications')}>View All</Button>}
          />
          <Table>
            <THead>
              <TR>
                <TH>Candidate</TH>
                <TH>Job</TH>
                <TH>Status</TH>
                <TH align="right">Applied</TH>
              </TR>
            </THead>
            <TBody>
              {recentApplications.map((a) => (
                <TR key={a.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Avatar name={a.candidate} size="xs" />
                      <div>
                        <div className="font-semibold text-slate-900">{a.candidate}</div>
                        <div className="text-xs text-slate-500">{a.experience} experience</div>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <div className="font-medium text-slate-800">{a.job}</div>
                    <div className="text-xs text-slate-500">{a.company}</div>
                  </TD>
                  <TD><Badge tone={statusTone(a.status)} dot>{a.status}</Badge></TD>
                  <TD align="right" className="text-xs text-slate-500">{a.applied}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>

        <Card>
          <CardHeader
            title="Top Companies"
            subtitle="Best performing companies"
            action={<Button size="sm" variant="outline" icon="fa-solid fa-arrow-right" onClick={() => onNavigate?.('companies')}>View All</Button>}
          />
          <div className="p-3 space-y-2">
            {topCompanies.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group cursor-pointer">
                <Avatar name={c.name} size="md" tone={c.tone} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{c.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.jobs} jobs · {c.applicants} applicants
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50">
                  <i className="fa-solid fa-star text-amber-500 text-xs"></i>
                  <span className="text-xs font-bold text-amber-700">{c.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <Card>
        <CardHeader
          title="Recent Users"
          subtitle="Newly registered users"
          action={<Button size="sm" variant="outline" icon="fa-solid fa-arrow-right" onClick={() => onNavigate?.('users')}>View All</Button>}
        />
        <Table>
          <THead>
            <TR>
              <TH>User</TH>
              <TH>Email</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH align="right">Joined</TH>
            </TR>
          </THead>
          <TBody>
            {recentUsers.map((u) => (
              <TR key={u.id}>
                <TD>
                  <div className="flex items-center gap-2">
                    <Avatar name={u.name} size="sm" />
                    <span className="font-semibold text-slate-900">{u.name}</span>
                  </div>
                </TD>
                <TD className="text-slate-600">{u.email}</TD>
                <TD><Badge tone="primary">{u.role}</Badge></TD>
                <TD><Badge tone={statusTone(u.status)} dot>{u.status}</Badge></TD>
                <TD align="right" className="text-xs text-slate-500">{u.joined}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
};

export default DashboardPage;
