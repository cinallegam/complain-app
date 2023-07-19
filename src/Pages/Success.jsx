import "./Page.css";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../libs/Context";

function SuccessComponent() {
  const { successDetail } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!successDetail.message.length > 0 && !successDetail.redirect.length > 0) navigate(-1, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => { navigate(successDetail.redirect, { replace: false }) }, 1500);
  }, [navigate, successDetail]);

  return (<>
    { successDetail.message.length !== 0 && successDetail.redirect.length !== 0 ? (
      <div className="success-box-group">
        <div className="success-outer">
          <div className="success-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
            </svg>
          </div>
        </div>
        <h1>{successDetail.message}</h1>
      </div>
    ) : null}
  </>);
}

export default SuccessComponent;