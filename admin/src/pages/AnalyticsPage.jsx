import React from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { AreaChart, BarChart, DonutChart } from '../components/charts/Sparkline';
import { Progress } from '../components/ui/Progress';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Avatar } from '../components/ui/Avatar';
import {
  revenueData, applicationsData, userDistribution, trafficSources, topCompanies,
} from '../data/mockData';

const kpis = [
  { label: 'Page Views', value: '284,329', change: 12.5, icon: 'eye', tone: 'primary' },
  { label: 'Unique Visitors', value: '42,891', change: 8.2, icon: 'users', tone: 'success' },
  { label: 'Conversion Rate', value: '4.7%', change: 1.2, icon: 'target', tone: 'warning' },
  { label: 'Avg. Session', value: '5m 24s', change: -0.8, icon: 'clock', tone: 'info' },
];

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Track your platform's performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon="calendar">Last 30 days</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <ToneIcon icon={s.icon} tone={s.tone} size="md" />
              <Badge tone={s.change >= 0 ? 'success' : 'danger'} dot>
                {s.change >= 0 ? '+' : ''}{s.change}%
              </Badge>
            </div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue Trend" subtitle="Last 12 months" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Applications by Day" subtitle="This week" />
          <CardBody>
            <BarChart data={applicationsData.values} labels={applicationsData.labels} tone="primary" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Traffic Sources" subtitle="Where your visitors come from" />
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

      <Card>
        <CardHeader title="Top Performing Companies" subtitle="By jobs and applicants" />
        <Table>
          <THead>
            <TR>
              <TH>Company</TH>
              <TH align="center">Jobs</TH>
              <TH align="center">Applicants</TH>
              <TH align="center">Rating</TH>
              <TH>Performance</TH>
            </TR>
          </THead>
          <TBody>
            {topCompanies.map((c) => {
              const perf = Math.min(100, c.applicants / 4);
              return (
                <TR key={c.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size="sm" tone={c.tone} />
                      <span className="font-semibold text-slate-900">{c.name}</span>
                    </div>
                  </TD>
                  <TD align="center" className="font-semibold">{c.jobs}</TD>
                  <TD align="center" className="font-semibold">{c.applicants}</TD>
                  <TD align="center">
                    <Badge tone="warning" icon="star">{c.rating}</Badge>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Progress value={perf} tone="success" size="sm" className="flex-1" />
                      <span className="text-xs font-semibold text-slate-600 w-10 text-right">{Math.round(perf)}%</span>
                    </div>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
