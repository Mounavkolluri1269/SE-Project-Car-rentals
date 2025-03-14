import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./Navbar.css";

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Replace with actual authentication logic

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login
  };

  return (
    <Navbar expand="lg" className="bg-warning px-4">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/">
          <img src="/logo.png" alt="Car Rental" height="40" />
        </Navbar.Brand>

        {/* Navbar Toggle for Mobile View */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navbar Links */}
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            {!isAuthenticated ? (
              <>
                {location.pathname === "/login" && (
                  <Nav.Link as={NavLink} to="/register" className="text-white">
                    Register <i className="fa-solid fa-right-to-bracket"></i>
                  </Nav.Link>
                )}
                {location.pathname === "/register" && (
                  <Nav.Link as={NavLink} to="/login" className="text-white">
                    Login <i className="fa-solid fa-sign-in-alt"></i>
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/home" className="text-white">
                  Home <i className="fa-solid fa-house"></i>
                </Nav.Link>
                <Button
                  variant="danger"
                  className="ms-3"
                  onClick={handleLogout}
                >
                  Logout <i className="fa-solid fa-sign-out-alt"></i>
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
