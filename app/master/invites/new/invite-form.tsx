'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createInviteAction } from '@/app/actions/master';
import { toast } from 'sonner';

interface Workspace {
  _id: string;
  name: string;
  type: string;
}

interface InviteFormProps {
  workspaces: Workspace[];
}

export function InviteForm({ workspaces }: InviteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    workspaceId: '',
    role: 'USER' as 'OWNER' | 'ADMIN' | 'USER' | 'VIEW_ONLY',
    expiresInDays: 7
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createInviteAction({
        email: formData.email,
        workspaceId: formData.workspaceId,
        role: formData.role,
        expiresInDays: formData.expiresInDays
      });

      if (result.success) {
        toast.success('Invite created and sent successfully');
        router.push('/master/invites');
      } else {
        toast.error(result.error || 'Failed to create invite');
      }
    } catch (error: any) {
      console.error('Error creating invite:', error);
      toast.error(error.message || 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="user@example.com"
          required
        />
        <p className="text-sm text-muted-foreground">
          The email address to send the invitation to
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workspaceId">Workspace</Label>
        <Select
          value={formData.workspaceId}
          onValueChange={(value) => setFormData({ ...formData, workspaceId: value })}
          required
        >
          <SelectTrigger id="workspaceId">
            <SelectValue placeholder="Select a workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((workspace) => (
              <SelectItem key={workspace._id} value={workspace._id}>
                {workspace.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Select the workspace to invite the user to
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: any) => setFormData({ ...formData, role: value })}
          required
        >
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OWNER">Owner</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="VIEW_ONLY">View Only</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          The role to assign to the user in this workspace
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiresInDays">Expires In (Days)</Label>
        <Input
          id="expiresInDays"
          type="number"
          min="1"
          max="30"
          value={formData.expiresInDays}
          onChange={(e) => setFormData({ ...formData, expiresInDays: parseInt(e.target.value) || 7 })}
          required
        />
        <p className="text-sm text-muted-foreground">
          Number of days until the invitation expires (1-30)
        </p>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Invite'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

