import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Alert,
  Col,
  Row,
  Modal,
} from "react-bootstrap";
import { db } from "../firebase/config";
import { ref, get, push, set, child } from "firebase/database";
import { Navigate } from "react-router-dom";
import { MdMap } from "react-icons/md";
import VehicleLocationMap from "./VehicleLocationMap";

const RentVehicle = ({ user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rental, setRental] = useState({
    startDate: "",
    endDate: "",
    discountCode: "",
  });
  const [alert, setAlert] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingRentals, setExistingRentals] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedMapVehicle, setSelectedMapVehicle] = useState(null);

  const checkOfferExists = async (offerCode) => {
    try {
      const offersRef = ref(db, "offers");
      const snapshot = await get(offersRef);

      if (snapshot.exists()) {
        const offers = snapshot.val();
        const matchedOffer = Object.values(offers).find(
          (offer) => offer.code === offerCode
        );
        if (matchedOffer) {
          if (
            matchedOffer &&
            selectedVehicle &&
            selectedVehicle.price >= matchedOffer.minAmount
          ) {
            const discount =
              (matchedOffer.percentage / 100) * selectedVehicle.price;
            const finalPrice = selectedVehicle.price - discount;
            if (!Number.isNaN(finalPrice)) {
              setSelectedVehicle({
                ...selectedVehicle,
                totalPrice: finalPrice,
              });
            }
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      const dbRef = ref(db, "vehicles");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setVehicles(
          Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }))
        );
      }
    };

    const fetchRentals = async () => {
      const rentalsRef = ref(db, "rentals");
      const snapshot = await get(rentalsRef);
      if (snapshot.exists()) {
        setExistingRentals(Object.values(snapshot.val()));
      }
    };

    fetchVehicles();
    fetchRentals();
  }, []);

  useEffect(() => {
    checkOfferExists(rental.discountCode);
  }, [rental?.discountCode]);

  if (!user || user.role !== "customer") {
    return <Navigate to="/" />;
  }

  const handleToggleSelect = (vehicle) => {
    setSelectedVehicle(
      selectedVehicle?.id === vehicle.id
        ? null
        : { ...vehicle, totalPrice: vehicle.price }
    );
  };

  const isVehicleAvailable = (vehicleId, newStartDate, newEndDate) => {
    const newStart = new Date(newStartDate);
    const newEnd = new Date(newEndDate);

    return !existingRentals.some((rental) => {
      if (rental.vehicleId !== vehicleId) return false;
      const existingStart = new Date(rental.startDate);
      const existingEnd = new Date(rental.endDate);
      return (
        (newStart >= existingStart && newStart <= existingEnd) || // New start is within existing rental
        (newEnd >= existingStart && newEnd <= existingEnd) || // New end is within existing rental
        (newStart <= existingStart && newEnd >= existingEnd) // New rental fully covers existing rental
      );
    });
  };

  const handleRent = async () => {
    if (!rental.startDate || !rental.endDate || !selectedVehicle) {
      setAlert("Please select a vehicle and rental period.");
      return;
    }

    if (
      !isVehicleAvailable(selectedVehicle.id, rental.startDate, rental.endDate)
    ) {
      setAlert(
        "This vehicle is already rented for the selected dates. Please choose different dates."
      );
      return;
    }

    setAlert("");
    try {
      const rentalRef = push(ref(db, "rentals"));
      await set(rentalRef, {
        userId: user.id,
        vehicleId: selectedVehicle.id,
        startDate: rental.startDate,
        endDate: rental.endDate,
        finalPrice: selectedVehicle.totalPrice,
      });
      setSuccess(true);
    } catch (error) {
      setAlert("Failed to rent vehicle. Try again later.");
    }
  };

  return (
    <Container className="mt-4 my-5">
      <h2 className="text-center mb-4">RENT A VEHICLE</h2>

      <Row>
        {/* Vehicle Selection Section */}
        <Col md={6}>
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="mb-3 p-1"
              style={{
                backgroundColor:
                  selectedVehicle?.id === vehicle.id ? "#8b5a2b" : "#c78b2d",
                transition: "background-color 0.3s ease",
              }}
            >
              <Card.Body>
                <Card.Title>
                  <strong>{vehicle.model}</strong>
                </Card.Title>
                <Card.Text className="p-0 m-0">Make: {vehicle.make}</Card.Text>
                <Card.Text className="p-0 m-0">
                  Year: {vehicle.yearBought}
                </Card.Text>
                <Card.Text className="p-0 m-0">
                  Price per day: ${vehicle.price}
                </Card.Text>
                <Button
                  variant={
                    selectedVehicle?.id === vehicle.id ? "secondary" : "dark"
                  }
                  className="mt-2 mb-0"
                  onClick={() => handleToggleSelect(vehicle)}
                >
                  {selectedVehicle?.id === vehicle.id ? "Selected" : "Select"}
                </Button>
                <MdMap
                  onClick={() => {
                    setSelectedMapVehicle(vehicle.id);
                    setShowMap(true);
                  }}
                  className="me-2"
                  size={20}
                />
                <Modal
                  show={showMap}
                  onHide={() => setShowMap(false)}
                  size="lg"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Live Vehicle Location</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedMapVehicle && (
                      <VehicleLocationMap vehicleId={selectedMapVehicle} />
                    )}
                  </Modal.Body>
                </Modal>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* Rental Form Section */}
        <Col md={6}>
          <Card style={{ padding: "20px" }}>
            <h4 className="text-center">RENT A VEHICLE</h4>

            {alert && <Alert variant="danger">{alert}</Alert>}
            {success && (
              <Alert variant="success">Vehicle rented successfully!</Alert>
            )}

            {/* Show Selected Vehicle Details */}
            {selectedVehicle ? (
              <div className="mb-3 p-2 text-center border rounded bg-light">
                <h5>{selectedVehicle.model}</h5>
                <p className="p-0 m-0">Make: {selectedVehicle.make}</p>
                <p className="p-0 m-0">Year: {selectedVehicle.yearBought}</p>
                <p className="p-0 m-0">
                  Price per day: ${selectedVehicle.price}
                </p>
                <p className="p-0 m-0">
                  Final Price per day: ${selectedVehicle.totalPrice}
                </p>
              </div>
            ) : (
              <p className="text-center text-muted">Select a vehicle first.</p>
            )}

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Discount Code</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) =>
                    setRental({ ...rental, discountCode: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) =>
                    setRental({ ...rental, startDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) =>
                    setRental({ ...rental, endDate: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="dark"
                className="w-100"
                onClick={handleRent}
                disabled={!selectedVehicle}
              >
                {selectedVehicle ? "Rent Now" : "Select a Vehicle to Rent"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RentVehicle;
