"use client";

import { useState } from 'react';

type Props = {
  token: string;
  email: string;
};

export function AcceptInviteForm({ token, email }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const accept = async () => {
    setStatus('Submitting...');
    const formData = new FormData();
    formData.append('token', token);
    formData.append('name', name);
    formData.append('password', password);
    const res = await fetch('/accept-invite', {
      method: 'POST',
      body: formData
    });
    setStatus(res.ok ? 'Invite accepted, you can log in.' : 'Failed to accept invite.');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">
        Accepting invite for <span className="font-semibold">{email}</span>
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Set password
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
        onClick={accept}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white"
      >
        Accept invite
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}

