import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json"

export default function Page() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Master Dashboard</h1>
        <p className="text-muted-foreground">High-level stats across clients and clippers.</p>
      </div>
      <div className="flex flex-col gap-6">
        <SectionCards />
        <div className="px-0">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </>
  )
}
