# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Technology Stack

You are an expert developer proficient in TypeScript, React, Next.js 15, MongoDB, NextAuth v5, Tailwind CSS 4, shadcn/ui, Zod, and building multi-tenant SaaS applications.

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with native driver
- **Authentication**: NextAuth v5 (beta) with JWT sessions
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: React Server Components, Server Actions
- **Validation**: Zod schemas
- **Caching**: Upstash Redis (currently used for tenant data)
- **Email**: Nodemailer
- **Package Manager**: pnpm
- **Deployment**: Designed for Vercel

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (with Turbopack)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Access the application:
- Main site: http://localhost:3000
- Tenants: http://[subdomain].localhost:3000

## Multi-Tenant Architecture

This is a **subdomain-based multi-tenant application** where each tenant (workspace) has its own subdomain:

- **Root domain** (`localhost:3000` or `yourdomain.com`): Hosts login and MASTER workspace dashboards
- **Subdomains** (`client.localhost:3000` or `client.yourdomain.com`): Host CLIENT and CLIPPER workspace dashboards

### Workspace Types

Three distinct workspace types with different permission models:

1. **MASTER**: The main administrative workspace (root domain only)
   - Manages all clients and clippers
   - Global analytics and content intelligence
   - Billing, API keys, audit logs
   - Operations monitoring

2. **CLIENT**: Customer-facing workspaces (subdomain-based)
   - Content library and management
   - Task tracking and ideas
   - Team collaboration
   - Client-specific analytics

3. **CLIPPER**: Video editor workspaces (subdomain-based)
   - Task assignments
   - Upload management
   - Content queue and library
   - Client briefs

### How Subdomain Routing Works

The **middleware.ts** file handles subdomain detection and routing:

1. Extracts subdomain from request hostname
2. Validates user authentication via NextAuth JWT token
3. Checks workspace membership and permissions
4. Rewrites subdomain root `/` to `/s/[subdomain]` internally
5. Enforces role-based access control (RBAC)

Key patterns:
- `/master/*` routes → MASTER workspace (root domain only)
- `/client/*` routes → CLIENT workspace (subdomain)
- `/clipper/*` routes → CLIPPER workspace (subdomain)

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Structure files: exported components, subcomponents, helpers, static content, types
- Favor named exports for components and functions
- Use lowercase with dashes for directory names (e.g., `components/auth-wizard`)

## TypeScript and Zod Usage

- Use TypeScript for all code; prefer interfaces over types for object shapes
- Utilize Zod for schema validation and type inference
- Avoid enums; use literal types or const objects instead
- Implement functional components with TypeScript interfaces for props
- All MongoDB documents have typed interfaces in `lib/models/`

## File Structure Conventions

```
app/
  (auth)/              # Auth pages (login, signup, reset-password)
  master/              # MASTER workspace pages
  client/              # CLIENT workspace pages
  clipper/             # CLIPPER workspace pages
  s/[subdomain]/       # Subdomain handler (internal rewrite target)
  api/                 # API routes
    auth/              # NextAuth routes
    master/            # MASTER-only API endpoints
    client/            # CLIENT API endpoints
    clipper/           # CLIPPER API endpoints
  actions.ts           # Server actions
  layout.tsx           # Root layout

components/
  ui/                  # shadcn/ui components
  auth/                # Auth-specific components
  [feature]-*.tsx      # Feature components

lib/
  models/              # MongoDB document models and queries
  auth/                # Authentication utilities
  cache/               # Caching utilities
  middleware/          # API middleware
  rbac.ts              # Role-based access control
  workspaces.ts        # Workspace utilities
  mongodb.ts           # MongoDB connection singleton
  utils.ts             # Shared utilities
```

## MongoDB Patterns

### Connection Management

- Use `getDb()` from `lib/mongodb.ts` for all database operations
- Connection is a singleton with connection pooling (maxPoolSize: 10)
- Indexes are automatically created on first connection via `ensureIndexes()`

### Document Models

All MongoDB collections have model files in `lib/models/`:

- `user.ts` - User documents and authentication
- `workspace.ts` - Workspace (tenant) documents
- `workspace-membership.ts` - User-to-workspace relationships
- `invite.ts` - Workspace invitation system
- `audit-log.ts` - Audit trail for actions

Pattern for model files:
```typescript
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export type DocumentName = {
  _id: ObjectId;
  // ... fields
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = 'collection_name';

export async function getDocument(id: ObjectId) {
  const db = await getDb();
  return db.collection<DocumentName>(COLLECTION).findOne({ _id: id });
}
```

### Key Indexes

