import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { ObjectId } from 'mongodb';
import { getPostById, updatePostFrontendFields, softDeletePost } from '@/lib/models/post';

/**
 * POST /api/master/posts/trial/reject
 * Reject a trial reel (mark as failed or soft delete)
 */
export async function POST(request: NextRequest) {
  // Authentication & Authorization
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check for TRIAL_APPROVE permission (we'll add this to RBAC)
  // For now, require CONTENT_MANAGE permission
  if (!hasPermission(membership.role, 'MASTER', 'CONTENT_MANAGE')) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 });
  }

  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    // TODO: For now, return mock success response
    // When ready to connect to MongoDB, uncomment these lines:
    // // Verify post exists and is a trial
    // const post = await getPostById(new ObjectId(postId));
    // if (!post) {
    //   return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    // }
    // if (!post.is_trial) {
    //   return NextResponse.json({ error: 'Post is not a trial reel' }, { status: 400 });
    // }
    //
    // // Option 1: Soft delete the post
    // await softDeletePost(new ObjectId(postId));
    //
    // // Option 2: Mark processing_status as failed (keep the post but mark it rejected)
    // // Note: processing_status is a backend field, so we'd need a separate function for this
    // // For now, soft delete is cleaner

    return NextResponse.json({
      success: true,
      message: 'Trial reel rejected successfully (mock)',
    });
  } catch (error) {
    console.error('Error rejecting trial reel:', error);
    return NextResponse.json(
      { error: 'Failed to reject trial reel' },
      { status: 500 }
    );
  }
}
