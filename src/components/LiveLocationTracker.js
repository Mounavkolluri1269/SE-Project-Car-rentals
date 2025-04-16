import React, { useEffect } from "react";
import { ref, set } from "firebase/database";
import { db } from "../firebase/config";

const LiveLocationTracker = ({ user, vehicleId }) => {
  useEffect(() => {
    if (!user || !vehicleId) return;

    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;

      const locationRef = ref(db, `locations/${vehicleId}`);
      set(locationRef, {
        userId: user.id,
        vehicleId,
        lat: latitude,
        lng: longitude,
        updatedAt: new Date().toISOString(),
      });
    };

    const errorHandler = (err) => console.error("Location Error:", err);

    const geoId = navigator.geolocation.watchPosition(
      updateLocation,
      errorHandler,
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(geoId);
  }, [user, vehicleId]);

  return null;
};

export default LiveLocationTracker;
