import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ref, push } from "firebase/database";
import { db } from "../firebase/config";

const ReviewForm = ({ userId, vehicleId, onClose }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review || rating < 1 || rating > 5) return;

    const reviewRef = ref(db, `reviews`);
    await push(reviewRef, {
      userId,
      vehicleId,
      rating,
      review,
      date: new Date().toISOString(),
    });

    alert("✅ Review submitted!");
    onClose(); // Close the modal
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Rating (1 to 5)</Form.Label>
        <Form.Control
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Your Review</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </Form.Group>

      <Button variant="success" type="submit" onClick={handleSubmit}>
        Submit Review
      </Button>
    </Form>
  );
};

export default ReviewForm;
