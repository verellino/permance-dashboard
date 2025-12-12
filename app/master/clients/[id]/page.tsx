import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getWorkspaceById } from '@/lib/models/workspace';
import { getMembershipsForWorkspace } from '@/lib/models/workspace-membership';
import { getUserById } from '@/lib/models/user';
import { MembersTable } from './members-table';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import {
  IconUsers,
  IconUserPlus,
  IconEdit,
  IconTrash,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

/**
 * Client Detail Page
 * Shows comprehensive client workspace information with members and management options
 */
export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  let workspaceId: ObjectId;
  try {
    workspaceId = new ObjectId(params.id);
  } catch {
    notFound();
  }

  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace || workspace.type !== 'CLIENT') {
    notFound();
  }

  const memberships = await getMembershipsForWorkspace(workspaceId);
  
  // Enrich memberships with user data
  const membersWithUsers = await Promise.all(
    memberships.map(async (m) => {
      const user = await getUserById(m.userId);
      return {
        ...m,
        user: user ? {
          name: user.name ?? null,
          email: user.email,
          emailVerified: user.emailVerified ?? null
        } : null
      };
    })
  );

  const statusVariant = workspace.deletedAt ? 'destructive' : 'default';

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{workspace.name}</h1>
        <p className="text-muted-foreground">Client workspace details and member management</p>
      </div>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              <h2 className="text-2xl font-bold">{workspace.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {workspace.subdomain}
              </code>
              <Badge variant={statusVariant}>
                {workspace.deletedAt ? 'Deleted' : 'Active'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Workspace
            </Button>
            {!workspace.deletedAt && (
              <Button variant="destructive" size="sm">
                <IconTrash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{membersWithUsers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <IconCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <Badge variant={statusVariant}>
                  {workspace.deletedAt ? 'Deleted' : 'Active'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {workspace.createdAt
                  ? new Date(workspace.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Workspace Information */}
          <Card>
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>Client workspace details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">{workspace.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Subdomain</p>
                <p className="text-base">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {workspace.subdomain}
                  </code>
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <Badge variant="outline" className="mt-1">
                  {workspace.type}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-base">
                  {workspace.createdAt
                    ? new Date(workspace.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </p>
              </div>

              {workspace.updatedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-base">
                    {new Date(workspace.updatedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}

              {workspace.deletedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deleted</p>
                  <p className="text-base">
                    {new Date(workspace.deletedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Workspace configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workspace.settings && Object.keys(workspace.settings).length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Custom Settings</p>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(workspace.settings, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No custom settings configured</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Members Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Members</CardTitle>
                <CardDescription>Manage workspace members and their roles</CardDescription>
              </div>
              <Button size="sm">
                <IconUserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MembersTable
              workspaceId={workspace._id.toString()}
              initialMembers={membersWithUsers || []}
            />
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-start">
          <Link href="/master/clients">
            <Button variant="ghost">← Back to Clients</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

