function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        zIndex: "999",
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(20px)",
        overflow: "hidden",
      }}
    >
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loading;