- `workspaces.subdomain` - Unique index for subdomain lookup
- `workspace_memberships.[userId, workspaceId]` - Unique compound index
- TTL indexes on `sessions`, `verification_tokens`, `invites`

## Authentication and Authorization

### NextAuth v5 Configuration

Located in `lib/auth/config.ts`:

- **Adapter**: MongoDB adapter
- **Session**: JWT strategy (30-day expiration)
- **Providers**: Google OAuth, Email/Password (Credentials)
- **Callbacks**: JWT includes workspace memberships for routing
- **Events**: Audit logging on sign-in

### RBAC System

Defined in `lib/rbac.ts`:

**Role Hierarchy**:
- OWNER (level 3)
- ADMIN (level 2)
- USER (level 1)
- VIEW_ONLY (level 0)

**Permissions by Workspace Type**:
- Each workspace type has different permission sets per role
- MASTER workspace has broadest permissions (GLOBAL_SETTINGS, MANAGE_CLIENTS, etc.)
- CLIENT workspace has content and team management permissions
- CLIPPER workspace has limited task and upload permissions

**Usage**:
```typescript
import { hasRole, hasPermission } from '@/lib/rbac';

// Check role hierarchy
if (hasRole(currentRole, 'ADMIN')) { /* ... */ }

// Check specific permission
if (hasPermission(role, workspaceType, 'CONTENT_MANAGE')) { /* ... */ }
```

### Middleware Protection

In `middleware.ts`, routes are protected by:
1. Session validation (JWT token check)
2. Workspace membership verification
3. Role requirements (e.g., MASTER requires ADMIN role)

Protected route patterns:
- `/master/*` and `/api/master/*` - Requires MASTER membership with ADMIN role
- `/client/*` and `/api/client/*` - Requires CLIENT membership
- `/clipper/*` and `/api/clipper/*` - Requires CLIPPER membership

## UI and Styling

- Use **shadcn/ui** components from `components/ui/`
- Follow Tailwind CSS 4 conventions
- Implement responsive design with mobile-first approach
- Use Radix UI primitives for accessible components
- Icons: Tabler Icons (`@tabler/icons-react`) and Lucide React

### shadcn/ui Component Usage

Components are installed via `components.json` configuration:
- Button, Input, Label, Select - Form controls
- Dialog, Sheet, Drawer - Overlays
- Table, DataTable - Data display
- Tabs, Separator, Card - Layout
- Toast (Sonner) - Notifications

## Server Components and Actions

### Default to Server Components

- All components in `app/` are Server Components by default
- Use `'use client'` directive only when necessary (interactivity, hooks, browser APIs)
- Fetch data directly in Server Components; no need for useEffect

### Server Actions Pattern

Define in `app/actions.ts` or feature-specific action files:

