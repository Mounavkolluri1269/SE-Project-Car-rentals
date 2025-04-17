import "leaflet/dist/leaflet.css";

import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get } from "firebase/database";
import ListVehicle from "./components/ListVehicle";
import RentVehicle from "./components/RentVehicle";
import Bookings from "./components/Bookings";
import Discounts from "./components/Discounts";
import Profile from "./components/Profile";
import FAQ from "./components/FAQ";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [user, setUser] = useState(null);

  const loginUser = async (email, password) => {
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
          return user.email === email && user.password === password;
        });

      if (tempUsers.length === 1) {
        setUser(tempUsers[0]);
        localStorage.setItem("car-rentals", JSON.stringify(tempUsers[0]));
      }
    } else {
      setUser({});
    }
  };

  useEffect(() => {
    if (localStorage.getItem("car-rentals")) {
      setUser(JSON.parse(localStorage.getItem("car-rentals")));
    }
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/login"
          element={
            <Login user={user} setUser={setUser} loginUser={loginUser} />
          }
        />
        <Route
          path="/register"
          element={
            <Register user={user} setUser={setUser} loginUser={loginUser} />
          }
        />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<Home user={user} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/list-vehicle" element={<ListVehicle user={user} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/rent-vehicle" element={<RentVehicle user={user} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/booking-history" element={<Bookings user={user} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/discounts" element={<Discounts user={user} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard user={user} />}
          />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/faq" element={<FAQ user={user} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/profile" element={<Profile user={user} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
