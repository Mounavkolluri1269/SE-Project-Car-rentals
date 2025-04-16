import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

const Login = ({ user, setUser, loginUser }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (user?.email) {
    return <Navigate to="/" />;
  }

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emptyTextRegex = /^\s*$/;

    setAlert("");

    if (!emailRegex.test(form.email.trim())) {
      setAlert("Please enter a valid Email");
      return;
    }

    if (emptyTextRegex.test(form.password.trim())) {
      setAlert("Please enter a Password");
      return;
    }

    await loginUser(form.email, form.password);
    if (user?.email && user?.id) {
      setAlert("");
      setRedirect(true);
    } else {
      setAlert("Invalid Email or Password");
    }
  };

  if (redirect) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "20px" }}>
        <h2 className="text-center">
          WELCOME TO <span className="text-warning">CAR RENTALS</span>
        </h2>

        <Form>
          {alert && (
            <Alert variant="danger" className="w-100 p-2">
              <i
                className="fa-solid fa-triangle-exclamation me-2"
                style={{ color: "red" }}
              ></i>
              {alert}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              name="email"
              value={form.email}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={onChange}
            />
          </Form.Group>

          <Button variant="dark" className="w-100" onClick={onSubmit}>
            LOG IN
          </Button>
        </Form>
        <p className="text-center mt-2">
          NEW HERE?{" "}
          <Link to="/register" className="text-warning">
            GET STARTED!
          </Link>
        </p>
      </Card>
    </Container>
  );
};

export default Login;
