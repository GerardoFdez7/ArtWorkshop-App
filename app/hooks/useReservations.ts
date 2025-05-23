import { useState, useEffect, useCallback } from "react";
import { ReservationData } from "@lib/types";

export function useReservations() {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/api/reservation");
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data: ReservationData[] = await response.json();
        setReservations(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching reservations.");
        }
        setReservations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [refreshTrigger]); 

  return { reservations, isLoading, error, refreshData };
}
