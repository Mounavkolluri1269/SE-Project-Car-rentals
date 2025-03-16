import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { db } from "../firebase/config";
import { ref, get, push } from "firebase/database";
import { FaCar, FaRedo, FaFileAlt } from "react-icons/fa";

const BookingHistory = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [showRebookModal, setShowRebookModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

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

  // Open Rebook Modal
  const handleRebook = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    setShowRebookModal(true);
  };

  // Handle Rebooking
  const confirmRebook = async () => {
    if (!newStartDate || !newEndDate) {
      alert("Please select valid dates.");
      return;
    }

    // Check if vehicle is available
    const bookingsRef = ref(db, "rentals");
    const bookingsSnapshot = await get(bookingsRef);

    if (bookingsSnapshot.exists()) {
      const existingBookings = Object.values(bookingsSnapshot.val()).filter(
        (b) =>
          b.vehicleId === selectedVehicle &&
          ((newStartDate >= b.startDate && newStartDate <= b.endDate) ||
            (newEndDate >= b.startDate && newEndDate <= b.endDate))
      );

      if (existingBookings.length > 0) {
        alert("This vehicle is already booked for the selected dates.");
        return;
      }
    }

    // Add new booking
    const newBookingRef = ref(db, "rentals");
    await push(newBookingRef, {
      vehicleId: selectedVehicle,
      userId: user.id,
      startDate: newStartDate,
      endDate: newEndDate,
    });

    alert("Rebooked successfully!");
    setShowRebookModal(false);
    setNewStartDate("");
    setNewEndDate("");
    window.location.reload(); // Refresh the booking list
  };

  return (
    <Container className="mt-4">
      {/* Title */}
      <h4 className="mb-3" style={{ fontWeight: "bold" }}>
        📌 Booking History
      </h4>

      <Row>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Col key={booking.id} md={6} className="mb-3">
              <Card
                className="p-3"
                style={{ backgroundColor: "#c78b2d", color: "white" }}
              >
                <Row className="align-items-center">
                  <Col xs={2}>
                    <FaCar size={25} />
                  </Col>
                  <Col>
                    <strong>
                      {vehicles[booking.vehicleId]?.model || "Unknown Car"}
                    </strong>
                    <p>
                      {booking.startDate} - {booking.endDate}
                    </p>
                  </Col>
                  <Col xs={3} className="text-end">
                    <FaRedo
                      size={20}
                      className="me-3"
                      title="Rebook"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRebook(booking.vehicleId)}
                    />
                    <FaFileAlt size={20} title="View Invoice" />
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        ) : (
          <p>No booking history found.</p>
        )}
      </Row>

      {/* Rebook Modal */}
      <Modal show={showRebookModal} onHide={() => setShowRebookModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>🔄 Rebook Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRebookModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmRebook}>
            Confirm Rebook
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingHistory;
