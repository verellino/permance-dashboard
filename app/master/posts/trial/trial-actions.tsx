'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { IconCheck, IconX } from '@tabler/icons-react';

interface TrialActionsProps {
  postId: string;
  onSuccess?: () => void;
}

/**
 * Trial Actions Component
 * Provides approve and reject buttons for trial reels
 */
export function TrialActions({ postId, onSuccess }: TrialActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleApprove() {
    setLoading(true);
    try {
      const res = await fetch('/api/master/posts/trial/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to approve');
      }

      toast.success('Trial reel approved and published!');

      // Refresh the page to update the list
      router.refresh();

      // Call success callback if provided
      onSuccess?.();
    } catch (error: any) {
      console.error('Error approving trial reel:', error);
      toast.error(error.message || 'Failed to approve trial reel');
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      const res = await fetch('/api/master/posts/trial/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to reject');
      }

      toast.success('Trial reel rejected');

      // Refresh the page to update the list
      router.refresh();

      // Call success callback if provided
      onSuccess?.();
    } catch (error: any) {
      console.error('Error rejecting trial reel:', error);
      toast.error(error.message || 'Failed to reject trial reel');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={handleApprove}
        disabled={loading}
        className="gap-1"
      >
        <IconCheck className="h-3 w-3" />
        Approve
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleReject}
        disabled={loading}
        className="gap-1"
      >
        <IconX className="h-3 w-3" />
        Reject
      </Button>
    </div>
  );
}
