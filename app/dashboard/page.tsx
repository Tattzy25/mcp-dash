import { ChartAreaInteractiveServer } from "@/components/chart-area-interactive-server"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"

export const dynamic = "force-dynamic"

export default async function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractiveServer />
      </div>
      <DataTable data={data} />
    </>
  )
}
