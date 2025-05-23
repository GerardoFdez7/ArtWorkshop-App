"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table"
import { Badge } from "@components/ui/badge"
import { Input } from "@components/ui/input"
import { useState } from "react"
import { Search } from "lucide-react"
import { mockSummaryView } from "@lib/mock-data"
import type { ReservationStatus } from "@lib/types"

export function ReservationsSummary() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSummary = mockSummaryView.filter(
    (item) =>
      item.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.workshopTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instructorFullName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Confirmed
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservations Summary</CardTitle>
        <CardDescription>View detailed information about workshop reservations</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, workshop or instructor..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Workshop</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attended</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Instructor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSummary.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.userFullName}</TableCell>
                  <TableCell>{item.userEmail}</TableCell>
                  <TableCell>{item.workshopTitle}</TableCell>
                  <TableCell>{new Date(item.reservation_date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.attended ? "Yes" : "No"}</TableCell>
                  <TableCell>{item.duration_minutes} min</TableCell>
                  <TableCell>{item.instructorFullName}</TableCell>
                </TableRow>
              ))}
              {filteredSummary.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No results found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
