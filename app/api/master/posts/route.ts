import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';
import { ObjectId } from 'mongodb';
import {
  getPosts,
  getPostsCount,
  createPost,
  PostCreateSchema,
} from '@/lib/models/post';

/**
 * GET /api/master/posts
 * Get posts with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  // Authentication & Authorization
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'CONTENT_MANAGE')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url);

  const filter = {
    is_trial:
      searchParams.get('is_trial') === 'true'
        ? true
        : searchParams.get('is_trial') === 'false'
        ? false
        : undefined,
    client: searchParams.get('client')
      ? new ObjectId(searchParams.get('client')!)
      : undefined,
    editor: searchParams.get('editor')
      ? new ObjectId(searchParams.get('editor')!)
      : undefined,
    platform: searchParams.get('platform') as any,
    category: searchParams.get('category') ?? undefined,
    processing_status: searchParams.get('processing_status') as any,
    belongs_to: searchParams.get('belongs_to') ?? undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    skip: searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : 0,
    sortBy: searchParams.get('sortBy') ?? undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc',
  };

  try {
    // TODO: For now, this will return empty array until mock data is loaded
    // When ready to connect to MongoDB, uncomment these lines:
    // const [posts, total] = await Promise.all([
    //   getPosts(filter),
    //   getPostsCount(filter),
    // ]);

    // Temporary mock response structure
    const posts: any[] = [];
    const total = 0;

    return NextResponse.json({
      data: posts,
      total,
      limit: filter.limit,
      skip: filter.skip,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/master/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
  // Authentication & Authorization
  const session = await auth();
  const memberships = (session as any)?.memberships || [];
  const membership = memberships.find((m: any) => m.workspaceType === 'MASTER');

  if (!session || !membership || !hasPermission(membership.role, 'MASTER', 'CONTENT_MANAGE')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate with Zod
    const validated = PostCreateSchema.parse(body);

    // Convert string IDs to ObjectIds
    const postData: any = {
      ...validated,
      client: validated.client ? new ObjectId(validated.client) : undefined,
      editor: validated.editor ? new ObjectId(validated.editor) : undefined,
      assignee: validated.assignee ? new ObjectId(validated.assignee) : undefined,
      added_by: session.user?.id ? new ObjectId(session.user.id) : undefined,
    };

    // TODO: For now, return mock success response
    // When ready to connect to MongoDB, uncomment this line:
    // const post = await createPost(postData);

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully (mock)',
        // data: post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating post:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
