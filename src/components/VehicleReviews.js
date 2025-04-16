import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config";

const VehicleReviews = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await get(ref(db, "reviews"));
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val()).filter(
          (review) => review.vehicleId === vehicleId
        );
        setReviews(data);
      }
    };

    fetchReviews();
  }, [vehicleId]);

  const averageRating =
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1);

  return (
    <Card className="p-3 m-5">
      <h5>⭐ Average Rating: {averageRating.toFixed(1)}</h5>
      {reviews.length > 0 ? (
        reviews.map((rev, idx) => (
          <Card key={idx} className="p-2 mb-2">
            <Row>
              <Col xs={10}>
                <strong>{Array(rev.rating).fill("⭐").join("")}</strong>
                <p>{rev.review}</p>
              </Col>
              <Col xs={2} className="d-flex align-items-center">
                <small>{new Date(rev.date).toLocaleDateString()}</small>
              </Col>
            </Row>
          </Card>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </Card>
  );
};

export default VehicleReviews;
