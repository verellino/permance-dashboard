import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { WorkspaceShell } from "@/components/workspace-shell"
import data from "./data.json"

export default function Page() {
  return (
    <WorkspaceShell
      workspaceType="MASTER"
      title="Master Dashboard"
      description="High-level stats across clients and clippers."
    >
      <div className="flex flex-col gap-6">
        <SectionCards />
        <div className="px-0">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </WorkspaceShell>
  )
}
