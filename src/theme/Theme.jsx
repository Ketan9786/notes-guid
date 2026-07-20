// /**
//  * "Midnight Study" palette — a dark reading-room theme for notes revision.
//  *
//  * Design intent: this should feel like reading by a single desk lamp at
//  * night — deep ink surfaces, a warm gold "lamp light" accent, and only a
//  * trace of cream/parchment (kept to a couple of small highlight moments,
//  * never a background). No light-mode panels anywhere.
//  *
//  * Usage stays the same as before — just swap the import:
//  *   import palette from "../../theme/Theme.jsx";
//  */

// const palette = {
//   // Surfaces — everything here is dark. No "light card on dark page".
//   ink: "#0A0D12",        // page background, near-black
//   navy: "#10161F",        // primary panel/card surface
//   navyRaised: "#161D29",  // slightly raised surface (table headers, header bar)
//   navyHover: "#1B2330",   // hover / alternating row state

//   border: "#262F3D",      // hairline borders on dark surfaces
//   borderStrong: "#3A4456",

//   // Lamp-light gold — the signature accent, used for headings, badges,
//   // active states and the glow behind the header.
//   gold: "#D9B25C",
//   goldSoft: "rgba(217,178,92,0.12)",
//   goldGlow: "rgba(217,178,92,0.18)",

//   // Parchment — the ONE light tone in the palette. Reserved for tiny
//   // accent moments (a sticky-note chip, a highlighted phrase) — never a
//   // section background. Target: under 3% of any given screen.
//   cream: "#F2E9D8",

//   // Text
//   text: "#E9E6DD",         // primary text on dark surfaces
//   muted: "#8E96A3",        // secondary / caption text

//   // Semantic
//   green: "#7BD9A5",
//   mintBg: "rgba(123,217,165,0.10)",
//   red: "#FF8A80",
//   redBg: "rgba(255,138,128,0.10)",
//   amber: "#E8B85C",
// };

// export default palette;
/**
 * Sunrise Study Pro Theme
 * Drop-in replacement for Theme.jsx
 */

const palette = {
  ink: "#FFFFFF",
  navy: "#F7F9FC",
  navyRaised: "#FFFFFF",
  navyHover: "#EEF2F8",

  border: "#DCE3EE",
  borderStrong: "#B8C4D6",

  gold: "#D98E04",
  goldSoft: "rgba(217,142,4,0.10)",
  goldGlow: "rgba(217,142,4,0.22)",

  text: "#1A2233",
  textSoft: "#3E4A5F",
  muted: "#5B6B84",
  hint: "#7C8BA3",

  green: "#1E9E5A",
  greenBg: "rgba(30,158,90,.10)",

  red: "#E1483F",
  redBg: "rgba(225,72,63,.10)",

  amber: "#D98E04",
  amberBg: "rgba(217,142,4,.10)",

  blue: "#2C6FE2",
  blueBg: "rgba(44,111,226,.10)",

  cream: "#FFF7E8",

  shadow: "0 10px 30px rgba(20,30,50,.10)",
  glow: "0 0 30px rgba(44,111,226,.15)",
};

export default palette;