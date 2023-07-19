import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useRef, useContext } from "react";
import { Title, Sector, Type, Channel } from "../libs/OptionList";
import { Province } from "../libs/ProvinceList";
import { District } from "../libs/DistrictList";
import { SubDistrict } from "../libs/SubDistrictList";
import axios from "axios";
import Context from "../libs/Context";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";

registerLocale("th", th);

function ComplainForm() {
  const generateID = uuidv4().replaceAll("-", "");
  const navigate = useNavigate();
  const { user, setSuccessDetail, mainURL } = useContext(Context);
  const [ uploadedFileName, setUploadedFileName ] = useState(null);
  const inputImgRef = useRef(null);
  const [ loading, setLoading ] = useState(false);
  const [ alert, setAlert ] = useState({ type: "", message: "" });
  const [ detailLen, setDetailLen ] = useState(0);
  const [ provinceSymbol, setProvinceSymbol ] = useState("");
  const [ districtSymbol, setDistrictSymbol ] = useState("");
  const [ subDistrictSymbol, setSubDistrictSymbol ] = useState("");
  const [ complainInfo, setComplainInfo ] = useState({
    id: generateID,
    card: "",
    title: "",
    firstname: "",
    lastname: "",
    address: "",
    village: "",
    road: "",
    alley: "",
    subdistrict: "",
    district: "",
    province: "",
    phone: "",
    email: "",
    line: "",
    detail: "",
    channel: "",
    sector: "",
    type: "",
    image: "",
    createdAt: new Date()
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
  for (let i = -5; i <= 40; i++) yearList.push(new Date().getFullYear() - i);
  yearList.sort();

  const saveButtonEnable = useMemo(() => {
    const list = [
      "card",
      "title",
      "firstname",
      "lastname",
      "address",
      "province",
      "district",
      "subdistrict",
      "phone",
      "detail"
    ];
    let stat = true;
    list.forEach(elem => {
      if(complainInfo[elem].length === 0) stat = false
    });
    return stat;
  }, [complainInfo]);

  const saveHandle = async () => {
    try {
      setLoading(true);
      setAlert({ type: "", message: "" });
      let data = { ...complainInfo };
      if (!user.id || data.channel == "") data.channel = "แจ้งผ่านเว็บไซต์";
      let result = await axios.post(`${mainURL}/report`, {
        ...complainInfo,
        channel: !user.id || complainInfo.channel == "" ? "แจ้งผ่านเว็บไซต์" : complainInfo.channel
      });
      if (result.status !== 200) throw new Error(result.data);
      setTimeout(() => {
        setLoading(false);
        setSuccessDetail({ message: "บันทึกข้อมูลเรียบร้อย", redirect: "/new" });
        navigate("/success", { state: {}, relative: true, replace: true });
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

  const cancelHandle = () => {
    setComplainInfo({
      id: "",
      card: "",
      title: "",
      firstname: "",
      lastname: "",
      address: "",
      village: "",
      road: "",
      alley: "",
      subdistrict: "",
      district: "",
      province: "",
      phone: "",
      email: "",
      line: "",
      detail: "",
      channel: "",
      sector: "",
      type: "",
      image: "",
      createdAt: new Date()
    });
    setUploadedFileName(null);
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

  const handleDisplayFileDetails = () => {
    if (!inputImgRef.current?.files[0]?.name) {
      setUploadedFileName(null);
      setComplainInfo(prev => ({ ...prev, image: "" }));
      return;
    }
    inputImgRef.current?.files && setUploadedFileName(inputImgRef.current.files[0].name);
    let reader = new FileReader();
    reader.readAsDataURL(inputImgRef.current.files[0]);
    reader.onload = function () {
      setComplainInfo(prev => ({ ...prev, image: reader.result }));
    };
    reader.onerror = function (error) {
      setAlert({ type: error.name, message: error.message });
    };
  };

  return (<>
    <div className="complain-form-container">
      <div className="complain-form-head">
        <button className="button-back" onClick={ () => { navigate(user.id ? "/list" : "/", { replace: true }) } }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </button>
        <p>{"บันทึกคำร้องทุกข์ใหม่"}</p>
      </div>
      <div className="complain-form-body-wrapper">
        <div className="complain-form-title">
          <h3 style={{ marginBottom: "-0.1rem" }}>{"ข้อมูลผู้ร้องทุกข์"}</h3>
          <small style={{ marginLeft: "0.3rem", fontSize: "0.75rem" }}>{"ช่องที่มี"}<span style={{ fontWeight: "bold", color: "red" }}> {"*"} </span>{"จำเป็นต้องกรอก"}</small>
        </div>
        <div className="complain-form-body">
          <div className="horizontal-divider"></div>
          <div className="complain-input-group">
            <label htmlFor="card">{"หมายเลขคำร้อง "}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span>{" (กรุณาบันทึกไว้)"}</label>
            <input readOnly id="id" style={{ width: "20rem" }} value={complainInfo.id}/>
          </div>
          <div className="complain-input-group">
            <label htmlFor="card">{"เลขบัตรประชาชน "}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
            <input id="card" maxLength={17} value={complainInfo.card} onChange={ e => { setComplainInfo(prev => ({...prev, card: isNaN(e.target.value) ? prev.card : e.target.value}))} }/>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <label htmlFor="title">{"คำนำหน้านาม "}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
              <div style={{ width: "10rem" }}>
                <Select placeholder="เลือก..." className="title-option" isSearchable={true} options={Title} onChange={ e => setComplainInfo(prev => ({ ...prev, title: e.value })) }/>
              </div>
            </div>
            <div className="complain-input-group">
              <label htmlFor="firstname">{"ชื่อ "}{" "}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
              <input id="firstname" maxLength={100} value={complainInfo.firstname} onChange={ e => setComplainInfo(prev => ({...prev, firstname: e.target.value})) }/>
            </div>
            <div className="complain-input-group">
              <label htmlFor="lastname">{"สกุล "}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
              <input id="lastname" maxLength={100} value={complainInfo.lastname} onChange={ e => setComplainInfo(prev => ({...prev, lastname: e.target.value})) }/>
            </div>
          </div>
          <div className="complain-from-group">
            <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
              <div className="complain-input-group">
                <label htmlFor="house">{"บ้านเลขที่ "}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
                <input id="house" style={{ width: "95%" }} maxLength={10} value={complainInfo.address} onChange={ e => setComplainInfo(prev => ({...prev, address: e.target.value})) }/>
              </div>
              <div className="complain-input-group">
                <label htmlFor="group">{"หมู่"}</label>
                <input id="group" style={{ width: "95%" }} maxLength={10} value={complainInfo.village} onChange={e => setComplainInfo(prev => ({...prev, village: e.target.value})) }/>
              </div>
            </div>
            <div className="complain-input-group">
              <label htmlFor="road">{"ถนน"}</label>
              <input id="road" maxLength={50} value={complainInfo.road} onChange={ e => setComplainInfo(prev => ({...prev, road: e.target.value})) }/>
            </div>
            <div className="complain-input-group">
              <label htmlFor="alley">{"ซอย"}</label>
              <input id="alley" maxLength={50} value={complainInfo.alley} onChange={ e => setComplainInfo(prev => ({...prev, alley: e.target.value })) }/>
            </div>
          </div>
           <div className="complain-from-group">
            <div className="complain-input-group">
              <label htmlFor="province">{"จังหวัด "}{" "}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
              <Select placeholder="เลือก..." className="province-option" isSearchable={true} name="province" options={Province}
                onChange={ e => { 
                  setComplainInfo(prev => ({...prev, district: "", province: e.value}));
                  setProvinceSymbol(e.symbol);
                  setDistrictSymbol("");
                } }
              />
            </div>
            <div className="complain-input-group">
              <label htmlFor="district">{"เขต / อำเภอ"}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
              <Select placeholder="เลือก..." className="district-option" isSearchable={true} name="district" 
                value={District.filter(elem => elem.symbol === districtSymbol)}
                options={District.filter(elem => elem.province === provinceSymbol)}
                onChange={ e => {
                  setComplainInfo(prev => ({...prev, subdistrict: "", district: e.value}));
                  setDistrictSymbol(e.symbol);
                  setSubDistrictSymbol("");
                } }
              />
            </div>
            <div className="complain-input-group">
              <label htmlFor="sub">{"แขวง / ตำบล"}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
              <Select placeholder="เลือก..." className="subdistrict-option" isSearchable={true} name="subdistrict"
                value={SubDistrict.filter(elem => elem.symbol === subDistrictSymbol)}
                options={SubDistrict.filter(elem => elem.district === districtSymbol)}
                onChange={ e => {
                  setComplainInfo(prev => ({...prev, subdistrict: e.value}));
                  setSubDistrictSymbol(e.symbol);
                } }
              />
            </div>
          </div>
          <div className="complain-from-group">
            <div className="complain-input-group">
              <label htmlFor="phone">{"เบอร์โทรศัพท์ "}<span style={{ fontWeight: "bold", color: "red" }}>{"*"}</span></label>
              <input id="phone" style={{ width: "9rem" }} maxLength={12} value={complainInfo.phone}
                onChange={ e => setComplainInfo(prev => ({...prev, phone: isNaN(e.target.value) ? prev.phone : e.target.value})) }
              />
            </div>
            <div className="complain-input-group">
              <label htmlFor="email">{"Email"}</label>
              <input id="email" maxLength={50} value={complainInfo.email} 
                onChange={ e => setComplainInfo(prev => ({...prev, email: e.target.value})) }
              />
            </div>
            <div className="complain-input-group">
              <label htmlFor="line">{"Line ID"}</label>
              <input id="line" style={{ width: "10rem" }} maxLength={50} value={complainInfo.line}
                onChange={ e => setComplainInfo(prev => ({...prev, line: e.target.value})) }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="complain-form-body-wrapper">
        <div className="complain-form-body">
          <div className="horizontal-divider"></div>
          <div className="complain-input-group">
            <label htmlFor="details">{"รายละเอียดการร้องทุกข์"}<span style={{ fontWeight: "bold", color: "red" }}>{" * "}</span></label>
            <textarea maxLength={1000} id="details" type="text" rows={10} value={complainInfo.detail}
              onChange={ e => {
                setDetailLen(e.target.value.length);
                setComplainInfo(prev => ({...prev, detail: e.target.value}));
              } }
            />
            <small style={{ fontSize: "0.7rem", color: "#a0a0a0", marginTop: "-0.5rem" }}>
              {"("}
              <span style={{ color: detailLen === 1000 ? "#ff0027" : "#a0a0a0" }}>{detailLen}</span>
              {"/"}
              <span style={{ color: detailLen === 1000 ? "#ff0027" : "#a0a0a0" }}>{"1000"}</span>
              {" ตัวอักษร)"}
            </small>
          </div>
           <div className="complain-input-group">
            <label htmlFor="image">{"อัพโหลดรูปภาพ"}</label>
            <input hidden type="file" id="image" ref={inputImgRef} onChange={handleDisplayFileDetails}/>
            <div style={{ marginBlock: "0.5rem", display: "flex", alignItems: "center" }}>
              <label className="complaim-image-upload-button" htmlFor="image">Choose File</label>
              <span className="image-chosen">{uploadedFileName || "No file chosen"}</span>
            </div>
          </div>
          <div className="image-upload-preview">
            {uploadedFileName ? (
              <img width={250} src={complainInfo.image ? complainInfo.image : null} alt={uploadedFileName.substring(0, uploadedFileName.lastIndexOf("."))}/>
            ) : null}
          </div>
          <div className="horizontal-divider"></div>
        </div>
      </div>
      { localStorage.getItem("atks") && user.id && user.username && user.name && user.role ? (
        <div className="complain-form-body-wrapper">
          <div className="complain-form-body">
            <div className="horizontal-divider"></div>
            <div className="complain-input-group">
              <label htmlFor="details"><b>{"เลือกสำนัก/กอง ที่รับผิดชอบการแก้ปัญหานี้"}</b></label>
              <div className="complain-from-group">
                <div className="complain-input-group">
                  <label htmlFor="sector">{"สำนัก/กอง "}</label>
                  <Select placeholder="เลือก..." className="sector-option" isSearchable={true} name="sector" options={Sector}
                    onChange={ e => setComplainInfo(prev => ({...prev, sector: e.value})) }
                  />
                </div>
                <div className="complain-input-group">
                  <label htmlFor="type">{"ประเภทเรื่องร้องทุกข์"}</label>
                  <Select placeholder="เลือก..." className="type-option" isSearchable={true} name="type" options={Type}
                    onChange={ e => setComplainInfo(prev => ({ ...prev, type: e.value })) }
                  />
                </div>
              </div>
              <div className="complain-from-group">
                <div className="complain-input-group">
                  <label htmlFor="channel">{"ช่องทางร้องทุกข์ "}</label>
                  <Select placeholder="เลือก..." className="channel-option" isSearchable={true} name="channel" options={Channel}
                    onChange={ e => setComplainInfo(prev => ({...prev, channel: e.value})) }
                  />
                </div>
                <div className="complain-input-group">
                  <label htmlFor="createdAt">{"วันที่รับคำร้อง"}</label>
                  <DatePicker className="datePicker" showTimeSelect showIcon disabledKeyboardNavigation
                    timeFormat="HH:mm" timeIntervals={5} timeCaption="time"
                    dateFormat="dd/M/yyyy HH:mm" locale={"th"}
                    renderCustomHeader={ ({ date, changeYear, changeMonth }) => (
                      <div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
                        <select value={new Date(date).getFullYear()} onChange={ ({ target: { value } }) => changeYear(parseInt(value)) }>
                          { yearList.map(item => (<option key={item} value={item}>{item + 543}</option>)) }
                        </select>
                        <select value={Object.keys(months[months.findIndex(item => item == months[new Date(date).getMonth()])])[0]}
                          onChange={ ({ target: { value } }) => {
                            let index = months.findIndex(item => Object.keys(item) == value);
                            changeMonth(index);
                          } }
                        >
                          { months.map(item => (<option key={Object.keys(item)} value={Object.keys(item)}>{item[Object.keys(item)]}</option>)) }
                        </select>
                      </div>
                    )}
                    selected={complainInfo.createdAt}
                    onChange={ d => { setComplainInfo({ ...complainInfo, createdAt: d }) }}
                  />
                </div>
              </div>
            </div>
            <div className="horizontal-divider"></div>
          </div>
        </div>
      ) : null}
      <div className="complain-form-footer">
        <div>
          <button disabled={!saveButtonEnable} className={saveButtonEnable ? "complain-save-button":"complain-disable-button"} onClick={saveHandle}>
            { loading ? (
              <div style={{ marginTop: "-0.4rem" }} className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              "บันทึก"
            ) }
          </button>
          <button className="complain-cancel-button" onClick={cancelHandle}>{"ยกเลิก"}</button>
        </div>
        <div>
          <AlertBadge />
        </div>
      </div>
    </div>
  </>);
}

export default ComplainForm;