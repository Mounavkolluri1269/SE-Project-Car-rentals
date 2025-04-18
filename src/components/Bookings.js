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
import { FaCar, FaRedo, FaFileAlt, FaStar } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "./Invoice";
import ReviewForm from "./ReviewForm";
import { MdOutlineStarPurple500 } from "react-icons/md";
import VehicleReviews from "./VehicleReviews";
import { MdMap } from "react-icons/md";
import VehicleLocationMap from "./VehicleLocationMap";
import LiveLocationTracker from "./LiveLocationTracker";

const BookingHistory = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [showRebookModal, setShowRebookModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviews, setShowReviews] = useState(null);
  const [showReviewModalForRental, setShowReviewModalForRental] =
    useState(false);
  const [users, setUsers] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedMapVehicle, setSelectedMapVehicle] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      const bookingsRef = ref(db, "rentals");
      const bookingsSnapshot = await get(bookingsRef);

      const vehiclesRef = ref(db, "vehicles");
      const vehiclesSnapshot = await get(vehiclesRef);

      let vehicleData = null;
      if (vehiclesSnapshot.exists()) {
        vehicleData = vehiclesSnapshot.val();
        setVehicles(vehiclesSnapshot.val());
      }

      const usersRef = ref(db, "users");
      const usersSnapshot = await get(usersRef);

      if (usersSnapshot.exists()) {
        setUsers(usersSnapshot.val());
      }

      if (bookingsSnapshot.exists()) {
        let data = Object.entries(bookingsSnapshot.val()).map(
          ([id, details]) => ({
            id,
            ...details,
          })
        );

        data = data.filter(
          (booking) =>
            booking.userId === user.id ||
            vehicleData[booking.vehicleId]?.owner_id === user.id
        );
        setBookings(data.reverse());
      }
    };

    fetchBookings();
  }, [user]);

  // Rebooking logic
  const handleRebook = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    setShowRebookModal(true);
  };

  const confirmRebook = async () => {
    if (!newStartDate || !newEndDate) {
      alert("Please select valid dates.");
      return;
    }

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

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewForRental = (vehicleId) => {
    setShowReviews(vehicleId);
    setShowReviewModalForRental(true);
  };

  const isTodayInRange = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize times to ignore time part
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    today.setHours(12, 0, 0, 0); // Midday to avoid timezone issues

    return today >= start && today <= end;
  };

  return (
    <Container className="mt-4">
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
                    {user?.role === "customer" && (
                      <FaRedo
                        size={20}
                        className="me-3"
                        title="Rebook"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRebook(booking.vehicleId)}
                      />
                    )}

                    <MdMap
                      onClick={() => {
                        setSelectedMapVehicle(booking.vehicleId);
                        setShowMap(true);
                      }}
                      className="me-2"
                      size={20}
                    />

                    {isTodayInRange(booking.startDate, booking.endDate) && (
                      <LiveLocationTracker
                        user={user}
                        vehicleId={booking.vehicleId}
                      />
                    )}

                    <PDFDownloadLink
                      document={
                        <Invoice
                          booking={booking}
                          vehicle={vehicles[booking.vehicleId]}
                          renterName={
                            users[booking.userId]?.fullname || "Unknown User"
                          }
                          ownerName={
                            users[vehicles[booking.vehicleId].owner_id]
                              ?.fullname || "Unknown Owner"
                          }
                        />
                      }
                      fileName={`Invoice-${booking.id}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? (
                          "Loading..."
                        ) : (
                          <FaFileAlt
                            size={20}
                            className="me-3"
                            title="Download Invoice"
                            style={{ cursor: "pointer" }}
                          />
                        )
                      }
                    </PDFDownloadLink>

                    {user?.role === "customer" && (
                      <FaStar
                        size={20}
                        title="Add Review"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleReview(booking)}
                      />
                    )}

                    {user?.role === "rental_service" && (
                      <>
                        <MdOutlineStarPurple500
                          onClick={() =>
                            handleReviewForRental(booking.vehicleId)
                          }
                          className="me-2"
                          size={20}
                        />
                        <Modal
                          show={showReviewModalForRental}
                          onHide={() => setShowReviewModalForRental(false)}
                          size="lg"
                          centered
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Vehicle Reviews</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            {showReviews && (
                              <VehicleReviews vehicleId={showReviews} />
                            )}
                          </Modal.Body>
                        </Modal>
                      </>
                    )}
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

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>⭐ Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReviewForm
            booking={selectedBooking}
            user={user}
userId={user?.id || user?.uid}
            vehicleId={vehicles[selectedBooking?.vehicleId]}
            onClose={() => setShowReviewModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Map Modal */}
      <Modal show={showMap} onHide={() => setShowMap(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Live Vehicle Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMapVehicle && (
            <VehicleLocationMap vehicleId={selectedMapVehicle} />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BookingHistory;
