import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

const RentalLocationMap = ({ location, vehicleName }) => {
  if (!location?.lat || !location?.lng) return <p>Location not available.</p>;

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]} icon={carIcon}>
        <Popup>{vehicleName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default RentalLocationMap;
