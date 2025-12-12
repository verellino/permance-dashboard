import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { ObjectId } from 'mongodb';
import {
  getPostById,
  updatePostFrontendFields,
  softDeletePost,
  PostFrontendSchema,
} from '@/lib/models/post';

/**
 * GET /api/master/posts/[id]
 * Get a single post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication & Authorization
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'CONTENT_MANAGE')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: For now, return mock response
    // When ready to connect to MongoDB, uncomment these lines:
    // const post = await getPostById(new ObjectId(params.id));
    // if (!post) {
    //   return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    // }

    return NextResponse.json({
      success: true,
      message: 'Post retrieved (mock)',
      // data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/master/posts/[id]
 * Update ONLY frontend-managed fields of a post
 * CRITICAL: Backend fields are protected and cannot be updated via this endpoint
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication & Authorization
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'CONTENT_MANAGE')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // CRITICAL: Validate only frontend-writable fields
    const validated = PostFrontendSchema.parse(body);

    // Convert string IDs to ObjectIds
    const updates: any = {};
    if (validated.is_trial !== undefined) updates.is_trial = validated.is_trial;
    if (validated.client) updates.client = new ObjectId(validated.client);
    if (validated.editor) updates.editor = new ObjectId(validated.editor);
    if (validated.type) updates.type = validated.type;
    if (validated.belongs_to) updates.belongs_to = validated.belongs_to;
    if (validated.finance_item_id) updates.finance_item_id = validated.finance_item_id;
    if (validated.assignee) updates.assignee = new ObjectId(validated.assignee);

    // TODO: For now, return mock success response
    // When ready to connect to MongoDB, uncomment these lines:
    // await updatePostFrontendFields(new ObjectId(params.id), updates);
    // const updatedPost = await getPostById(new ObjectId(params.id));

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully (mock)',
      // data: updatedPost,
    });
  } catch (error: any) {
    console.error('Error updating post:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed - only frontend fields can be updated', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/master/posts/[id]
 * Soft delete a post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authentication & Authorization
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'CONTENT_MANAGE')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: For now, return mock success response
    // When ready to connect to MongoDB, uncomment this line:
    // await softDeletePost(new ObjectId(params.id));

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully (mock)',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
