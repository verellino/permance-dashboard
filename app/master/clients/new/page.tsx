'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createWorkspaceAction } from '@/app/actions/master';
import { useInvalidateQueries } from '@/lib/react-query-utils';
import { toast } from 'sonner';

export default function NewClientPage() {
  const router = useRouter();
  const { invalidateClients } = useInvalidateQueries();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createWorkspaceAction({
        name: formData.name,
        subdomain: formData.subdomain,
        type: 'CLIENT'
      });

      if (result.success) {
        await invalidateClients();
        toast.success('Client workspace created successfully');
        router.push('/master/clients');
      } else {
        toast.error(result.error || 'Failed to create client');
      }
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(error.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Create Client</h1>
        <p className="text-muted-foreground">Create a new client workspace.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Client Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Acme Corporation"
            required
          />
          <p className="text-sm text-muted-foreground">
            The display name for this client workspace
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subdomain">Subdomain</Label>
          <Input
            id="subdomain"
            value={formData.subdomain}
            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            placeholder="acme-corp"
            required
          />
          <p className="text-sm text-muted-foreground">
            Lowercase alphanumeric with dashes only. This will be used for {formData.subdomain || 'subdomain'}.yourdomain.com
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Client'}
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
    </>
  );
}

