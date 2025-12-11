import assert from 'node:assert';
import { hasRole, hasPermission } from '@/lib/rbac';

describe('rbac helpers', () => {
  it('enforces role hierarchy', () => {
    assert.ok(hasRole('OWNER', 'ADMIN'));
    assert.ok(!hasRole('USER', 'ADMIN'));
  });

  it('maps permissions by workspace type', () => {
    assert.ok(hasPermission('ADMIN', 'MASTER', 'MANAGE_CLIENTS'));
    assert.ok(!hasPermission('VIEW_ONLY', 'CLIENT', 'CONTENT_MANAGE'));
  });
});

