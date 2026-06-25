// component/gk/ComingSoonPanel.jsx
// ─────────────────────────────────────────────────────────
// Placeholder panel for tabs still in development.
// Props: icon, title, desc
// ─────────────────────────────────────────────────────────

import palette from "../../theme/Theme";

export default function ComingSoonPanel({ icon, title, desc }) {
  return (
    <div
      style={{
        background: palette.navy,
        border: `1px solid ${palette.border}`,
        borderRadius: 18,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "64px 32px",
          color: palette.muted,
        }}
      >
        <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 16 }}>{icon}</div>

        {/* "In Development" badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: 999,
            background: palette.accentBg,
            color: palette.accent,
            border: `1px solid ${palette.accentBorder}`,
            marginBottom: 16,
          }}
        >
          ⚙️ In Development
        </span>

        <h3
          style={{
            fontSize: "clamp(1.125rem, 1rem + 0.75vw, 1.5rem)",
            fontWeight: 600,
            color: palette.text,
            marginBottom: 8,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "clamp(0.875rem, 0.8rem + 0.35vw, 1rem)",
            maxWidth: "36ch",
            lineHeight: 1.7,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
