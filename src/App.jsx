import "./App.css";
import "./components/Component.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Context from "./libs/Context";

import Main from "./Pages/Main";

import LoginStaff from "./components/LoginStaff";
import ProfileStaff from "./components/ProfileStaff";

import Intro from "./components/Intro";
import ComplainForm from "./components/ComplainForm";
import ComplainTrack from "./components/ComplainTrack";

import ComplainList from "./components/ComplainList";
import ComplainDetail from "./components/ComplainDetail";

import Success from "./Pages/Success";
import NotFound from "./Pages/NotFound";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />
  },
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "",
        element: <Intro />
      },
      {
        path: "list",
        element: <ComplainList />
      },
      {
        path: "detail",
        element: <ComplainDetail />
      },
      {
        path: "new",
        element: <ComplainForm />
      },
      {
        path: "track",
        element: <ComplainTrack />
      },
      {
        path: "login",
        element: <LoginStaff />
      },
      {
        path: "profile",
        element: <ProfileStaff />
      },
    ],
  },
  {
    path: "/success",
    element: <Success />
  }
]);

function App() {
  const mainURL = "https://complain-api.netlify.app/api/v1";
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [successDetail, setSuccessDetail] = useState({ message: "", redirect: "" });

  const [user, setUser] = useState({ id: "", username: "", name: "", role: "" });

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("atks");
      if (accessToken) {
        if (!user.id && !user.username && !user.name && !user.role) {
          let result = await axios.get(`${mainURL}/staff/profile`, {
            headers: { Authorization: localStorage.getItem("atks") }
          });
          setUser({ id: result.data.id, username: result.data.username, name: result.data.name, role: result.data.role });
        }
      }
    } catch (error) {
      localStorage.removeItem("atks");
      setUser({ id: "", username: "", name: "", role: "" });
      if (error.response) {
        setError({ type: "error", message: "เกิดข้อผิดพลาด: " + error.response.data.message });
      } else if (error.request) {
        setError({ type: "error", message: "เกิดข้อผิดพลาด: " + error.request });
      } else {
        setError({ type: "error", message: "เกิดข้อผิดพลาด: " + error.message });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Context.Provider value={{ successDetail, setSuccessDetail, user, setUser, mainURL }}>
      <RouterProvider router={router} />
    </Context.Provider>
  );
}

export default App;