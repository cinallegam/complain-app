import { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import Context from "../libs/Context";
import { useNavigate } from "react-router-dom";

function LoginStaff() {
  const { user, setUser, setSuccessDetail, mainURL } = useContext(Context);
  const navigate = useNavigate();
  const username = useRef();
  const password = useRef();
  const [ loading, setLoading ] = useState(false);
  const [ alert, setAlert ] = useState({ type: "", message: "" });

  const authHandler = async () => {
    try {
      setAlert({ type: "", message: "" });
      setLoading(true);
      if (username.current.value.length === 0) throw new Error(`กรุณากรอกชื่อผู้ใช้.`);
      if (password.current.value.length === 0) throw new Error(`กรุณากรอกรหัสผ่าน.`);
      let result = await axios.post(`${mainURL}/staff/login`, {
        username: username.current.value,
        password: password.current.value,
      });
      if (result.status !== 200) throw new Error(result.data);
      setTimeout(() => {
        setUser(result.data);
        localStorage.setItem("atks", result.data.accessToken);
        setLoading(false);
        setSuccessDetail({ message: "ล็อกอินสำเร็จ", redirect: "/list" });
        navigate("/success", { state: {}, relative: true, replace: true });
      }, 3000);
    } catch (error) {
      if (error.response) {
        setAlert({ type: "error", message: "เกิดข้อผิดพลาด: " + error.response.data.message });
      } else if (error.request) {
        setAlert({ type: "error", message: "เกิดข้อผิดพลาด: " + error.request });
      } else {
        setAlert({ type: "error", message: "เกิดข้อผิดพลาด: " + error.message });
      }
      setLoading(false);
    }
  };

  const AlertBadge = () => {
    let tag = <div style={{ minHeight: "3rem", width: "80%" }}></div>;
    if (alert.message) {
      if (alert.type === "error") {
        tag = <div className="error-alert-wrapper">{alert.message}</div>;
      } else if (alert.type === "success") {
        tag = <div className="success-alert-wrapper">{alert.message}</div>;
      }
    }
    return tag;
  };
  useEffect(() => {
    if (localStorage.getItem("atks")
    // && user.id && user.username && user.name && user.role
    ) {
      navigate("/list", { replace: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (<div className="login-staff-main-container">
    <div className="login-staff-sub-container">
      <div className="login-staff-head">
        <button className="button-back" onClick={ () => navigate("/", { replace: true }) }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </button>
        <p>{"เข้าสู่ระบบ (สำหรับเจ้าหน้าที่)"}</p>
      </div>
      <div className="login-staff-body">
        <div className="login-input-group">
          <label htmlFor="username">{"ชื่อผู้ใช้"}</label>
          <input ref={username} disabled={loading} id="username" maxLength={50}/>
        </div>
        <div className="login-input-group">
          <label htmlFor="password">รหัสผ่าน</label>
          <input ref={password} disabled={loading} id="password" type="password" maxLength={100}/>
        </div>
        <button onClick={authHandler} className="login-staff-button">
          { loading ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : "เข้าสู่ระบบ"}
        </button>
        <AlertBadge />
      </div>
    </div>
  </div>);
}

export default LoginStaff;