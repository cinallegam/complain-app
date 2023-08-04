import { useContext, useMemo, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Context from "../libs/Context";

function ComplainTrack() {
  const navigate = useNavigate();
  const { user, mainURL } = useContext(Context);
  const [ loading, setLoading ] = useState(false);
  const [ alert, setAlert ] = useState({ type: "", message: "" });
  const [ track, setTrack ] = useState("");
  const [ trackData, setTrackData ] = useState({ history: [] });

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  const getTrackButtonEnable = useMemo(() => {
    return track.length == 0;
  }, [track]);

  const backHandle = async () => {
    setTrack("");
    setTrackData({ history: [] });
  };

  const getTrackData = async () => {
    try {
      setLoading(true);
      setAlert({ type: "", message: "" });
      const result = await axios.get(`${mainURL}/track/${track}`);
      if (result.status !== 200) throw new Error(result.data);
      sleep(2000);
      setLoading(false);
      if (result.data.id) {
        let data = {...result.data, history: result.data.history.reverse()}
        console.log(result.data)
        setTrackData(data);
      } else {
        throw new Error("ไม่พบข้อมูล");
      }
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
        tag = <div className="error-alert-wrapper" style={{ width: "auto" }}>{alert.message}</div>;
      } else if (alert.type === "success") {
        tag = <div className="success-alert-wrapper" style={{ width: "auto" }}>{alert.message}</div>;
      }
    }
    return tag;
  };

  return (<>
    { !trackData.id || track.length === 0 ? (
      <div className="complain-form-container">
        <div className="complain-form-head">
          <button className="button-back" onClick={ () => navigate(user.id ? "/list" : "/", { replace: true }) }>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
          </button>
          <p>{"ติดตามผลเรื่องร้องทุกข์"}</p>
        </div>
        <div className="complain-form-body-wrapper">
          <div className="complain-form-title">
            <h3 style={{ marginBottom: "-0.1rem" }}>
              {"ข้อมูลเรื่องร้องทุกข์"}
            </h3>
            <small style={{ marginLeft: "0.3rem", fontSize: "0.75rem" }}>
              {"ช่องที่มี"}
              <span style={{ fontWeight: "bold", color: "red" }}>
                {" * "}
              </span>
              {"จำเป็นต้องกรอก"}
            </small>
          </div>
          <div className="complain-form-body">
            <div className="horizontal-divider"></div>
            <div className="complain-input-group">
              <label htmlFor="id">{"หมายเลขเรื่องร้องทุกข์"}<span style={{ fontWeight: "bold", color: "red" }}>{" * "}</span></label>
              <input id="id" maxLength={50} value={track} onChange={ e => setTrack(e.target.value)}/>
            </div>
          </div>
        </div>
        <div className="complain-form-footer">
          <button disabled={getTrackButtonEnable} onClick={getTrackData} className={!getTrackButtonEnable ? "complain-save-button" : "complain-disable-button"}>
            { loading ? (
              <div className="lds-ring" style={{ marginTop: "-0.4rem", height: "1.3rem" }}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              "ค้นหา"
            )}
          </button>
          <div><AlertBadge /></div>
        </div>
      </div>
    ) : (<>
      <div className="complain-form-container">
        <div className="complain-form-head">
          <button className="button-back" onClick={backHandle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
          </button>
          <p>{"ข้อมูลผู้ร้องทุกข์"}</p>
        </div>
        <div className="complain-form-body-wrapper">
          <div className="complain-form-body" style={{ marginLeft: "1.5rem", marginRight: "1.5rem" }}>
            <div className="complain-from-group">
              <div style={{ marginTop: "1rem" }} className="complain-input-group">
                <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <label style={{ fontWeight: "bold" }}>{"หมายเลขร้องทุกข์ : "}</label>
                  {trackData.id}
                </span>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <label style={{ fontWeight: "bold" }}>{"ผู้ร้องทุกข์ : "}</label>
                  {trackData.prefixname}{trackData.firstname}{" "}{trackData.lastname}
                </span>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <label style={{ fontWeight: "bold" }}>{"วัน/เวลาที่ร้อง : "}</label>
                  { trackData.createdAt ? 
                    new Date(trackData.createdAt).toLocaleString("th-TH", { dateStyle: "full", timeStyle: "medium" })
                    : "ไม่มี"
                  }
                </span>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <span
                  style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <label style={{ fontWeight: "bold" }}>{"ที่อยู่ : "}</label>
                  {trackData.address} {trackData.group} {trackData.road}{" "}
                  {trackData.alley} {trackData.subdistrict}{" "}
                  {trackData.district} {trackData.province}
                </span>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <label style={{ fontWeight: "bold" }}>{"ช่องทางติดต่อ : "}</label>
                  {trackData.phone}
                </span>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <label style={{ fontWeight: "bold" }}>{"ประเภท : "}</label>
                  {trackData.type}
                </span>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <label style={{ fontWeight: "bold" }}>{"สำนัก/กอง ที่รับผิดชอบ : "}</label>
                  {trackData.sector}
                </span>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <label style={{ fontWeight: "bold" }}>{"เรื่องร้องทุกข์ : "}</label>
                  {trackData.detail}
                </span>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontWeight: "bold" }}>{"รูปภาพ : "}</label>
                  { trackData.image ? (
                    <img style={{ width: "80vw" }} src={trackData.image} alt="report"/>
                  ) : null }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="complain-form-container" style={{ marginBottom: "0.5rem" }}>
        <div className="complain-form-head">
          <p>{"ประวัติการปฎิบัติงาน"}</p>
        </div>
        <div style={{ marginTop: "1rem" }} className="complain-form-body-wrapper">
          <div className="complain-form-body">
            { trackData.history.map((elem) => {
              return (<div key={uuidv4().replaceAll("-", "")}>
                  <div className="complain-from-group">
                    <div className="complain-input-group">
                      <span style={{ display: "flex", flexWrap: "wrap" }}>
                        <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>{"วัน/เวลา : "}</label>
                        { new Date(elem.updatedAt).toLocaleString("th-TH", { dateStyle: "full", timeStyle: "medium"}) }
                      </span>
                    </div>
                  </div>
                  <div className="complain-from-group">
                    <div className="complain-input-group">
                      <span style={{ display: "flex", flexWrap: "wrap" }}>
                        <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>{"เจ้าหน้าที่ : "}</label>
                        {elem.staff}
                      </span>
                    </div>
                  </div>
                  <div className="complain-from-group">
                    <div className="complain-input-group">
                      <span style={{ display: "flex", flexWrap: "wrap" }}>
                        <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>{"รายละเอียด : "}</label>
                        {elem.detail}
                      </span>
                    </div>
                  </div>
                  <div className="complain-from-group">
                    <span style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ fontWeight: "bold" }}>{"รูปภาพ : "}</label>
                      {elem.image ? (
                        <img style={{ width: "80vw" }} src={elem.image} alt="history-image"/>
                      ) : null }
                    </span>
                  </div>
                <div className="horizontal-divider" style={{ marginBlock: "1rem" }}></div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>)}
  </>);
}

export default ComplainTrack;