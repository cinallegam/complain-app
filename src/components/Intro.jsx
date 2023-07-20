import { useNavigate } from "react-router-dom";

function Intro() {
  const navigate = useNavigate();
  const toComplainNew = () => navigate("/new", { replace: true });
  const toComplainTrack = () => navigate("/track", { replace: true });

  return (<>
    <div className="complain-form-container">
      <div className="complain-form-head" style={{ height: "1rem" }}></div>
      <div className="complain-form-body-wrapper">
        <div className="complain-form-title">
          <h3 style={{ marginBottom: "-0.1rem" }}>{"ยินดีต้อนรับ"}</h3>
        </div>
        <div className="complain-form-body">
          <div className="complain-input-group">
            <label style={{ fontWeight: "bold", fontSize: "16px" }}>{"ข้อแนะนำเบื้องต้นในการร้องเรียนปัญหา"}</label>
          </div>
          <div className="horizontal-divider" style={{ marginBottom: "0.5rem" }}></div>
          <div className="complain-input-group">
            <label>
              {"1. ระบบเรื่องราวร้องทุกข์ จัดทำขึ้นเพื่อเป็นช่องทางให้ประชาชนทั่วไปที่ได้รับความเดือดร้อนเข้ามาร้องเรียน ร้องทุกข์ หรือมีข้อเสนอแนะที่ดีมีประโยชน์ต่อสังคมและได้รับความช่วยเหลือในเรื่องที่ได้รับความเดือดร้อนหรือนำข้อเสนอแนะมาปรับใช้หรือปรับปรุงให้ที่ดียิ่งขึ้น โดยต้องเป็นเรื่องที่สามารถทำได้จริง"}
            </label>
          </div>
          <div className="complain-input-group">
            <label>
              {"2. เรื่องร้องเรียน ร้องทุกข์ ที่ประชาชนร้องเรียนมาต้องเป็นข้อเท็จจริงที่เกิดขึ้นจริง และต้องไม่เป็นข้อความที่ทำให้ผู้อื่นเสียหาย ทั้งนี้ หากข้อความร้องเรียนไม่เป็นความจริงหรือเป็นข้อความที่ก่อให้ผู้อื่นได้รับความเสียหาย ท่านอาจมีความผิดตาม พ.ร.บ. ว่าด้วยการกระทำผิดทางคอมพิวเตอร์ พ.ศ.2550 ซึ่งมีโทษปรับหรือจำคุก"}
            </label>
          </div>
          <div className="complain-input-group">
            <label>
              {"3. ในการร้องเรียนต้องระบุชื่อ - นามสกุล เลขบัตรประจำตัวประชาชน อีเมล และเบอร์ติดต่อของท่านจริงเท่านั้น หากปรากฎว่าท่านร้องเรียน หรือร้องทุกข์ โดยไม่ระบุข้อมูลที่สามารถติดต่อกลับได้ ทางหน่วยงานข้อสงวนสิทธิ์ ไม่รับพิจารณาข้อร้องเรียนนั้น และจะทำการลบข้อร้องเรียนของท่าน"}
            </label>
          </div>
          <div className="horizontal-divider" style={{ marginTop: "0.5rem" }}></div>
        </div>
      </div>
      <div className="complain-form-footer">
        <div>
          <button className="complain-save-button" onClick={toComplainNew}>{"ส่งคำร้องทุกข์"}</button>
          <button className="complain-save-button" onClick={toComplainTrack}>{"ติดตามเรื่องร้องทุกข์"}</button>
        </div>
      </div>
    </div>
  </>);
}

export default Intro;