import "./LoaderOverlay.css";
import loader from "../assets/loader.png";
export default function LoaderOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        color: "#fff",
        fontSize: "18px",
        fontWeight: "600",
      }}
    >
      {/* <span className="loader"></span> */}
      {/* <span>Loading....</span> */}
      <img src={loader} />
    </div>
  );
}
