import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Image } from "react-bootstrap";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import { FaCar, FaRedo, FaStar, FaUserCircle } from "react-icons/fa";
import { Navigate } from "react-router-dom";

const ProfilePage = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      const bookingsRef = ref(db, "rentals");
      const bookingsSnapshot = await get(bookingsRef);

      const vehiclesRef = ref(db, "vehicles");
      const vehiclesSnapshot = await get(vehiclesRef);

      if (vehiclesSnapshot.exists()) {
        setVehicles(vehiclesSnapshot.val());
      }

      if (bookingsSnapshot.exists()) {
        let data = Object.entries(bookingsSnapshot.val()).map(
          ([id, details]) => ({
            id,
            ...details,
          })
        );

        data = data.filter((booking) => booking.userId === user.id);
        setBookings(data.reverse()); // Show latest first
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="mt-4">
      {/* Profile Section */}
      <Card
        className="p-4 mb-3"
        style={{ backgroundColor: "#c78b2d", color: "white" }}
      >
        <Row className="align-items-center">
          <Col xs={1}>
            <FaUserCircle size={50} />
          </Col>
          <Col>
            <h4>{user.fullname}</h4>
            <h6>{user?.role && user.role}</h6>
          </Col>
        </Row>
      </Card>

      {/* Rental History Section */}
      <h5 className="mb-3">Rental History</h5>
      <Row>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Col key={booking.id} md={4} className="mb-3">
              <Card
                className="p-3 pb-0"
                style={{ backgroundColor: "#c78b2d", color: "white" }}
              >
                <Row className="align-items-center">
                  <Col xs={2}>
                    <FaCar size={50} className="mb-2" />
                  </Col>
                  <Col>
                    <strong>
                      {vehicles[booking.vehicleId]?.model || "Unknown Car"}
                    </strong>
                    <p className="mb-0">Start Date: {booking.startDate}</p>
                    <p className="mt-0">End Date: {booking.endDate}</p>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        ) : (
          <p>No rental history available.</p>
        )}
      </Row>
    </Container>
  );
};

export default ProfilePage;
