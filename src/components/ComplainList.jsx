import { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import Context from "../libs/Context";
import Loading from "../Pages/Loading";

function ComplainList() {
  const { user, mainURL } = useContext(Context);
  const [ data, setData ] = useState([]);
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(true);

  const convertProgress = symbol => {
    let progress = "";
    if (symbol === "c") {
      progress = "ดำเนินการแล้ว";
    } else if (symbol === "r") {
      progress = "อยู่ระหว่างดำเนินการ";
    } else if (symbol === "z") {
      progress = "ยกเลิก";
    } else if (symbol === "w") {
      progress = "รอดำเนินการ";
    }
    return progress;
  };
  
  const progressColor = symbol => {
    let color = "";
    if (symbol === "ดำเนินการแล้ว") {
      color = "#18C210";
    } else if (symbol === "อยู่ระหว่างดำเนินการ") {
      color = "#D76812";
    } else if (symbol === "ยกเลิก") {
      color = "#D71212";
    } else if (symbol === "รอดำเนินการ")  {
      color = "#1257D7";
    }
    return color;
  };

  const revokeHandle = async (id) => {
    try {
      let cf = confirm(`ยืนยันการยกเลิกเรื่องร้องทุกข์หมายเลข ${id}`);
      if(cf) {
        setLoading(true);
        await axios.put(`${mainURL}/report`, { id: id, progress: "z" }, {
          headers: { Authorization: localStorage.getItem("atks") }
        });
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const invokeHandle = async (id) => {
    try {
      let cf = confirm(`ยืนยันการเปลี่ยนสถานะเรื่องร้องทุกข์หมายเลข ${id}`);
      if(cf) {
        setLoading(true);
        await axios.put(`${mainURL}/report`, { id: id, progress: "w" }, {
          headers: { Authorization: localStorage.getItem("atks") }
        });
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await axios.get(`${mainURL}/report`, { headers: { Authorization: localStorage.getItem("atks") } });
      let data = results.data.map(elem => ({...elem, createdAt_: new Date(elem.createdAt).toLocaleString("th-TH", { dateStyle: "medium" }), progress_: convertProgress(elem.progress) }))
      setData(data);
      setLoading(false)
    } catch (error) {
      localStorage.removeItem("atks")
      console.log(error)
    }
  };

  useEffect(() => {
    if (localStorage.getItem("atks") 
    // && user.id && user.username && user.name && user.role
    ) {
      fetchData();
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filter, setFilter] = useState({
    createdAt: "",
    firstname: "",
    lastname: "",
    phone: "",
    detail: "",
    channel: "",
    sector: "",
    type: "",
    progress: ""
  });
  const [ pagination, setPagination ] = useState({ select: 1, row: 10 });
  const page = useMemo(() => {
    let productsFilter = data
      .filter((d) => new RegExp(filter.createdAt, "i").test([d["createdAt_"]]))
      .filter((d) => new RegExp(filter.firstname, "i").test([d["firstname"]]))
      .filter((d) => new RegExp(filter.phone, "i").test([d["phone"]]))
      .filter((d) => new RegExp(filter.detail, "i").test([d["detail"]]))
      .filter((d) => new RegExp(filter.channel, "i").test([d["channel"]]))
      .filter((d) => new RegExp(filter.sector, "i").test([d["sector"]]))
      .filter((d) => new RegExp(filter.type, "i").test([d["type"]]))
      .filter((d) => new RegExp(filter.progress, "i").test([d["progress_"]]));
    let page = Math.ceil(productsFilter.length / pagination.row) >= 1 ? Math.ceil(productsFilter.length / pagination.row) : 1;
    let elem = [];
    for (let num = 1; num <= page; num++) {
      elem.push(<button id={num} key={num} className={num === pagination.select ? "pagination-active" : ""} onClick={ e => setPagination({...pagination, select: parseInt(e.target.id)}) }>{num}</button>);
    }
    return elem;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.row, pagination.select, data.length, filter]);

  return (<>
    { loading ?
    <Loading />
    :
    <div className="complain-table-main-container">
      <div className="complain-table-wrapper">
        <h2>รายการเรื่องราวร้องทุกข์</h2>
        <table className="complain-table">
          <thead>
            <tr>
              <th>วันรับคำร้อง</th>
              <th>ชื่อ</th>
              <th>สกุล</th>
              <th>เบอร์โทร</th>
              <th>รายระเอียด</th>
              <th>ช่องทาง</th>
              <th>สำนัก/กอง</th>
              <th>ประเภท</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
            <tr>
              <th><input type="text" style={{ width: "4rem" }} onChange={ e => setFilter(prev => ({ ...prev, createdAt: e.target.value })) }/></th>
              <th><input type="text" style={{ width: "5rem" }} onChange={ e => setFilter(prev => ({ ...prev, firstname: e.target.value })) }/></th>
              <th><input type="text" style={{ width: "5rem" }} onChange={ e => setFilter(prev => ({ ...prev, lastname: e.target.value })) }/></th>
              <th><input type="text" style={{ width: "5rem" }} onChange={ e => setFilter(prev => ({ ...prev, phone: e.target.value })) }/></th>
              <th><input type="text" style={{ width: "10rem" }} onChange={ e => setFilter(prev => ({ ...prev, detail: e.target.value })) }/></th>
              <th><input type="text" style={{ width: "6rem" }} onChange={ e => setFilter(prev => ({ ...prev, channel: e.target.value })) }/></th>
              <th><input type="text" style={{ width: "6rem" }} onChange={ e => setFilter(prev => ({ ...prev, sector: e.target.value })) }/></th>
              <th><input type="text" style={{ width: "6rem" }} onChange={ e => setFilter(prev => ({ ...prev, type: e.target.value })) }/></th>
              <th><input type="text" style={{ width: "8rem" }} onChange={ e => setFilter(prev => ({ ...prev, progress: e.target.value })) }/></th>
              <th><input type="type" disabled style={{ width: "10rem", border: "none", outline: "none", backgroundColor: "transparent" }}/></th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((d) => new RegExp(filter.createdAt, "i").test([d["createdAt_"]]))
              .filter((d) => new RegExp(filter.firstname, "i").test([d["firstname"]]))
              .filter((d) => new RegExp(filter.phone, "i").test([d["phone"]]))
              .filter((d) => new RegExp(filter.detail, "i").test([d["detail"]]))
              .filter((d) => new RegExp(filter.channel, "i").test([d["channel"]]))
              .filter((d) => new RegExp(filter.sector, "i").test([d["sector"]]))
              .filter((d) => new RegExp(filter.type, "i").test([d["type"]]))
              .filter((d) => new RegExp(filter.progress, "i").test([d["progress_"]]))
              .slice(
                pagination.select * pagination.row - pagination.row,
                pagination.select * pagination.row
              )
              .map((elem) => {
                return (
                  <tr key={uuidv4().replaceAll("-", "")}>
                    <td>{elem.createdAt_}</td>
                    <td>{elem.firstname}</td>
                    <td>{elem.lastname}</td>
                    <td>{elem.phone}</td>
                    <td>{elem.detail}</td>
                    <td>{elem.channel}</td>
                    <td>{elem.sector}</td>
                    <td>{elem.type}</td>
                    <td>
                      <div style={{ textAlign: "center" }}>
                        <span style={{ 
                          backgroundColor: progressColor(elem.progress_), 
                          border: `1px solid ${progressColor(elem.progress_)}`, 
                          borderRadius: "1rem", 
                          fontWeight: "bold",
                          color: "#ffffff", 
                          padding: "0.25rem", 
                          textAlign: "center" 
                        }}>
                          {elem.progress_}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="complain-table-action">
                        <span style={{ display: elem.progress === "z" ? "none": "" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-list-task" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"/>
                            <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z" />
                            <path fillRule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"/>
                          </svg>
                          <Link to={"/detail"} state={{ data: elem }}>{"รายละเอียด/อัพเดตงาน"}</Link>
                        </span>
                        { elem.progress === "z" ?
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                            <Link onClick={ () => invokeHandle(elem.id) }>{"เปลี่ยนสถานะ"}</Link>
                          </span>  
                        :
                          elem.progress === "w" ?
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                              </svg>
                              <Link onClick={ () => revokeHandle(elem.id) }>{"ยกเลิก"}</Link>
                            </span> 
                          :
                            null 
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="complain-table-pagination">{page}</div>
    </div>
    }
  </>);
}

export default ComplainList;