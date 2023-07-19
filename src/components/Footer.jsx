function Footer() {
  return (<footer>
    <div style={{
      position: "static",
      zIndex: "999",
      width: "100%",
      height: "auto",
      minHeight: "5rem",
      backgroundColor: "#eaeaea",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <p>{"Copyright"} &#xA9; {"2023 Cinallegam. All Right Reserved"}</p>
      <small>{"Powered by Vite Framework and React"}</small>
    </div>
  </footer>);
}

export default Footer;