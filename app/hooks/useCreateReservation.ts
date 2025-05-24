import { useState, useCallback } from "react";
import {
  ReservationData,  CreateReservationParams,
} from "@lib/types";

export function useCreateReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdReservation, setCreatedReservation] =
    useState<ReservationData | null>(null);

  const createReservation = useCallback(
    async (params: CreateReservationParams) => {
      setIsLoading(true);
      setError(null);
      setCreatedReservation(null);
      try {
        const response = await fetch("http://localhost:3000/api/reservation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: params.user_id,
            workshop_id: params.workshop_id,
            date: params.date || new Date().toISOString(),
            status: params.status || "PENDING",
            attended: params.attended
          }),
        });
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data: ReservationData = await response.json();
        setCreatedReservation(data);
        return data;
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while creating reservation.");
        }
        setCreatedReservation(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetError = useCallback(() => setError(null), []);

  return {
    createReservation,
    isLoading,
    error,
    createdReservation,
    resetError,
  };
}
