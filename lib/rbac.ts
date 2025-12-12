import type { WorkspaceType } from '@/lib/models/workspace';
import type { UserRole } from '@/lib/models/user';

const hierarchy: Record<UserRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  USER: 1,
  VIEW_ONLY: 0
};

export type Permission =
  | 'GLOBAL_SETTINGS'
  | 'MANAGE_USERS'
  | 'MANAGE_CLIENTS'
  | 'MANAGE_CLIPPERS'
  | 'BILLING'
  | 'ANALYTICS_GLOBAL'
  | 'ANALYTICS_CLIENT'
  | 'CONTENT_MANAGE'
  | 'CONTENT_APPROVE'
  | 'TASK_MANAGE'
  | 'INVITE_USERS'
  | 'WORKSPACE_SETTINGS'
  | 'API_FULL'
  | 'API_LIMITED'
  | 'API_UPLOADS'
  | 'VIEW_TENANTS'
  | 'VIEW_CLIPPERS'
  | 'ADMIN_TOOLS'
  | 'POSTS_MANAGE'
  | 'CREATORS_MANAGE'
  | 'TRIAL_APPROVE'
  | 'OPERATIONS_VIEW'
  | 'FINANCE_VIEW';

const permissionsByType: Record<WorkspaceType, Record<UserRole, Permission[]>> = {
  MASTER: {
    OWNER: [
      'GLOBAL_SETTINGS',
      'MANAGE_USERS',
      'MANAGE_CLIENTS',
      'MANAGE_CLIPPERS',
      'BILLING',
      'ANALYTICS_GLOBAL',
      'ANALYTICS_CLIENT',
      'CONTENT_MANAGE',
      'CONTENT_APPROVE',
      'TASK_MANAGE',
      'INVITE_USERS',
      'WORKSPACE_SETTINGS',
      'API_FULL',
      'VIEW_TENANTS',
      'VIEW_CLIPPERS',
      'ADMIN_TOOLS',
      'POSTS_MANAGE',
      'CREATORS_MANAGE',
      'TRIAL_APPROVE',
      'OPERATIONS_VIEW',
      'FINANCE_VIEW'
    ],
    ADMIN: [
      'MANAGE_USERS',
      'MANAGE_CLIENTS',
      'MANAGE_CLIPPERS',
      'BILLING',
      'ANALYTICS_GLOBAL',
      'ANALYTICS_CLIENT',
      'CONTENT_MANAGE',
      'CONTENT_APPROVE',
      'TASK_MANAGE',
      'INVITE_USERS',
      'WORKSPACE_SETTINGS',
      'API_FULL',
      'VIEW_TENANTS',
      'VIEW_CLIPPERS',
      'ADMIN_TOOLS',
      'POSTS_MANAGE',
      'CREATORS_MANAGE',
      'TRIAL_APPROVE',
      'OPERATIONS_VIEW',
      'FINANCE_VIEW'
    ],
    USER: [
      'ANALYTICS_GLOBAL',
      'ANALYTICS_CLIENT',
      'CONTENT_MANAGE',
      'TASK_MANAGE',
      'API_LIMITED',
      'POSTS_MANAGE',
      'CREATORS_MANAGE'
    ],
    VIEW_ONLY: [
      'ANALYTICS_GLOBAL',
      'ANALYTICS_CLIENT',
      'OPERATIONS_VIEW'
    ]
  },
  CLIENT: {
    OWNER: [
      'ANALYTICS_CLIENT',
      'CONTENT_MANAGE',
      'CONTENT_APPROVE',
      'TASK_MANAGE',
      'INVITE_USERS',
      'WORKSPACE_SETTINGS',
      'API_LIMITED',
      'POSTS_MANAGE',
      'TRIAL_APPROVE'
    ],
    ADMIN: [
      'ANALYTICS_CLIENT',
      'CONTENT_MANAGE',
      'CONTENT_APPROVE',
      'TASK_MANAGE',
      'INVITE_USERS',
      'WORKSPACE_SETTINGS',
      'API_LIMITED',
      'POSTS_MANAGE',
      'TRIAL_APPROVE'
    ],
    USER: ['CONTENT_MANAGE', 'TASK_MANAGE', 'API_LIMITED'],
    VIEW_ONLY: ['ANALYTICS_CLIENT']
  },
  CLIPPER: {
    OWNER: [],
    ADMIN: [],
    USER: ['TASK_MANAGE', 'API_UPLOADS', 'CONTENT_MANAGE', 'POSTS_MANAGE'],
    VIEW_ONLY: []
  }
};

export function hasRole(current: UserRole, required: UserRole) {
  return hierarchy[current] >= hierarchy[required];
}

export function hasPermission(
  role: UserRole,
  workspaceType: WorkspaceType,
  permission: Permission
) {
  return permissionsByType[workspaceType]?.[role]?.includes(permission) ?? false;
}

