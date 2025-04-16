import React, { useEffect, useState } from "react";
import { Container, Card, Table, Row, Col } from "react-bootstrap";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import { FaCar, FaMapMarkerAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import VehicleTracker from "./VehicleTracker";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [rentedVehicles, setRentedVehicles] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState({});
  const [vehicleNames, setVehicleNames] = useState({}); // Store vehicle names

  if (!user || user?.role !== "rental_service") {
    navigate("/");
  }

  useEffect(() => {
    const fetchRentalData = async () => {
      const rentalsRef = ref(db, "rentals");
      const rentalsSnapshot = await get(rentalsRef);

      const vehiclesRef = ref(db, "vehicles");
      const vehiclesSnapshot = await get(vehiclesRef);

      if (rentalsSnapshot.exists() && vehiclesSnapshot.exists()) {
        const rentalsData = rentalsSnapshot.val();
        const vehiclesData = vehiclesSnapshot.val();

        let vehicleCount = {};
        let revenueData = {};
        let revenueTotal = 0;
        let vehicleNamesMap = {};

        Object.values(rentalsData).forEach((rental) => {
          const vehicleId = rental.vehicleId;
          const vehicleName = vehiclesData[vehicleId]?.model || "Unknown Car";
          const pricePerDay = rental.finalPrice || 0;
          const rentalDays =
            (new Date(rental.endDate) - new Date(rental.startDate)) /
            (1000 * 60 * 60 * 24);
          const totalPrice = rentalDays * pricePerDay;

          vehicleCount[vehicleId] = (vehicleCount[vehicleId] || 0) + 1;
          revenueData[vehicleName] =
            (revenueData[vehicleName] || 0) + totalPrice;
          revenueTotal += totalPrice;
          vehicleNamesMap[vehicleId] = vehicleName;
        });

        // Sort vehicles by top rented
        const sortedVehicles = Object.entries(vehicleCount)
          .sort((a, b) => b[1] - a[1])
          .map(([vehicleId, count]) => ({
            id: vehicleId,
            name: vehicleNamesMap[vehicleId] || "Unknown Car",
            count,
          }));

        setRentedVehicles(sortedVehicles);
        setTotalRevenue({ ...revenueData, total: revenueTotal });
        setVehicleNames(vehicleNamesMap);
      }
    };

    fetchRentalData();
  }, []);

  useEffect(() => {}, [totalRevenue, rentedVehicles]);

  return (
    <Container className="mt-4">
      <Row>
        {/* Top Rented Vehicles */}
        <Col md={6}>
          <Card className="p-3">
            <h5 style={{ fontWeight: "bold" }}>🚗 Top Rented Vehicles</h5>
            {rentedVehicles.length > 0 ? (
              rentedVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="p-2 mb-2"
                  style={{ backgroundColor: "#c78b2d", color: "white" }}
                >
                  <Row className="align-items-center pt-2 pb-0">
                    <Col xs={2}></Col>
                    <Col xs={2}>
                      <FaCar size={20} />
                    </Col>
                    <Col>
                      <strong>{vehicle.name}</strong>
                      <p>Rented {vehicle.count} times</p>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <p>No rental data available.</p>
            )}
          </Card>
        </Col>

        {/* Total Revenue */}
        <Col md={6}>
          <Card className="p-3">
            <h5 style={{ fontWeight: "bold" }}>💰 Total Revenue</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totalRevenue)
                  .filter(([key]) => key !== "total")
                  .map(([vehicleName, revenue]) => (
                    <tr key={vehicleName}>
                      <td>{vehicleName}</td>
                      <td>${revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                <tr>
                  <td>
                    <strong>Total:</strong>
                  </td>
                  <td>
                    <strong>${totalRevenue.total?.toFixed(2) || 0}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {user && <VehicleTracker user={user} />}
    </Container>
  );
};

export default AdminDashboard;
