// component/math/ComingSoonPanel.jsx
import palette from "../../theme/Theme.jsx";

export default function ComingSoonPanel({ icon, title, desc }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 20px",
        color: palette.muted,
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: 12 }}>{icon}</div>
      <h2 style={{ color: palette.gold, margin: "0 0 8px" }}>{title}</h2>
      <p style={{ margin: 0, maxWidth: 420 }}>{desc}</p>
    </div>
  );
}
