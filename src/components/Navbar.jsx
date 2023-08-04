import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context from "../libs/Context";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, setSuccessDetail } = useContext(Context);
  const [ menuToggle, setMenuToggle ] = useState(false);
  const [ dropdownToggle, setDropdownToggle ] = useState({ complainWeb: false, complainList: false, setting: false });
  
  let setFalse = (obj, val) => {
    Object.keys(obj).map(d => (obj[d] = val));
    return obj;
  };

  const logoutHandle = async () => {
    try {
      setMenuToggle(false);
      localStorage.removeItem("atks");
      setSuccessDetail({ message: "ออกจากระบบสำเร็จ", redirect: "/login" });
      setUser({ id: "", username: "", name: "", role: "" });
      navigate("/success", { state: {}, relative: true, replace: true });
    } catch (error) {
      if (error.response) {
        console.error("เกิดข้อผิดพลาด: " + error.response.data.message);
      } else if (error.request) {
        console.error("เกิดข้อผิดพลาด: " + error.request);
      } else {
        console.error("เกิดข้อผิดพลาด: " + error.message);
      }
    }
  };

  const navigateHandle = (to) => {
    setMenuToggle(false);
    setDropdownToggle(prev => setFalse(prev, false));
    navigate(to, { replace: true });
  };

  const StaffMenu = () => {
    let tag = <></>;
    if (localStorage.getItem("atks")) {
      tag = (<>
        <div className={menuToggle ? "dropdown dropdown-content-show" : "dropdown"}>
          <button onClick={ () => setDropdownToggle(prev => ({ complainList: !prev.complainList, complainWeb: false, setting: false })) }>
            {"จัดการเรื่องราวร้องทุกข์ "}
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </button>
          <div className={ dropdownToggle.complainList ? "dropdown-content dropdown-content-show" : "dropdown-content" }>
            <button onClick={ () => navigateHandle("/new") }>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>{" "}
              <span>{"แจ้งเรื่องร้องทุกใหม่"}</span>
            </button>
            <button onClick={ () => navigateHandle("/list") }>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>{" "}
              <span>{"รายการร้องทุกข์"}</span>
            </button>
            <button onClick={ () => navigateHandle("/track") }>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>{" "}
              <span>{"ติดตามผล"}</span>
            </button>
          </div>
        </div>
        <div className={menuToggle ? "dropdown dropdown-content-show" : "dropdown"}>
          <button onClick={ () => setDropdownToggle(prev => ({ setting: !prev.setting, complainWeb: false, complainList: false })) }>
            {"ตั้งค่า "}
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </button>
          <div className={dropdownToggle.setting ? "dropdown-content dropdown-content-last dropdown-content-show" : "dropdown-content dropdown-content-last"}>
            <button onClick={ () => navigateHandle("/profile") }>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>
              {"โปรไฟล์:  "}
              <span>{user.username}</span>
            </button>
            <button onClick={logoutHandle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
              </svg>{" "}
              <span>{"ออกจากระบบ"}</span>
            </button>
          </div>
        </div>
      </>);
    } else {
      tag = (<div style={{ marginBottom: "1rem", borderTop: menuToggle ? "1px solid #dcdcdc" : "none", width: "95%", paddingLeft: "1rem", paddingTop: "0.5rem" }}>
          <Link to={"/login"}><button onClick={() => setMenuToggle(false)}><span>{"เข้าสู่ระบบ"}</span></button></Link>
      </div>);
    }
    return tag;
  };

  return (<header>
    <nav className={menuToggle ? "navbar navbar-expand" : "navbar"}>
      <div className="navbar-title">
        <p style={{ cursor: "pointer" }} onClick={ () => navigate("/", { replace: true }) }>{"ร้องทุกข์"}</p>
        <button onClick={ () => setMenuToggle(!menuToggle) }>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>
      </div>
      <div className="navbar-menu"><StaffMenu /></div>
    </nav>
  </header>);
}

export default Navbar;