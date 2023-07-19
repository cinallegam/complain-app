import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Context from "../libs/Context";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("th", th);
function ComplainDetail() {
  const navigate = useNavigate();
  const { user, mainURL } = useContext(Context);
  const { state } = useLocation();
  const [ loading, setLoading ] = useState(false);
  const [ historyStore, setHistoryStore ] = useState([]);
  const [ alert, setAlert ] = useState({ type: "", message: "" });
  const [ uploadedFileName, setUploadedFileName ] = useState(null);
  const inputImgRef = useRef(null);
  const [ detailLen, setDetailLen ] = useState(0);
  const [ dataProgress, setDataProgress ] = useState(state?.data.progress || "c");
  const [ isChecked, setIsChecked ] = useState(false);
  const handleOnChange = () => setIsChecked(!isChecked);
  const [ history, setHistory ] = useState({
    id: uuidv4().replaceAll("-", ""),
    rid: state?.data.id || "",
    detail: "",
    image: "",
    staff: user.name,
    updatedAt: new Date()
  });

  const months = [
    { January: "มกราคม" },
    { February: "กุมภาพันธ์" },
    { March: "มีนาคม" },
    { April: "เมษายน" },
    { May: "พฤษภาคม" },
    { June: "มิถุนายน" },
    { July: "กรกฎาคม" },
    { August: "สิงหาคม" },
    { September: "กันยายน" },
    { October: "ตุลาคม" },
    { November: "พฤศจิกายน" },
    { December: "ธันวาคม" }
  ];

  const yearList = [];
  for (let i = -5; i <= 5; i++) yearList.push(new Date().getFullYear() - i);
  yearList.sort();

  const fetchHistory = async () => {
    const results = await axios.get(`${mainURL}/history/${state?.data.id}`, {
      headers: { Authorization: localStorage.getItem("atks") },
    });
    setHistoryStore(results.data);
  };

  useEffect(() => {
    if (localStorage.getItem("atks") && user.id && user.username && user.name && user.role && state?.data.id) {
      fetchHistory();
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisplayFileDetails = () => {
    if (!inputImgRef.current?.files[0]?.name) {
      setUploadedFileName(null);
      setHistory(prev => ({ ...prev, image: "" }));
      return;
    }
    inputImgRef.current?.files && setUploadedFileName(inputImgRef.current.files[0].name);
    let reader = new FileReader();
    reader.readAsDataURL(inputImgRef.current.files[0]);
    reader.onload = function () {
      setHistory(prev => ({ ...prev, image: reader.result }));
    };
    reader.onerror = function (error) {
      setAlert({ type: error.name, message: error.message });
    };
  };

  const cancelHandle = () => {
    setHistory({
      id: uuidv4().replaceAll("-", ""),
      rid: state?.data.id,
      detail: "",
      image: "",
      staff: user.name,
      updatedAt: new Date(),
    });
    setUploadedFileName(null);
    setIsChecked(false);
  };

  const saveHandle = async () => {
    try {
      setLoading(true);
      setAlert({ type: "", message: "" });
      let result = await axios.post(`${mainURL}/history`, {...history}, {
        headers: { Authorization: localStorage.getItem("atks") }
      });
      if (result.status !== 200) throw new Error(result.data);
      let progress = dataProgress;
      if (isChecked) {
        await axios.put(`${mainURL}/report`, { id: state?.data.id, progress: "c" }, {
          headers: { Authorization: localStorage.getItem("atks") }
        });
        progress = "c";
      } else {
        await axios.put(`${mainURL}/report`, { id: state?.data.id, progress: "r" }, {
            headers: { Authorization: localStorage.getItem("atks") }
        });
        progress = "r";
      }
      setTimeout(() => {
        setLoading(false);
        cancelHandle();
        setAlert({ type: "success", message: "บันทึกข้อมูลเรียบร้อย" });
        fetchHistory();
        setDataProgress(progress);
        state.data.progress = progress;
      }, 2000);
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

  const saveButtonEnable = useMemo(() => {
    const list = ["id", "rid", "detail", "staff", "updatedAt"];
    let stat = true;
    list.forEach(elem => {
      if(history[elem].length === 0) stat = false
    });
    return stat;
  }, [history]);

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

  return (<>
    <div className="complain-form-container">
      <div className="complain-form-head">
        <button className="button-back" onClick={ () => navigate("/list", { replace: true })}>
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
                <label style={{ fontWeight: "bold" }}>{"ผู้ร้องทุกข์ : "}</label>
                {state?.data.title}{state?.data.firstname}{" "}{state?.data.lastname}
              </span>
            </div>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <label style={{ fontWeight: "bold" }}>{"วัน/เวลาที่ร้อง : "}</label>
                {state?.data.createdAt ? 
                  new Date(state?.data.createdAt).toLocaleString("th-TH", { dateStyle: "full", timeStyle: "medium" })
                  :
                  "ไม่มี"
                }
              </span>
            </div>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <span
                style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <label style={{ fontWeight: "bold" }}>{"ที่อยู่ : "}</label>
                {state?.data.address} หมู่ {state?.data.village} ถนน
                {state?.data.road} ซอย
                {state?.data.alley} ตำบล{state?.data.subdistrict} อำเภอ
                {state?.data.district} จังหวัด{state?.data.province}
              </span>
            </div>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <span
                style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <label style={{ fontWeight: "bold" }}>{"ช่องทางติดต่อ : "}</label>
                {state?.data.phone}
              </span>
            </div>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <label style={{ fontWeight: "bold" }}>{"ประเภท : "}</label>
                {state?.data.type}
              </span>
            </div>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <span
                style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <label style={{ fontWeight: "bold" }}>{"สำนัก/กอง ที่รับผิดชอบ : "}</label>
                {state?.data.sector}
              </span>
            </div>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <span style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <label style={{ fontWeight: "bold" }}>{"เรื่องร้องทุกข์ : "}</label>
                {state?.data.detail}
              </span>
            </div>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <span style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold" }}>{"รูปภาพ : "}</label>
                {state?.data.image ? (
                  <img style={{ width: "80vw" }} src={state?.data.image} alt="report-image"/>
                ) : (
                  ""
                )}
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
          { historyStore.map(elem => {
            return (<div key={uuidv4().replaceAll("-", "")}>
              <div className="complain-from-group">
                <div className="complain-input-group">
                  <span style={{ display: "flex", flexWrap: "wrap" }}>
                    <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>{"วัน/เวลา : "}</label>
                    {new Date(elem.updatedAt).toLocaleString("th-TH", { dateStyle: "full", timeStyle: "medium" })}
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
                  { elem.image ? (
                    <img style={{ width: "80vw" }} src={elem.image} alt="history-image"/>
                  ) : (
                    null
                  )}
                </span>
              </div>
              <div className="horizontal-divider" style={{ marginBlock: "1rem" }}></div>
            </div>);
          }) }
        </div>
      </div>
    </div>
    { dataProgress == "w" || dataProgress == "r" ? (
      <div className="complain-form-container" style={{ marginBottom: "0.5rem" }}>
        <div className="complain-form-head">
          <p>{"อัพเดตการปฎิบัติงาน"}</p>
        </div>
        <div style={{ marginTop: "1rem" }} className="complain-form-body-wrapper">
          <div className="complain-form-body">
            <div className="complain-from-group">
              <div className="complain-input-group">
                <label htmlFor="staff">{"เจ้าหน้าที่"}</label>
                <input readOnly type="text" id="staff" style={{ width: "50%" }} value={user.name}/>
              </div>
            </div>
            <div className="complain-from-group">
              <div className="complain-input-group">
                <label htmlFor="staff">{"วัน/เวลา"}</label>
                <DatePicker className="datePicker" showTimeSelect showIcon disabledKeyboardNavigation
                  timeFormat="HH:mm" timeIntervals={5} timeCaption="time" 
                  dateFormat="dd/M/yyyy HH:mm" locale={"th"}
                  renderCustomHeader={({ date, changeYear, changeMonth }) => (
                    <div style={{ marginBlock: "0.25rem", display: "flex", justifyContent: "center" }}>
                      <select
                        style={{ borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px", border: "1px solid #cccccc", outline: "none" }}
                        value={new Date(date).getFullYear()}
                        onChange={ ({ target: { value } }) => changeYear(parseInt(value)) }
                      >
                        {yearList.map((item) => (<option key={item} value={item}>{item + 543}</option>))}
                      </select>
                      <select
                        style={{ borderTopRightRadius: "4px", borderBottomRightRadius: "4px", border: "1px solid #cccccc", outline: "none" }}
                        value={Object.keys(months[months.findIndex(item => item == months[new Date(date).getMonth()])])[0]}
                        onChange={({ target: { value } }) => {
                          let index = months.findIndex(item => Object.keys(item) == value);
                          changeMonth(index);
                        }}
                      >
                        {months.map((item) => (<option key={Object.keys(item)} value={Object.keys(item)}>{item[Object.keys(item)]}</option>))}
                      </select>
                    </div>
                  )}
                  selected={history.updatedAt}
                  onChange={ d => { setHistory({ ...history, updatedAt: d }) } }
                />
              </div>
            </div>
            <div className="complain-from-group">
              <span style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <div className="horizontal-divider" style={{ marginTop: "0.5rem" }}></div>
                <div className="complain-input-group">
                  <label htmlFor="details">
                    {"รายละเอียดการปฎิบัติงาน"}
                    <span style={{ fontWeight: "bold", color: "red" }}>{" * "}</span>
                  </label>
                  <textarea maxLength={1000} id="details" type="text" rows={10}
                    onChange={ e => {
                      setDetailLen(e.target.value.length); 
                      setHistory(prev => ({ ...prev, detail: e.target.value }));
                    } }
                    value={history.detail}
                  />
                  <small style={{ fontSize: "0.7rem", color: "#a0a0a0", marginTop: "-0.5rem" }}>
                    {"("}
                    <span style={{ color: detailLen === 1000 ? "#ff0027" : "#a0a0a0" }}>{detailLen}</span>
                    {"/"}
                    <span style={{ color: detailLen === 1000 ? "#ff0027" : "#a0a0a0" }}>{"1000"}</span>
                    {" ตัวอักษร)"}
                  </small>
                </div>
                <div className="horizontal-divider"></div>
                <div className="complain-input-group">
                  <label htmlFor="image">{"อัพโหลดรูปภาพ"}</label>
                  <input hidden type="file" id="image" ref={inputImgRef} onChange={handleDisplayFileDetails}/>
                  <div style={{ marginBlock: "0.5rem", display: "flex", alignItems: "center" }}>
                    <label className="complaim-image-upload-button" htmlFor="image">Choose File</label>
                    <span className="image-chosen">{uploadedFileName || "No file chosen"}</span>
                  </div>
                </div>
                <div className="image-upload-preview">
                  { uploadedFileName ? (
                    <img width={250} src={history.image ? history.image : null} alt={uploadedFileName.substring(0, uploadedFileName.lastIndexOf("."))}/>
                  ) : null}
                </div>
                <div>
                  <input type="checkbox" id="completed" name="completed" value="completed" checked={isChecked} onChange={handleOnChange}/>
                  <label className="" htmlFor="checkbox">{" ดำเนินการแก้ปัญหาเสร็จสิ้นแล้ว (ปิดงาน)"}</label>
                </div>
                <div className="horizontal-divider" style={{ marginBlock: "0.3rem" }}></div>
                <div className="complain-form-footer" style={{ marginTop: "1rem", marginLeft: "0rem" }}>
                  <div>
                    <button disabled={!saveButtonEnable} onClick={saveHandle} className={ saveButtonEnable ? "complain-save-button" : "complain-disable-button" }>
                      { loading ? (
                        <div className="lds-ring" style={{ marginTop: "-0.4rem" }}>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        "บันทึก"
                      )}
                    </button>
                  </div>
                  <div><AlertBadge /></div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="complain-form-container" style={{ marginBottom: "0.5rem", borderColor: "#5C8984" }}>
        <div className="complain-form-head" style={{ backgroundColor: "#5C8984" }}>
          <p>{"ดำเนินการเสร็จเรียบร้อย"}</p>
        </div>
      </div>
    ) }
  </>);
}

export default ComplainDetail;
