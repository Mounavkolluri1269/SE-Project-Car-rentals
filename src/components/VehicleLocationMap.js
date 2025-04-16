import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const VehicleLocationMap = ({ vehicleId }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const locationRef = ref(db, `locations/${vehicleId}`);
    const unsub = onValue(locationRef, (snapshot) => {
      if (snapshot.exists()) {
        setLocation(snapshot.val());
      }
    });

    return () => unsub();
  }, [vehicleId]);

  if (!location) return <p>Loading vehicle location...</p>;

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]} icon={customIcon}>
        <Popup>
          Vehicle ID: {vehicleId}
          <br />
          Last updated: {new Date(location.updatedAt).toLocaleString()}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default VehicleLocationMap;
