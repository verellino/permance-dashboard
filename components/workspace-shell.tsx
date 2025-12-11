import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import {
  SidebarInset,
  SidebarProvider
} from '@/components/ui/sidebar';

export function WorkspaceShell({
  workspaceType,
  title,
  description,
  children
}: {
  workspaceType: 'MASTER' | 'CLIENT' | 'CLIPPER';
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" workspaceType={workspaceType} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 py-6 px-4 lg:px-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">{title}</h1>
              {description ? (
                <p className="text-muted-foreground">{description}</p>
              ) : null}
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

