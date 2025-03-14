import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { db } from "../firebase/config";
import { get, push, ref, set } from "firebase/database";

const Register = ({ user, setUser, loginUser }) => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (user?.email) {
    return <Navigate to="/" />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlert("");

    if (!form.fullname.trim()) {
      setAlert("Please enter a User Name");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setAlert("Please enter a valid Email");
      return;
    }

    if (form.password.length < 6) {
      setAlert("Password must be at least 6 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setAlert("Passwords do not match");
      return;
    }

    try {
      const dbRef = ref(db, "users");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const users = snapshot.val();

        const tempUsers = Object.keys(users)
          .map((id) => {
            return {
              ...users[id],
              id,
            };
          })
          .filter((user) => {
            return user.email === form.email;
          });

        if (tempUsers.length > 0) {
          setAlert("The email address you entered is already in use. ");
          return;
        }
      }

      const newDocRef = push(ref(db, "users"));
      await set(newDocRef, {
        fullname: form.fullname,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      await loginUser(form.email, form.password);
      if (user?.email && user?.id) {
        setRedirect(true);
      }
    } catch (error) {
      setAlert("Registration failed: " + error.message);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "20px" }}>
        <h2 className="text-center">CREATE AN ACCOUNT</h2>

        {alert && <Alert variant="danger">{alert}</Alert>}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              placeholder="Enter Full Name"
              value={form.fullname}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={onChange}
            />
          </Form.Group>

          <Button type="submit" variant="warning" className="w-100">
            REGISTER
          </Button>
        </Form>

        <p className="text-center mt-2">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link to="/login" className="text-warning">
            LOG IN
          </Link>
        </p>
      </Card>
    </Container>
  );
};

export default Register;
