import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Icon } from '../components/ui/Icon';
import { settingsTabs } from '../data/mockData';

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange?.(!checked)}
    className={['relative w-11 h-6 rounded-full transition', checked ? 'bg-indigo-600' : 'bg-slate-300'].join(' ')}
  >
    <span
      className={['absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', checked ? 'left-5' : 'left-0.5'].join(' ')}
    ></span>
  </button>
);

const notifItems = [
  { key: 'registrations', label: 'New user registrations', desc: 'Get notified when a new user signs up' },
  { key: 'applications', label: 'Job applications', desc: 'When someone applies to a job' },
  { key: 'approvals', label: 'Company approvals', desc: 'New companies awaiting approval' },
  { key: 'weekly', label: 'Weekly reports', desc: 'Receive weekly performance summary' },
  { key: 'marketing', label: 'Marketing emails', desc: 'Product updates and announcements' },
];

const team = [
  { name: 'Sarah Johnson', email: 'sarah@wonnet.com', role: 'Super Admin', status: 'active' },
  { name: 'Michael Chen', email: 'michael@wonnet.com', role: 'Admin', status: 'active' },
  { name: 'Emma Williams', email: 'emma@wonnet.com', role: 'Editor', status: 'pending' },
];

const tabIconMap = {
  profile: 'user',
  account: 'shield',
  notifications: 'bell',
  billing: 'credit-card',
  team: 'user-cog',
};

export const SettingsPage = ({ user }) => {
  const [tab, setTab] = useState('profile');
  const [notifs, setNotifs] = useState({
    registrations: true, applications: true, approvals: true, weekly: false, marketing: false,
  });
  const [twoFA, setTwoFA] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-3 h-fit">
          {settingsTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition',
                tab === t.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <span className="w-5 h-5 inline-flex items-center justify-center">
                <Icon name={tabIconMap[t.id] || 'settings'} size={15} strokeWidth={2.25} />
              </span>
              {t.label}
            </button>
          ))}
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {tab === 'profile' && (
            <>
              <Card>
                <CardHeader title="Profile Information" subtitle="Update your personal details" />
                <CardBody>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar name={user?.name || 'Admin User'} size="xl" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{user?.name || 'Admin User'}</h3>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" icon="camera">Change Photo</Button>
                        <Button size="sm" variant="ghost" icon="trash-2">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue={user?.name || 'Admin User'} icon="user" />
                    <Input label="Email" defaultValue={user?.email || 'admin@wonnet.com'} icon="mail" />
                    <Input label="Phone" placeholder="+1 (555) 000-0000" icon="phone" />
                    <Input label="Location" placeholder="San Francisco, CA" icon="map-pin" />
                  </div>
                  <div className="mt-4">
                    <Textarea label="Bio" placeholder="Tell us about yourself..." />
                  </div>
                </CardBody>
              </Card>
              <div className="flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button icon="save">Save Changes</Button>
              </div>
            </>
          )}

          {tab === 'account' && (
            <Card>
              <CardHeader title="Account Security" subtitle="Manage your password and authentication" />
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <Input type="password" label="Current Password" />
                    <Input type="password" label="New Password" hint="Must be at least 8 characters" />
                    <Input type="password" label="Confirm New Password" />
                  </div>
                  <Button className="mt-3" icon="key">Update Password</Button>
                </div>
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Authenticator App</p>
                      <p className="text-xs text-slate-500 mt-0.5">Use an app to generate one-time codes</p>
                    </div>
                    <Toggle checked={twoFA} onChange={setTwoFA} />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <CardHeader title="Notification Preferences" subtitle="Choose what you want to be notified about" />
              <CardBody className="space-y-3">
                {notifItems.map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{n.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                    <Toggle
                      checked={notifs[n.key]}
                      onChange={(v) => setNotifs((s) => ({ ...s, [n.key]: v }))}
                    />
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};