import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { ref, push, onValue, remove, update } from "firebase/database";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const Discounts = ({ user }) => {
  const navigate = useNavigate();
  const [offer, setOffer] = useState({
    code: "",
    percentage: "",
    description: "",
    expiryDate: "",
    minAmount: "",
  });
  const [offers, setOffers] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setOffer({ ...offer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !offer.code ||
      !offer.percentage ||
      !offer.description ||
      !offer.expiryDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (editId) {
        await update(ref(db, `offers/${editId}`), {
          ...offer,
          percentage: parseFloat(offer.percentage),
          minAmount: parseFloat(offer.minAmount),
        });
        alert("✅ Offer updated!");
      } else {
        await push(ref(db, "offers"), {
          ...offer,
          percentage: parseFloat(offer.percentage),
          minAmount: parseFloat(offer.minAmount),
          createdAt: new Date().toISOString(),
        });
        alert("🎉 Offer added successfully!");
      }

      setOffer({
        code: "",
        percentage: "",
        description: "",
        expiryDate: "",
        minAmount: "",
      });
      setEditId(null);
    } catch (error) {
      console.error("Error saving offer:", error);
      alert("❌ Failed to save offer.");
    }
  };

  const handleEdit = (offerObj) => {
    setOffer(offerObj);
    setEditId(offerObj.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      await remove(ref(db, `offers/${id}`));
    }
  };

  useEffect(() => {
    if (!user || user?.role !== "rental_service") {
      navigate("/");
      return;
    }

    const offersRef = ref(db, "offers");
    onValue(offersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedOffers = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setOffers(loadedOffers);
      } else {
        setOffers([]);
      }
    });
  }, [user, navigate]);

  return (
    <Container className="mt-4">
      <Card className="p-4">
        <h4 style={{ fontWeight: "bold" }}>
          🎁 {editId ? "Edit Discount Offer" : "Add New Discount Offer"}
        </h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Offer Code</Form.Label>
                <Form.Control
                  name="code"
                  type="text"
                  value={offer.code}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Discount Percentage (%)</Form.Label>
                <Form.Control
                  name="percentage"
                  type="number"
                  value={offer.percentage}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={2}
              value={offer.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  name="expiryDate"
                  type="date"
                  value={offer.expiryDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Minimum Booking Amount ($)</Form.Label>
                <Form.Control
                  name="minAmount"
                  type="number"
                  value={offer.minAmount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            {editId ? "✅ Update Offer" : "➕ Add Offer"}
          </Button>
        </Form>
      </Card>

      <hr className="my-4" />
      <h4>📋 Current Discount Offers</h4>
      {offers.length > 0 ? (
        <Card className="p-3 mt-3">
          {offers.map((offr) => (
            <Card key={offr.id} className="mb-2 p-2">
              <Row>
                <Col md={8}>
                  <strong>{offr.code}</strong> - {offr.description} <br />
                  💸 {offr.percentage}% off | Min: ${offr.minAmount} | Exp:{" "}
                  {offr.expiryDate}
                </Col>
                <Col md={4} className="text-end">
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(offr)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(offr.id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Card>
      ) : (
        <p className="mt-3">No discount offers available.</p>
      )}
    </Container>
  );
};

export default Discounts;
