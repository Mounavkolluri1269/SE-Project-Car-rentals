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
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config"; // Ensure Firebase is configured
import { ref, push, set, get } from "firebase/database";

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

  if (!user || user?.role !== "rental_service") {
    navigate("/");
  }

  // Fetch existing vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const dbRef = ref(db, "vehicles");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setVehicles(
            Object.values(snapshot.val()).filter(
              (vehicles) => vehicles.owner_id === user?.id
            )
          );
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchVehicles();
  }, []);

  // Handle form input changes
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setAlert("");

    if (!form.model || !form.make || !form.yearBought || !form.price) {
      setAlert("Please fill all fields.");
      return;
    }

    try {
      const newVehicleRef = push(ref(db, "vehicles"));
      await set(newVehicleRef, {
        model: form.model,
        make: form.make,
        yearBought: form.yearBought,
        price: form.price,
        owner_id: user?.id,
      });

      setVehicles([...vehicles, form]);
      setForm({ model: "", make: "", yearBought: "", price: "" });
    } catch (error) {
      setAlert("Error adding vehicle: " + error.message);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        {/* Left Side - Vehicle List */}
        <Col md={6}>
          <h4>List a Vehicle</h4>
          {vehicles?.length === 0 && (
            <Alert variant="danger">No Listed Vehicles available!</Alert>
          )}
          {vehicles.map((vehicle, index) => (
            <Card key={index} className="mb-3 p-3 bg-warning">
              <Card.Body>
                <Card.Title>{vehicle.model}</Card.Title>
                <Card.Text>
                  {vehicle.make} - {vehicle.yearBought} <br />
                  Price: ${vehicle.price}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* Right Side - Add New Vehicle */}
        <Col md={6}>
          <Card className="p-4">
            <h4 className="text-center">Add New Vehicle</h4>
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
                ADD
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ListVehicle;
