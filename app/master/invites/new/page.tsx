import { InviteForm } from './invite-form';
import { getWorkspacesByType } from '@/lib/models/workspace';

export default async function NewInvitePage() {
  const [clients, clippers, masters] = await Promise.all([
    getWorkspacesByType('CLIENT', { limit: 100 }),
    getWorkspacesByType('CLIPPER', { limit: 100 }),
    getWorkspacesByType('MASTER', { limit: 100 })
  ]);
  
  const workspaces = [
    ...clients.map((w: any) => ({ 
      _id: typeof w._id === 'string' ? w._id : w._id.toString(), 
      name: `${w.name} (CLIENT)`, 
      type: 'CLIENT' 
    })),
    ...clippers.map((w: any) => ({ 
      _id: typeof w._id === 'string' ? w._id : w._id.toString(), 
      name: `${w.name} (CLIPPER)`, 
      type: 'CLIPPER' 
    })),
    ...masters.map((w: any) => ({ 
      _id: typeof w._id === 'string' ? w._id : w._id.toString(), 
      name: `${w.name} (MASTER)`, 
      type: 'MASTER' 
    }))
  ];

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Create Invite</h1>
        <p className="text-muted-foreground">Invite a user to join a workspace.</p>
      </div>
      <InviteForm workspaces={workspaces} />
    </>
  );
}

