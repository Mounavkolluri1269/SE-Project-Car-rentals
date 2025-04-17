import React from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdAddCircle, MdDiscount, MdMessage, MdRepeat } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";

const Home = ({ user }) => {
  const isAuthenticated = user ? true : false;
  const navigate = useNavigate();

  const cardList = [
    {
      show: isAuthenticated && user?.role === "rental_service",
      title: "Admin Dashboard",
      icon: <RiDashboardFill size={24} />,
      onClick: () => navigate("/admin-dashboard"),
    },
    {
      show: isAuthenticated && user?.role === "rental_service",
      title: "List a Vehicle",
      icon: <MdAddCircle size={24} />,
      onClick: () => navigate("/list-vehicle"),
    },
    {
      show: isAuthenticated && user?.role === "rental_service",
      title: "Discounts",
      icon: <MdDiscount size={24} />,
      onClick: () => navigate("/discounts"),
    },
    {
      show: isAuthenticated && user?.role !== "rental_service",
      title: "Rent a Vehicle",
      icon: <MdAddCircle size={24} />,
      onClick: () => navigate("/rent-vehicle"),
    },
    {
      show: isAuthenticated,
      title: "Booking History",
      icon: <MdRepeat size={24} />,
      onClick: () => navigate("/booking-history"),
    },
    {
      show: isAuthenticated,
      title: "FAQ",
      icon: <MdMessage size={24} />,
      onClick: () => navigate("/faq"),
    },
    {
      show: isAuthenticated,
      title: "Profile",
      icon: <CgProfile size={24} />,
      onClick: () => navigate("/profile"),
    },
  ];

  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Car Rentals Dashboard</h1>
      <p>Select a vehicle and start your journey today!</p>
      {!isAuthenticated && (
        <button
          className="btn btn-warning"
          onClick={() => navigate("/rent-vehicle")}
        >
          Browse Vehicles
        </button>
      )}

      <div className="row mt-5">
        {cardList
          .filter((card) => card.show)
          .map((card, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div
                className="card card-hover h-100 shadow-sm p-3"
                style={{ cursor: "pointer", borderRadius: "1rem" }}
                onClick={card.onClick}
              >
                <div className="card-body">
                  <div className="mb-3">{card.icon}</div>
                  <h5 className="card-title">{card.title}</h5>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
