"use client";

import { useState } from 'react';

export function ResetPasswordForm({ token }: { token?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const requestReset = async () => {
    setStatus('Sending...');
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setStatus(res.ok ? 'Email sent if account exists.' : 'Request failed.');
  };

  const confirmReset = async () => {
    if (!token) return;
    setStatus('Updating...');
    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    setStatus(res.ok ? 'Password updated.' : 'Reset failed.');
  };

  if (token) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New password
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={confirmReset}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white"
        >
          Update password
        </button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={requestReset}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white"
      >
        Send reset link
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}

