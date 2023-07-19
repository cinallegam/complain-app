import { useContext } from "react";
import Context from "../libs/Context";

function ProfileStaff() {
  const { user } = useContext(Context);
  return (<div style={{ marginBlock: "3rem", display: "flex", flexDirection: "column", alignItems: "center", width: "100vw", gap: "1rem" }}>
    <div style={{ border: "1px solid var(--border-input)", borderRadius: "4px", width: "50%", paddingBlock: "1rem", paddingInline: "3rem", display: "flex", flexDirection: "column" }}>
      <p><b>ID: </b>{user.id.substring(0, 10)}......{user.id.slice(-10)}</p>
      <p><b>Username: </b>{user.username}</p>
      <p><b>Name: </b>{user.name}</p>
      <p><b>Role: </b>{user.role}</p>
    </div>
  </div>);
}

export default ProfileStaff;