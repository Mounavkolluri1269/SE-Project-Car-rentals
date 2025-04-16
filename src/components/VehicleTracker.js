import React, { useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import { db } from "../firebase/config";

const VehicleTracker = ({ user }) => {
  const [activeVehicleId, setActiveVehicleId] = useState(null);

  useEffect(() => {
    const fetchActiveRental = async () => {
      const rentalsRef = ref(db, "rentals");
      const snapshot = await get(rentalsRef);

      if (snapshot.exists()) {
        const rentals = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        }));

        const today = new Date().toISOString().split("T")[0];

        const currentRental = rentals.find(
          (r) =>
            r.userId === user.id && r.startDate <= today && r.endDate >= today
        );

        if (currentRental) {
          setActiveVehicleId(currentRental.vehicleId);
        }
      }
    };

    fetchActiveRental();
  }, [user]);

  useEffect(() => {
    let interval;

    if (activeVehicleId && navigator.geolocation) {
      const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationRef = ref(db, `locations/${activeVehicleId}`);
            set(locationRef, {
              lat: latitude,
              lng: longitude,
              updatedAt: new Date().toISOString(),
            });
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      };

      updateLocation(); // Initial run
      interval = setInterval(updateLocation, 5 * 60 * 1000); // Every 5 mins
    }

    return () => clearInterval(interval);
  }, [activeVehicleId]);

  return null; // This component doesn't render anything
};

export default VehicleTracker;
