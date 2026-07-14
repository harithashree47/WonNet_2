import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const SettingsPage = ({ user }) => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = 'http://localhost:3000';
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Password updated successfully');
        setNewPassword('');
      } else {
        alert(result.message || 'Failed to update password');
      }
    } catch (error) {
      alert('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Password</h1>
        <p className="text-sm text-slate-500 mt-1">Change your account password</p>
      </div>

      <Card>
        <CardHeader title="New Password" subtitle="Enter the new password" />
        <CardBody>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              type="password"
              label="New Password"
              placeholder="Enter new password"
              hint="Must be at least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button type="submit" icon="key" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage;
