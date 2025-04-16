import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { db } from "../firebase/config";
import { ref, push, get, set, update } from "firebase/database";

const FAQPage = ({ user }) => {
  const [question, setQuestion] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [alert, setAlert] = useState("");

  // Fetch FAQs from database
  const fetchFaqs = async () => {
    const faqRef = ref(db, "faqs");
    const snapshot = await get(faqRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setFaqs(list.reverse()); // latest on top
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Submit a new question
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setAlert("Please enter a question.");
      return;
    }

    const newQuestionRef = push(ref(db, "faqs"));
    await set(newQuestionRef, {
      question,
      askedBy: user?.name || "Anonymous",
      answeredBy: "",
      answer: "",
      timestamp: new Date().toISOString(),
    });

    setQuestion("");
    setAlert("✅ Question submitted!");
    fetchFaqs();
  };

  // Submit an answer (Rental Service only)
  const handleAnswerSubmit = async (faqId, answer) => {
    if (!answer.trim()) {
      alert("Please enter an answer.");
      return;
    }

    const faqRef = ref(db, `faqs/${faqId}`);
    await update(faqRef, {
      answer,
      answeredBy: user?.name || "Rental Service",
    });

    fetchFaqs();
  };

  return (
    <Container className="mt-4">
      <h4 className="mb-3">📋 FAQ - Frequently Asked Questions</h4>

      {/* Ask Question (Customer only) */}
      {user?.role === "customer" && (
        <Card className="mb-4 p-3">
          <Form onSubmit={handleQuestionSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Ask a Question</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Submit Question
            </Button>
            {alert && (
              <Alert variant="success" className="mt-2">
                {alert}
              </Alert>
            )}
          </Form>
        </Card>
      )}

      {/* FAQ List */}
      {faqs.length === 0 ? (
        <p>No questions added yet.</p>
      ) : (
        faqs.map((faq) => (
          <Card key={faq.id} className="mb-3 p-3 bg-light">
            <strong>Q:</strong> {faq.question} <br />
            <small>Asked by: {faq.askedBy}</small>
            <hr />
            {faq.answer ? (
              <>
                <strong>A:</strong> {faq.answer} <br />
                <small>Answered by: {faq.answeredBy}</small>
              </>
            ) : user?.role === "rental_service" ? (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAnswerSubmit(faq.id, e.target.answer.value);
                }}
              >
                <Form.Group className="mb-2">
                  <Form.Control
                    name="answer"
                    placeholder="Type your answer here..."
                  />
                </Form.Group>
                <Button type="submit" size="sm" variant="success">
                  Submit Answer
                </Button>
              </Form>
            ) : (
              <p className="text-muted">Awaiting answer...</p>
            )}
          </Card>
        ))
      )}
    </Container>
  );
};

export default FAQPage;
