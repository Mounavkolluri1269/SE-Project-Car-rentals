import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { MdEdit, MdDelete, MdOutlineStarPurple500 } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, push, set, get, remove } from "firebase/database";
import { Modal } from "react-bootstrap";
import VehicleReviews from "./VehicleReviews";
import { MdMap } from "react-icons/md";
import VehicleLocationMap from "./VehicleLocationMap";

const ListVehicle = ({ user }) => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    model: "",
    make: "",
    yearBought: "",
    price: "",
  });
  const [alert, setAlert] = useState("");
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [showReviews, setShowReviews] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedMapVehicle, setSelectedMapVehicle] = useState(null);

  if (!user || user?.role !== "rental_service") {
    navigate("/");
  }

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const dbRef = ref(db, "vehicles");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const filtered = Object.entries(data)
          .map(([id, vehicle]) => ({ id, ...vehicle }))
          .filter((vehicle) => vehicle.owner_id === user?.id);
        setVehicles(filtered);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlert("");

    if (!form.model || !form.make || !form.yearBought || !form.price) {
      setAlert("Please fill all fields.");
      return;
    }

    try {
      if (editingVehicleId) {
        const vehicleRef = ref(db, `vehicles/${editingVehicleId}`);
        await set(vehicleRef, {
          ...form,
          owner_id: user?.id,
        });
        setAlert("✅ Vehicle updated!");
      } else {
        const newVehicleRef = push(ref(db, "vehicles"));
        await set(newVehicleRef, {
          ...form,
          owner_id: user?.id,
        });
        setAlert("✅ Vehicle added!");
      }

      setForm({ model: "", make: "", yearBought: "", price: "" });
      setEditingVehicleId(null);
      fetchVehicles(); // Refresh after add/edit
    } catch (error) {
      setAlert("Error saving vehicle: " + error.message);
    }
  };

  const handleEdit = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    setForm({
      model: vehicle.model,
      make: vehicle.make,
      yearBought: vehicle.yearBought,
      price: vehicle.price,
    });
    setEditingVehicleId(vehicleId);
  };

  const handleDelete = async (vehicleId) => {
    try {
      const vehicleRef = ref(db, `vehicles/${vehicleId}`);
      await remove(vehicleRef);
      setAlert("✅ Vehicle deleted!");
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (error) {
      setAlert("Error deleting vehicle: " + error.message);
    }
  };

  const handleReviews = (vehicleId) => {
    setShowReviews(vehicleId);
    setShowReviewModal(true);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <h4>List a Vehicle</h4>
          {vehicles.length === 0 && (
            <Alert variant="danger">No Listed Vehicles available!</Alert>
          )}
          {vehicles.map((vehicle, index) => (
            <Card key={vehicle.id} className="mb-3 p-3 bg-warning">
              <Card.Body>
                <Card.Title>{vehicle.model}</Card.Title>
                <Card.Text>
                  <Row>
                    <Col xs={6}>
                      {vehicle.make} - {vehicle.yearBought} <br />
                      Price: ${vehicle.price}
                    </Col>
                    <Col xs={6} className="d-flex justify-content-end">
                      <MdEdit
                        onClick={() => handleEdit(vehicle.id)}
                        className="me-2"
                        size={20}
                      />
                      <MdDelete
                        onClick={() => handleDelete(vehicle.id)}
                        className="me-2"
                        size={20}
                      />
                      <MdMap
                        onClick={() => {
                          setSelectedMapVehicle(vehicle.id);
                          setShowMap(true);
                        }}
                        className="me-2"
                        size={20}
                      />
                      <MdOutlineStarPurple500
                        onClick={() => handleReviews(vehicle.id)}
                        className="me-2"
                        size={20}
                      />
                    </Col>
                  </Row>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col md={6}>
          <Card className="p-4">
            <h4 className="text-center">
              {editingVehicleId ? "Edit Vehicle" : "Add New Vehicle"}
            </h4>
            {alert && <Alert variant="danger">{alert}</Alert>}
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Model</Form.Label>
                <Form.Control
                  type="text"
                  name="model"
                  placeholder="Enter Model..."
                  value={form.model}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Make</Form.Label>
                <Form.Control
                  type="text"
                  name="make"
                  placeholder="Enter Make..."
                  value={form.make}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Year Bought</Form.Label>
                <Form.Control
                  type="number"
                  name="yearBought"
                  placeholder="Enter Year..."
                  value={form.yearBought}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="Enter Price..."
                  value={form.price}
                  onChange={onChange}
                />
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100">
                {editingVehicleId ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Review Modal */}
      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Vehicle Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showReviews && <VehicleReviews vehicleId={showReviews} />}
        </Modal.Body>
      </Modal>

      {/* Map Model */}
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

export default ListVehicle;
