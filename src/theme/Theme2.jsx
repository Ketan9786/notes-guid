/**
 * Shared design tokens — "Study Focus" palette.
 *
 * Why these colors for revision notes:
 * - Navy (not black) as the structural color: strong enough to separate
 *   sections at a glance, without the harshness of pure black-on-white.
 * - Cream background instead of stark white: reduces glare/eye-strain
 *   across long revision sessions, while staying neutral and readable.
 * - Gold/amber is the ONLY accent used for "pay attention here" — rule
 *   numbers, active nav state, progress fill. Because it's used nowhere
 *   else, it keeps doing its job as a flag instead of becoming wallpaper.
 * - Green/red are reserved exclusively for correct/incorrect — never used
 *   decoratively — so they stay meaningful the instant a student sees them.
 */

export const palette = {
  navy: "#0d1b2a",
  navyLight: "#1a2e44",
  gold: "#f4a700",
  amber: "#e07b00",
  cream: "#fdf6e3",
  paper: "#ffffff",
  mintBg: "#e6f7f2",
  green: "#14854f",
  redBg: "#fdecea",
  red: "#c0392b",
  border: "#e8e4d8",
  muted: "#7a869a",
};

// Drop-in MUI theme — wrap your app in <ThemeProvider theme={studyTheme}>
import { createTheme } from "@mui/material/styles";

export const studyTheme = createTheme({
  palette: {
    primary: { main: palette.navy, contrastText: palette.gold },
    secondary: { main: palette.gold, contrastText: palette.navy },
    success: { main: palette.green },
    error: { main: palette.red },
    background: { default: palette.cream, paper: palette.paper },
    text: { primary: palette.navy, secondary: palette.muted },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h3: { fontFamily: "'Baloo 2', cursive", fontWeight: 800 },
    h5: { fontFamily: "'Baloo 2', cursive", fontWeight: 800 },
    h6: { fontFamily: "'Baloo 2', cursive", fontWeight: 700 },
  },
});

export default palette;
