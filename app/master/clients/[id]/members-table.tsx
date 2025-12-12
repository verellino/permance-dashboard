'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { WorkspaceMembershipDocument } from '@/lib/models/workspace-membership';
import { useState } from 'react';
import { toast } from 'sonner';

type MemberWithUser = WorkspaceMembershipDocument & {
  user: {
    name: string | null;
    email: string;
    emailVerified: Date | null;
  } | null;
};

interface MembersTableProps {
  workspaceId: string;
  initialMembers: MemberWithUser[];
}

export function MembersTable({ workspaceId, initialMembers }: MembersTableProps) {
  const [members, setMembers] = useState(initialMembers);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      const response = await fetch(`/api/master/clients/${workspaceId}/members/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      setMembers((prev) =>
        prev.map((m) =>
          m.userId.toString() === userId ? { ...m, role: newRole as any } : m
        )
      );

      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/master/clients/${workspaceId}/members/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      setMembers((prev) => prev.filter((m) => m.userId.toString() !== userId));
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No members found. Add members to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member._id.toString()}>
              <TableCell>
                {member.user?.name || <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>{member.user?.email || '—'}</TableCell>
              <TableCell>
                {member.user?.emailVerified ? (
                  <Badge variant="default">Verified</Badge>
                ) : (
                  <Badge variant="secondary">Unverified</Badge>
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={member.role}
                  onValueChange={(value) => handleRoleChange(member.userId.toString(), value)}
                  disabled={updating === member.userId.toString()}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">OWNER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="VIEW_ONLY">VIEW_ONLY</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {member.joinedAt
                  ? new Date(member.joinedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.userId.toString())}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

