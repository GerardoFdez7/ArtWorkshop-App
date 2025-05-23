"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog"
import { Badge } from "@components/ui/badge"
import { ReservationForm } from "@components/reservation-form"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { mockReservations, mockUsers, mockWorkshops } from "@lib/mock-data"
import type { Reservation, ReservationStatus } from "@lib/types"

export function ReservationsManager() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null)

  const handleAddReservation = () => {
    setCurrentReservation(null)
    setIsFormOpen(true)
  }

  const handleEditReservation = (reservation: Reservation) => {
    setCurrentReservation(reservation)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (reservation: Reservation) => {
    setReservationToDelete(reservation)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (reservationToDelete) {
      setReservations(reservations.filter((r) => r.id !== reservationToDelete.id))
      setIsDeleteDialogOpen(false)
      setReservationToDelete(null)
    }
  }

  const handleFormSubmit = (reservation: Reservation) => {
    if (currentReservation) {
      // Update existing reservation
      setReservations(reservations.map((r) => (r.id === reservation.id ? reservation : r)))
    } else {
      // Add new reservation
      const newReservation = {
        ...reservation,
        id: Math.max(0, ...reservations.map((r) => r.id)) + 1,
      }
      setReservations([...reservations, newReservation])
    }
    setIsFormOpen(false)
  }

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

  const getUserName = (userId: number) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user ? user.fullName : `User ${userId}`
  }

  const getWorkshopTitle = (workshopId: number) => {
    const workshop = mockWorkshops.find((w) => w.id === workshopId)
    return workshop ? workshop.title : `Workshop ${workshopId}`
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Reservations</CardTitle>
            <CardDescription>Manage workshop reservations</CardDescription>
          </div>
          <Button onClick={handleAddReservation}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Reservation
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Workshop</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attended</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.id}</TableCell>
                  <TableCell>{getUserName(reservation.userId)}</TableCell>
                  <TableCell>{getWorkshopTitle(reservation.workshopId)}</TableCell>
                  <TableCell>{new Date(reservation.reservation_date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>{reservation.attended ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditReservation(reservation)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteClick(reservation)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {reservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No reservations found. Add a new reservation to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentReservation ? "Edit Reservation" : "Add New Reservation"}</DialogTitle>
            <DialogDescription>
              {currentReservation
                ? "Update the reservation details below"
                : "Fill in the details to create a new reservation"}
            </DialogDescription>
          </DialogHeader>
          <ReservationForm
            reservation={currentReservation}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
