'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { PostDocument } from '@/lib/models/post';

interface PostEditDialogProps {
  post: PostDocument;
  trigger?: React.ReactNode;
}

/**
 * Post Edit Dialog
 * Allows editing ONLY frontend-managed fields
 * Backend fields (views, likes, AI data) are read-only
 */
export function PostEditDialog({ post, trigger }: PostEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form state for frontend-managed fields
  const [type, setType] = useState(post.type || '');
  const [financeItemId, setFinanceItemId] = useState(post.finance_item_id || '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/master/posts/${post._id.toString()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type || undefined,
          finance_item_id: financeItemId || undefined,
          // Add other fields as needed
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update post');
      }

      toast.success('Post updated successfully');
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit Fields</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Post Fields</DialogTitle>
            <DialogDescription>
              Update frontend-managed fields. Backend fields (views, likes, AI data) cannot be edited.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Type Field */}
            <div className="grid gap-2">
              <Label htmlFor="type">Account Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Account">Main Account</SelectItem>
                  <SelectItem value="Clip / Side Account">Clip / Side Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Finance Item ID Field */}
            <div className="grid gap-2">
              <Label htmlFor="financeItemId">Finance Item ID</Label>
              <Input
                id="financeItemId"
                value={financeItemId}
                onChange={(e) => setFinanceItemId(e.target.value)}
                placeholder="FIN-2024-001"
              />
              <p className="text-xs text-muted-foreground">
                Groups this post under a finance item for payment tracking
              </p>
            </div>

            {/* Note about other fields */}
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> Additional fields like Client, Editor, Belongs To, and
                Assignee can be added to this form. For now, this demonstrates the edit pattern.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
