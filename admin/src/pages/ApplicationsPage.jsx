import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ToneIcon } from '../components/ui/ToneIcon';
import { Icon } from '../components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { getAllApplications, updateApplicationStatus, getCompanyStats, getApplicationById } from '../api/application';

export const ApplicationsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    offered: 0,
    rejected: 0,
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const result = await getAllApplications({ status: statusFilter, limit: 100 });
    if (result.success && Array.isArray(result.data)) {
      setApplications(result.data);
    } else {
      setApplications([]);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const result = await getCompanyStats();
    if (result.success && result.data) {
      setStats({
        total: result.data.total || 0,
        reviewing: result.data.statuses?.reviewing || 0,
        shortlisted: result.data.statuses?.shortlisted || 0,
        interview: result.data.statuses?.interview || 0,
        offered: result.data.statuses?.offered || 0,
        rejected: result.data.statuses?.rejected || 0,
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const openViewModal = async (app) => {
    setLoadingDetails(true);
    setViewModalOpen(true);
    const result = await getApplicationById(app.id);
    if (result.success) {
      setSelectedApp(result.data);
    } else {
      setSelectedApp(app);
    }
    setLoadingDetails(false);
  };

  const openEditModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setEditModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;
    const result = await updateApplicationStatus(selectedApp.id, newStatus);
    if (result.success) {
      fetchApplications();
      fetchStats();
      setEditModalOpen(false);
      setSelectedApp(null);
    } else {
      alert(result.error?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const toneMap = {
      applied: 'default',
      reviewing: 'info',
      shortlisted: 'primary',
      interview: 'purple',
      offered: 'success',
      rejected: 'danger',
      withdrawn: 'default',
    };
    return <Badge tone={toneMap[status] || 'default'} dot>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredApplications = applications.filter((app) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      (app.user?.name?.toLowerCase().includes(searchLower)) ||
      (app.job?.title?.toLowerCase().includes(searchLower));
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Applications</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage job applications</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="file-check" tone="primary" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Total</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.total}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="eye" tone="info" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Reviewing</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.reviewing}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="thumbs-up" tone="primary" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Shortlisted</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.shortlisted}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="message-square" tone="purple" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Interview</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.interview}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="trophy" tone="success" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Offered</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.offered}</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <ToneIcon icon="x-circle" tone="danger" size="md" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2">Rejected</div>
          <div className="text-xl font-extrabold text-slate-900">{stats.rejected}</div>
        </Card>
      </div>

      <Card>
        <CardHeader title="All Applications" subtitle={`${filteredApplications.length} applications found`} />
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search by candidate or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
            className="flex-1"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              { value: 'applied', label: 'Applied' },
              { value: 'reviewing', label: 'Reviewing' },
              { value: 'shortlisted', label: 'Shortlisted' },
              { value: 'interview', label: 'Interview' },
              { value: 'offered', label: 'Offered' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'withdrawn', label: 'Withdrawn' },
            ]}
            placeholder="All Status"
            className="md:w-48"
          />
        </div>
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading applications...</div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Candidate</TH>
                <TH>Job</TH>
                <TH>Status</TH>
                <TH align="right">Applied</TH>
                <TH align="right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredApplications.length === 0 ? (
                <TR>
                  <TD colSpan={5} className="text-center py-8 text-slate-500">
                    No applications found
                  </TD>
                </TR>
              ) : (
                filteredApplications.map((app) => (
                  <TR key={app.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <Avatar name={app.user?.name || 'U'} size="sm" />
                        <div>
                          <span className="font-semibold text-slate-900">{app.user?.name || 'Unknown'}</span>
                          <div className="text-xs text-slate-500">{app.user?.email}</div>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="font-medium text-slate-800">{app.job?.title || 'Unknown Job'}</div>
                      <div className="text-xs text-slate-500">{app.job?.company?.name || ''}</div>
                    </TD>
                    <TD>{getStatusBadge(app.status)}</TD>
                    <TD align="right" className="text-xs text-slate-500">{formatDate(app.createdAt)}</TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          icon="eye" 
                          onClick={() => openViewModal(app)} 
                          title="View Details" 
                        />
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          icon="pencil" 
                          onClick={() => openEditModal(app)} 
                          title="Edit Status" 
                        />
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        )}
      </Card>

      {/* View Modal */}
      <Modal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedApp(null);
        }}
        size="lg"
        title="Application Details"
        subtitle="View complete candidate application information"
        footer={
          <Button variant="ghost" onClick={() => setViewModalOpen(false)}>Close</Button>
        }
      >
        {loadingDetails ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : selectedApp ? (
          <div className="space-y-6">
            {/* Candidate Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Candidate Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Mobile</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.user?.mobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Designation</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.user?.designation || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Job Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Job Title</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.job?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.job?.company?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Application Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Current Status</p>
                  <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                </div>
                {selectedApp.resumeUrl && (
                  <div>
                    <p className="text-xs text-slate-500">Resume/CV</p>
                    <a 
                      href={selectedApp.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Resume
                    </a>
                  </div>
                )}
                {selectedApp.linkedin && (
                  <div>
                    <p className="text-xs text-slate-500">LinkedIn Profile</p>
                    <a 
                      href={selectedApp.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {selectedApp.linkedin}
                    </a>
                  </div>
                )}
                {selectedApp.portfolio && (
                  <div>
                    <p className="text-xs text-slate-500">Portfolio</p>
                    <a 
                      href={selectedApp.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {selectedApp.portfolio}
                    </a>
                  </div>
                )}
                {selectedApp.expectedSalary && (
                  <div>
                    <p className="text-xs text-slate-500">Expected Salary</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedApp.expectedSalary}</p>
                  </div>
                )}
                {selectedApp.noticePeriod && (
                  <div>
                    <p className="text-xs text-slate-500">Notice Period</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedApp.noticePeriod}</p>
                  </div>
                )}
                {selectedApp.motivation && (
                  <div>
                    <p className="text-xs text-slate-500">Motivation Letter</p>
                    <p className="text-sm text-slate-700 mt-1 p-3 bg-slate-50 rounded-lg">{selectedApp.motivation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Timeline</h3>
              <div className="text-xs text-slate-500 space-y-1">
                <p>Applied: {formatDate(selectedApp.createdAt)}</p>
                <p>Last Updated: {formatDate(selectedApp.updatedAt)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedApp(null);
        }}
        size="md"
        title="Edit Application Status"
        subtitle="Update the application status"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate} disabled={!newStatus || newStatus === selectedApp?.status}>
              Update Status
            </Button>
          </>
        }
      >
        {selectedApp ? (
          <div className="space-y-6">
            {/* Candidate Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Candidate Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Job Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Job Title</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.job?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedApp.job?.company?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Current Status</h3>
              <div>{getStatusBadge(selectedApp.status)}</div>
            </div>

            {/* Status Update */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">New Status</h3>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: 'applied', label: 'Applied' },
                  { value: 'reviewing', label: 'Reviewing' },
                  { value: 'shortlisted', label: 'Shortlisted' },
                  { value: 'interview', label: 'Interview' },
                  { value: 'offered', label: 'Offered' },
                  { value: 'rejected', label: 'Rejected' },
                  { value: 'withdrawn', label: 'Withdrawn' },
                ]}
                className="w-full"
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ApplicationsPage;