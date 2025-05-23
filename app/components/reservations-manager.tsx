"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Badge } from "@components/ui/badge";
import { ReservationForm } from "@components/reservation-form";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import type {
  Reservation,
  ReservationStatus,
  ReservationData,
} from "@lib/types";
import { useReservations } from "@hooks/useReservations";
import { useDeleteReservation } from "@hooks/useDeleteReservation";

export function ReservationsManager() {
  const {
    reservations: apiReservations,
    isLoading,
    error,
    refreshData,
  } = useReservations();
  const [localReservations, setLocalReservations] = useState<ReservationData[]>(
    []
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] =
    useState<ReservationData | null>(null);

  // Update local state when API data changes
  useEffect(() => {
    if (apiReservations) {
      setLocalReservations(apiReservations);
    }
  }, [apiReservations]);

  const handleAddReservation = () => {
    setCurrentReservation(null);
    setIsFormOpen(true);
  };

  // Convert ReservationData to Reservation for the form
  const handleEditReservation = (reservation: ReservationData) => {
    // Create a Reservation object from ReservationData
    const reservationForForm: Reservation = {
      id: reservation.reservation_id,
      userId: 0, // We don't have this info in ReservationData
      workshopId: 0, // We don't have this info in ReservationData
      reservation_date: reservation.date,
      status: reservation.status,
      attended: reservation.attended,
    };
    setCurrentReservation(reservationForForm);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (reservation: ReservationData) => {
    setReservationToDelete(reservation);
    setIsDeleteDialogOpen(true);
  };
  const { deleteReservation } = useDeleteReservation();

  const confirmDelete = async () => {
    if (reservationToDelete) {
      await deleteReservation(reservationToDelete.reservation_id, () => {
        refreshData();
        setIsDeleteDialogOpen(false);
        setReservationToDelete(null);
      });
    }
  };

  const handleFormSubmit = (reservation: Reservation) => {
    // In a real app, you would call an API to update or create the reservation
    if (currentReservation) {
      // Update existing reservation
      setLocalReservations(
        localReservations.map((r) => {
          if (r.reservation_id === reservation.id) {
            // Convert Reservation to ReservationData
            return {
              ...r,
              status: reservation.status,
              attended: reservation.attended,
              date: reservation.reservation_date,
            };
          }
          return r;
        })
      );
    } else {
      // Add new reservation - this is simplified and would need more data in a real app
      const newReservation: ReservationData = {
        reservation_id:
          Math.max(0, ...localReservations.map((r) => r.reservation_id)) + 1,
        user: "New User", // Placeholder
        email: "user@example.com", // Placeholder
        workshop: "New Workshop", // Placeholder
        date: reservation.reservation_date,
        status: reservation.status,
        attended: reservation.attended,
        duration: 60,
        instructor: "Instructor",
      };
      setLocalReservations([...localReservations, newReservation]);
    }
    setIsFormOpen(false);
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Confirmed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>Manage workshop reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6">Loading reservations...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>Manage workshop reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
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
              {localReservations.map((reservation) => (
                <TableRow key={reservation.reservation_id}>
                  <TableCell>{reservation.reservation_id}</TableCell>
                  <TableCell>{reservation.user}</TableCell>
                  <TableCell>{reservation.workshop}</TableCell>
                  <TableCell>
                    {new Date(reservation.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>{reservation.attended ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(reservation)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {localReservations.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-muted-foreground"
                  >
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
            <DialogTitle>
              {currentReservation ? "Edit Reservation" : "Add New Reservation"}
            </DialogTitle>
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
              Are you sure you want to delete this reservation? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
