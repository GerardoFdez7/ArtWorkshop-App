"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { ReservationsManager } from "@components/reservations-manager"
import { ReservationsSummary } from "@components/reservations-summary"

export default function WorkshopManager() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Art Workshop Manager</h1>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="summary">Summary View</TabsTrigger>
          <TabsTrigger value="reservations">Management</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-6">
          <ReservationsSummary />
        </TabsContent>
        <TabsContent value="reservations" className="mt-6">
          <ReservationsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
