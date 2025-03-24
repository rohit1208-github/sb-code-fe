'use client'

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { CountriesTable } from "@/components/countries/countries-table"
import { CountryDialog } from "@/components/countries/add-country-dialog"

export default function CountriesPage() {
  return (
    <div className="mt-8 p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="heading-enhanced bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            COUNTRIES
          </CardTitle>
          <CountryDialog mode="add" />
        </CardHeader>
        <CountriesTable />
      </Card>
    </div>
  )
} 