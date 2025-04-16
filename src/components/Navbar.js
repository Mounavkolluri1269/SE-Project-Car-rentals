import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Navbar.css";
import {
  MdLogin,
  MdLogout,
  MdMessage,
  MdCloudDownload,
  MdRepeat,
  MdAddCircle,
  MdDiscount,
  MdOutlineStarPurple500,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiDashboardFill } from "react-icons/ri";

const NavigationBar = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("car-rentals");

  const handleLogout = () => {
    localStorage.removeItem("car-rentals");
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <Navbar expand="lg" className="bg-warning px-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/logo.png" alt="Car Rental" height="40" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            {!isAuthenticated ? (
              <>
                {location.pathname === "/login" && (
                  <Nav.Link as={NavLink} to="/register" className="text-white">
                    Register <MdLogin />
                  </Nav.Link>
                )}
                {location.pathname === "/register" && (
                  <Nav.Link as={NavLink} to="/login" className="text-white">
                    Login <MdLogin />
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                {user?.role === "rental_service" ? (
                  <>
                    <Nav.Link
                      as={NavLink}
                      to="/admin-dashboard"
                      className="text-white top-hover"
                    >
                      <span className="show-hover">Admin Dashboard</span>{" "}
                      <RiDashboardFill />
                    </Nav.Link>

                    <Nav.Link
                      as={NavLink}
                      to="/list-vehicle"
                      className="text-white top-hover"
                    >
                      <span className="show-hover">List a Vehicle</span>{" "}
                      <MdAddCircle />
                    </Nav.Link>

                    <Nav.Link
                      as={NavLink}
                      to="/discounts"
                      className="text-white top-hover"
                    >
                      <span className="show-hover">Discounts</span>{" "}
                      <MdDiscount />
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link
                    as={NavLink}
                    to="/rent-vehicle"
                    className="text-white top-hover"
                  >
                    <span className="show-hover">Rent a Vehicle</span>{" "}
                    <MdAddCircle />
                  </Nav.Link>
                )}

                <Nav.Link
                  as={NavLink}
                  to="/booking-history"
                  className="text-white top-hover"
                >
                  <span className="show-hover">Booking History</span>
                  <MdRepeat />
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/faq"
                  className="text-white top-hover"
                >
                  <span className="show-hover">FAQ</span> <MdMessage />
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/profile"
                  className="text-white top-hover"
                >
                  <span className="show-hover">Profile</span> <CgProfile />
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  className="text-white top-hover"
                  onClick={handleLogout}
                >
                  <span className="show-hover">Logout</span> <MdLogout />
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
