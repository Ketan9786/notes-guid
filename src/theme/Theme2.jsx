/**
 * theme/Theme.jsx
 * "Midnight Study" palette — dark-first, lamp-lit accents.
 * Extended with a per-section accent map so different topics (Types,
 * Rules, Countability, Possession, Traps, Strategy…) read like different
 * colored tabs/bookmarks in the same night-time notebook, without ever
 * introducing a light/white surface. Cream stays reserved for the single
 * bookmark-ribbon signature element in the header.
 */

const palette = {
  // base surfaces
  ink: "#0b0e14",          // page background — darkest
  navy: "#12161f",         // card/panel background
  navyRaised: "#171c27",   // headers, table heads, raised surfaces

  // borders
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.16)",

  // text
  text: "#e7e6e2",
  muted: "#9aa0ac",

  // signature accents
  gold: "#d9b25c",
  goldSoft: "rgba(217,178,92,0.12)",
  goldGlow: "rgba(217,178,92,0.22)",
  amber: "#e8c179",
  cream: "#f3e9d2",        // reserved — bookmark ribbon only, ~2-3% of page

  // semantic
  green: "#7bd9a5",
  mintBg: "rgba(123,217,165,0.08)",
  red: "#e2726f",
  redBg: "rgba(226,114,111,0.08)",

  // extra section accents (dark-safe — used only as borders/text/glow, never fills)
  purple: "#b48ce0",
  purpleBg: "rgba(180,140,224,0.08)",
  blue: "#7ba7e8",
  blueBg: "rgba(123,167,232,0.08)",
  orange: "#e0a15f",
  orangeBg: "rgba(224,161,95,0.08)",
  pink: "#e084ad",
  pinkBg: "rgba(224,132,173,0.08)",
  teal: "#5fc8c0",
  tealBg: "rgba(95,200,192,0.08)",
};

export default palette;
