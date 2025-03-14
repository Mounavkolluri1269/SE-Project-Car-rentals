import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";

import ProtectedRoute from "./routing/ProtectedRoute";

import { db } from "./firebase/config";
import { ref, get } from "firebase/database";

function App() {
  const [user, setUser] = useState(null);

  const loginUser = async (email, password) => {
    console.log("LOGIN CALLED");
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

  return (
    <>
      <Navbar />
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
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
