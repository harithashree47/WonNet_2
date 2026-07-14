import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { StatCard } from '../components/dashboard/StatCard';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { getDashboardStats, getRecentApplications } from '../api/dashboard';

const statusTone = (s) => ({
  active: 'success', pending: 'warning', inactive: 'default', closed: 'default',
  reviewing: 'info', shortlisted: 'primary', interview: 'purple', rejected: 'danger',
}[s] || 'default');

export const DashboardPage = ({ onNavigate }) => {
  const [stats, setStats] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, appsRes] = await Promise.all([
        getDashboardStats(),
        getRecentApplications(10),
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (appsRes.success) setApplications(appsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-slate-800 p-6 lg:p-8 text-white relative overflow-hidden shadow-premium-lg">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-white/5 translate-y-1/2"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Welcome back, Admin
            </h2>
            <p className="text-white/70 mt-1 text-sm">
              Here's what's happening with your job portal today.
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5">
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 rounded-lg bg-slate-200" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-6 w-16 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.label} stat={s} />)}
        </div>
      )}

      {/* Recent Applications */}
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
            {loading ? (
              <TR>
                <TD colSpan={4} className="text-center text-slate-400 py-8">
                  Loading applications...
                </TD>
              </TR>
            ) : applications.length === 0 ? (
              <TR>
                <TD colSpan={4} className="text-center text-slate-400 py-8">
                  No applications yet
                </TD>
              </TR>
            ) : (
              applications.map((a) => (
                <TR key={a.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Avatar name={a.candidate} size="xs" />
                      <div>
                        <div className="font-semibold text-slate-900">{a.candidate}</div>
                        <div className="text-xs text-slate-500">{a.experience}</div>
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
              ))
            )}
          </TBody>
        </Table>
      </Card>
    </div>
  );
};

export default DashboardPage;
