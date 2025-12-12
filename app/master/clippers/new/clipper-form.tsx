'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/workspace-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createWorkspaceAction } from '@/app/actions/master';
import { toast } from 'sonner';

interface ClipperFormProps {
  clients: Array<{ _id: string; name: string }>;
}

export function ClipperForm({ clients }: ClipperFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    parentWorkspaceId: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createWorkspaceAction({
        name: formData.name,
        subdomain: formData.subdomain,
        type: 'CLIPPER',
        parentWorkspaceId: formData.parentWorkspaceId || undefined
      });

      if (result.success) {
        toast.success('Clipper workspace created successfully');
        router.push('/master/clippers');
      } else {
        toast.error(result.error || 'Failed to create clipper');
      }
    } catch (error: any) {
      console.error('Error creating clipper:', error);
      toast.error(error.message || 'Failed to create clipper');
    } finally {
      setLoading(false);
    }
  }

  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Create Clipper"
      description="Create a new clipper workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Clipper Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />
          <p className="text-sm text-muted-foreground">
            The display name for this clipper workspace
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subdomain">Subdomain</Label>
          <Input
            id="subdomain"
            value={formData.subdomain}
            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            placeholder="john-doe"
            required
          />
          <p className="text-sm text-muted-foreground">
            Lowercase alphanumeric with dashes only. This will be used for {formData.subdomain || 'subdomain'}.yourdomain.com
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentWorkspaceId">Assign to Client (Optional)</Label>
          <Select
            value={formData.parentWorkspaceId}
            onValueChange={(value) => setFormData({ ...formData, parentWorkspaceId: value })}
          >
            <SelectTrigger id="parentWorkspaceId">
              <SelectValue placeholder="Select a client (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client._id} value={client._id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Optionally assign this clipper to a client workspace
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Clipper'}
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
    </WorkspaceShell>
  );
}