```typescript
'use server';

import { auth } from '@/lib/auth/config';
import { getDb } from '@/lib/mongodb';

export async function performAction(data: ActionInput) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // Validate with Zod
  const validated = actionSchema.parse(data);

  // Perform database operation
  const db = await getDb();
  // ...

  return result;
}
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=permance_dashboard

# NextAuth
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASSWORD=password
SMTP_FROM="Permance Dashboard <no-reply@example.com>"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

## Error Handling and Validation

- Prioritize error handling and edge cases
- Handle errors at the beginning of functions
- Use early returns for error conditions to avoid deep nesting
- Utilize guard clauses for preconditions and invalid states
- Implement proper error logging and user-friendly messages
- Use Zod for runtime validation of user input and API responses
- Use `toast` from Sonner for user-facing error messages

## Performance Optimization

- Leverage React Server Components for zero-bundle pages
- Use dynamic imports for code splitting when needed
- Implement Redis caching for frequently accessed data (see `lib/cache/`)
- Optimize images: use Next.js `<Image>` component
- Use MongoDB projection to fetch only needed fields

## Data Tables Pattern

For admin interfaces, use the DataTable pattern with TanStack Table:

Example in `app/master/content/`:
- `data.ts` - Data fetching logic
- `columns.tsx` - Column definitions
- `content-table.tsx` - Table component
- `page.tsx` - Page that combines everything

## Navigation and Layouts

### Workspace-Specific Layouts

Each workspace type has its own layout:
- `app/master/layout.tsx` - MASTER workspace shell
- `app/client/layout.tsx` - CLIENT workspace shell
- `app/clipper/layout.tsx` - CLIPPER workspace shell

These use `WorkspaceShell` component with `AppSidebar` for navigation.

### Homepage Redirection Logic

`app/page.tsx` implements smart redirection based on user memberships:
1. If MASTER member → `/master/dashboard`
2. Else if CLIENT member → Redirect to client subdomain `/client/dashboard`
3. Else if CLIPPER member → Redirect to clipper subdomain `/clipper/dashboard`
4. Otherwise → `/no-access`

## Business Domain (Permance Dashboard)

This is a **content management and analytics platform** for social media content creators and video editors.

### Phase 2 Data Model (Planned Implementation)

The platform will track social media posts and creator accounts with a clear separation between **backend-managed fields** (scraped data, AI analysis, metrics) and **frontend-managed fields** (business logic, assignments, finance).

#### Posts Collection

**Purpose**: Track both trial content and published social media posts

**Backend-Managed Fields** (scraped/AI-generated):
- `url` (string, unique) - Post URL
- `post_id`, `username`, `platform` (Instagram/TikTok/YouTube)
- Metrics: `views`, `likes`, `comments`, `shares`, `engagement_rate`
- `post_date`, `last_updated`
- Auto-detected: `base_format` (Video/Reels, Single Photo, Carousel)
- Auto-detected: `content_type` (Video Short 9:16, Video Long 16:9, Photo, Carousel)
- AI-generated: `idea_concept`, `category`, `subcategory` (multi-label), `reel_style`
- `processing_status` (pending, processing, completed, failed)

**Frontend-Managed Fields** (business/workflow):
- `is_trial` (boolean) - Distinguishes trial content from published posts
- `client` (string) - CLIENT workspace this post belongs to
- `editor` (string) - CLIPPER workspace that created this
- `type` (string) - "Main Account" vs "Clip / Side Account"
- `belongs_to` (array) - Board categorization: ["Finance", "Clipping", etc.]
- `finance_item_id` (string) - Groups posts under same finance entry
- `assignee`, `added_by`, `added_date` - Workflow tracking

**Trial Reels Workflow**:
1. Clipper adds trial reel → Set `is_trial = true` + assignment fields
2. Query trial reels: `GET /posts?is_trial=true&client={id}`
3. Client approves → Update `is_trial = false` (now treated as published post)
4. Client rejects → Mark `processing_status = failed` or delete

#### Users/Creators Collection

**Purpose**: Track social media accounts (creators) and their performance

**Backend-Managed Fields** (scraped/aggregated):
- `url` (string, unique), `username`, `platform`
- Profile: `full_name`, `biography`, `profile_pic_url`, `is_verified`, `is_private`
- Follower metrics: `followers`, `following`
- Content counts: `total_media_count`, `video_count`, `photo_count`, `carousel_count`
- Aggregated stats: `total_views`, `total_likes`, `total_comments`, `total_shares`
- Averages: `avg_views`, `avg_engagement_rate`
- Time-based views: `views_last_7d`, `views_last_30d`, `views_last_90d`, etc.
- Growth tracking: `followers_since_1st_of_month`, `followers_since_monday`, `followers_since_start_of_growth`
- Tracking: `tracking_enabled`, `disabled_reason`, `last_tracked_at`, `last_stats_update`
- Payment metrics (backend calculated): `this_month_posting_volume`, `last_month_posting_volume`, `this_month_views_generated`, `last_month_views_generated`, `kpi_status`

**Frontend-Managed Fields** (business/finance):
- Payment: `base_monthly_pay`, `amount_due_eom`, `expected_monthly_posting_volume`
- Assignment: `client`, `editor`, `type`, `belongs_to`
- Finance: `finance_item_id`, `started_date`, `last_paid_date`, `paid_amount`
- Contact: `phone_number`, `payment_method`

### Planned Module Structure

When implementing Phase 2, organize into these functional areas:

1. **Posts Module** (`app/master/posts/`, `app/client/content/`)
   - Trial reels dashboard
   - Published posts table
   - Post detail pages with performance history
   - Filtering by platform, category, subcategory, reel_style, processing_status

2. **Creators Module** (`app/master/users/`, `app/client/creators/`)
   - Creator list with performance metrics
   - Creator detail page (profile, stats, recent posts)
   - Creator finance dashboard (posting volume, payment status)
   - Growth history charts (time-series from snapshots)

3. **Operations Module** (`app/master/operations/`)
   - AI processing monitor (posts by `processing_status`)
   - New post detector activity feed
   - Job status dashboard
   - Error monitoring (failed URLs, disabled accounts)

4. **Finance Module** (`app/master/finance/`)
   - Finance items (grouped by `finance_item_id`)
   - Creator payment tracking
   - Post monetization breakdown

5. **Settings Module** (`app/master/settings/`)
   - Clients, Editors (workspace management)
   - Boards mapping (Finance board, Clipping board, etc.)
   - API keys

### Field Responsibility Pattern

**CRITICAL**: Maintain clear separation of concerns:

- **Backend** (external jobs/services): Updates all performance metrics, AI analysis, scraping data
- **Frontend** (this Next.js app): Manages only business logic fields (assignments, finance, boards)
- **Never duplicate**: Frontend should never try to calculate metrics that backend provides
- **Always validate**: Use Zod to enforce which fields frontend can modify via API

Example model structure:
```typescript
// lib/models/post.ts
export type PostDocument = {
  _id: ObjectId;

  // Backend-managed (read-only for frontend)
  url: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube';
  views: number;
  likes: number;
  engagement_rate: number;
  idea_concept?: string;
  category?: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';

  // Frontend-managed (writable via API)
  is_trial: boolean;
  client?: string;
  editor?: string;
  belongs_to?: string[];
  finance_item_id?: string;

  createdAt: Date;
  updatedAt: Date;
};
```

See `docs/PHASE_2_BACKEND.md` for complete field specifications.

### Current Implementation Status

**Phase 1** (Current): Multi-tenant infrastructure
- ✅ Workspace management (MASTER, CLIENT, CLIPPER)
- ✅ Authentication and RBAC
- ✅ Invitation system
- ✅ Admin interfaces and navigation

**Phase 2** (Planned): Content tracking and analytics
- ⏳ Posts collection and trial reels workflow
- ⏳ Users/Creators collection and tracking
- ⏳ AI processing integration
- ⏳ Finance and payment tracking
- ⏳ Operations monitoring

## Key Conventions

- Use descriptive and meaningful commit messages
- Ensure code is clean, well-documented, and follows TypeScript strict mode
- Import paths use `@/` alias for root directory
- Use ObjectId from MongoDB for all document IDs
- Soft deletes: Use `deletedAt` field instead of hard deletion
- Audit logging: Log important actions via `logAuditEvent()`
- Field separation: Backend fields (metrics/AI) vs Frontend fields (business logic)

## Common Patterns

### Creating a New Workspace Page

1. Add page in appropriate workspace directory (`app/[workspace-type]/[feature]/page.tsx`)
2. Update sidebar navigation in `components/app-sidebar.tsx`
3. Ensure proper RBAC checks if needed
4. Use Server Components for data fetching

### Adding a New MongoDB Collection

1. Create model file in `lib/models/[collection-name].ts`
2. Define TypeScript interface for document shape
3. Add index creation in `lib/mongodb.ts` `ensureIndexes()` function
4. Export query functions (get, create, update, delete)
5. If Phase 2: Clearly mark backend-managed vs frontend-managed fields

### Creating Protected API Routes

```typescript
// app/api/[workspace]/[feature]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { hasPermission } from '@/lib/rbac';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check workspace membership and permissions
  const memberships = (session as any).memberships || [];
  const membership = memberships.find(m => m.workspaceType === 'MASTER');

  if (!membership || !hasPermission(membership.role, 'MASTER', 'API_FULL')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Validate input (only allow frontend-managed fields)
  const body = await request.json();
  const validated = frontendFieldsSchema.parse(body);

  // Process request
  // ...

  return NextResponse.json({ success: true });
}
```

### Building Data Tables for Phase 2

When implementing Posts or Users tables:

```typescript
// app/master/posts/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import type { PostDocument } from '@/lib/models/post';

export const columns: ColumnDef<PostDocument>[] = [
  {
    accessorKey: 'platform',
    header: 'Platform'
  },
  {
    accessorKey: 'views',
    header: 'Views',
    cell: ({ row }) => row.original.views.toLocaleString()
  },
  {
    accessorKey: 'engagement_rate',
    header: 'Engagement',
    cell: ({ row }) => `${row.original.engagement_rate.toFixed(2)}%`
  },
  {
    accessorKey: 'category',
    header: 'Category',
    // Backend AI-generated field
  },
  {
    accessorKey: 'is_trial',
    header: 'Type',
    cell: ({ row }) => row.original.is_trial ? 'Trial' : 'Published'
  },
  {
    accessorKey: 'processing_status',
    header: 'AI Status'
  }
];
```

## Testing

- Unit tests in `__tests__/` directory
- Use testing libraries compatible with Next.js and React
- Test critical business logic, RBAC, and data models
- Test field validation (ensure backend fields cannot be modified via frontend API)

## Follow Official Documentation

- Next.js 15 App Router conventions
- NextAuth v5 (beta) authentication patterns
- MongoDB Node.js driver best practices
- Tailwind CSS 4 and shadcn/ui component usage
- Zod validation schemas
- TanStack Table for data tables
