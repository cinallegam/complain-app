import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "./Loading";

function Main() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 1600) }, []);
  return (<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    { loading ? (<Loading />) : (<>
      <Navbar />
      <div style={{ flexGrow: "1" }}>
        <Outlet />
      </div>
      <Footer />
    </>)}
  </div>);
}

export default Main;
