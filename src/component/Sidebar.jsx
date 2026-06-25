/**
 * Sidebar v4 — Left-to-right slide open/close
 * - Collapsed: icon rail (56px)
 * - Expanded: slides open to 272px with full labels
 * - Toggle button on the rail
 * - All 3 levels collapsible inside when expanded
 * - Tooltips on icons when collapsed
 */

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import MenuBookIcon     from "@mui/icons-material/MenuBook";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuOpenIcon     from "@mui/icons-material/MenuOpen";
import MenuIcon         from "@mui/icons-material/Menu";
import palette from "../theme/Theme.jsx";
import menuData from "../data/menuData.json";

// ── tokens ─────────────────────────────────────────────────────
const SIDEBAR_BG  = "#0B1825";
const EXPANDED_W  = 272;
const COLLAPSED_W = 56;
const ACTIVE_BG   = "rgba(212,175,55,0.12)";
const HOVER_BG    = "rgba(255,255,255,0.05)";
const GUIDE       = "rgba(255,255,255,0.07)";
const GOLD_GUIDE  = "rgba(212,175,55,0.18)";

// ── Chevron ─────────────────────────────────────────────────────
const Chevron = ({ open, size = 14 }) => (
  <ChevronRightIcon
    sx={{
      fontSize: size,
      color: "rgba(255,255,255,0.28)",
      flexShrink: 0,
      transition: "transform 0.2s",
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
    }}
  />
);

// ── SubTopic leaf ───────────────────────────────────────────────
const SubTopicItem = ({ subTopic, sidebarOpen }) => (
  <Tooltip title={!sidebarOpen ? subTopic.name : ""} placement="right" arrow>
    <ListItemButton
      component={NavLink}
      to={subTopic.path}
      sx={{
        borderRadius: 1.5,
        py: 0.55,
        px: sidebarOpen ? 1.5 : 0.5,
        mb: 0.25,
        minHeight: 32,
        justifyContent: sidebarOpen ? "flex-start" : "center",
        color: "rgba(255,255,255,0.5)",
        position: "relative",
        transition: "padding 0.25s",
        "&:hover": { bgcolor: HOVER_BG, color: "rgba(255,255,255,0.85)" },
        "&.active": {
          bgcolor: ACTIVE_BG,
          color: palette.gold,
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: "15%",
            height: "70%",
            width: "2.5px",
            bgcolor: palette.gold,
            borderRadius: "0 2px 2px 0",
          },
          "& .MuiListItemText-primary": { color: palette.gold, fontWeight: 600 },
        },
      }}
    >
      {!sidebarOpen && (
        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.22)", flexShrink: 0 }} />
      )}
      {sidebarOpen && (
        <ListItemText
          primary={subTopic.name}
          primaryTypographyProps={{ fontSize: "0.82rem", lineHeight: 1.5, color: "inherit", noWrap: true }}
        />
      )}
    </ListItemButton>
  </Tooltip>
);

// ── Topic row (level 2) ─────────────────────────────────────────
const TopicRow = ({ topic, openTopic, setOpenTopic, sidebarOpen }) => {
  const isOpen = openTopic === topic.topic;
  return (
    <Box>
      <Tooltip title={!sidebarOpen ? topic.topic : ""} placement="right" arrow>
        <ListItemButton
          onClick={() => setOpenTopic(isOpen ? "" : topic.topic)}
          sx={{
            borderRadius: 1.5,
            py: 0.55,
            px: sidebarOpen ? 1.25 : 0.5,
            mb: 0.25,
            gap: 0.75,
            minHeight: 32,
            justifyContent: sidebarOpen ? "flex-start" : "center",
            color: "rgba(255,255,255,0.55)",
            transition: "padding 0.25s",
            "&:hover": { bgcolor: HOVER_BG },
          }}
        >
          {sidebarOpen && <Chevron open={isOpen} size={13} />}
          {!sidebarOpen && (
            <Box sx={{ width: 6, height: 6, borderRadius: 0.75, bgcolor: "rgba(255,255,255,0.18)" }} />
          )}
          {sidebarOpen && (
            <ListItemText
              primary={topic.topic}
              primaryTypographyProps={{
                fontSize: "0.83rem",
                fontWeight: 500,
                color: isOpen ? palette.cream : "rgba(255,255,255,0.55)",
                noWrap: true,
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>

      {sidebarOpen && (
        <Collapse in={isOpen} timeout={160} unmountOnExit>
          <Box sx={{ ml: 2, pl: 1, borderLeft: `1.5px solid ${GUIDE}` }}>
            {topic.subTopics.map((st) => (
              <SubTopicItem key={st.name} subTopic={st} sidebarOpen={sidebarOpen} />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

// ── Chapter row (level 1) ───────────────────────────────────────
const ChapterRow = ({ chapter, sidebarOpen }) => {
  const [open, setOpen]          = useState(false);
  const [openTopic, setOpenTopic] = useState("");

  return (
    <Box>
      <Tooltip title={!sidebarOpen ? chapter.chapter : ""} placement="right" arrow>
        <ListItemButton
          onClick={() => setOpen((v) => !v)}
          sx={{
            borderRadius: 1.5,
            py: 0.65,
            px: sidebarOpen ? 1.25 : 0.5,
            mb: 0.25,
            gap: 0.75,
            minHeight: 36,
            justifyContent: sidebarOpen ? "flex-start" : "center",
            transition: "padding 0.25s",
            color: "rgba(255,255,255,0.55)",
            "&:hover": { bgcolor: HOVER_BG },
          }}
        >
          {sidebarOpen && <Chevron open={open} />}
          {!sidebarOpen && (
            <Box sx={{ width: 7, height: 7, borderRadius: 0.5, bgcolor: "rgba(255,255,255,0.25)" }} />
          )}
          {sidebarOpen && (
            <>
              <ListItemText
                primary={chapter.chapter}
                primaryTypographyProps={{
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "#F5E6C8",
                  noWrap: true,
                }}
              />
              <Typography sx={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                {chapter.topics.length}
              </Typography>
            </>
          )}
        </ListItemButton>
      </Tooltip>

      {sidebarOpen && (
        <Collapse in={open} timeout={180} unmountOnExit>
          <Box sx={{ ml: 1.5, pl: 1, borderLeft: `1.5px solid ${GUIDE}` }}>
            {chapter.topics.map((topic) => (
              <TopicRow
                key={topic.topic}
                topic={topic}
                openTopic={openTopic}
                setOpenTopic={setOpenTopic}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

// ── Subject section (level 0) ───────────────────────────────────
const SubjectSection = ({ subject, sidebarOpen }) => {
  const [open, setOpen] = useState(true);

  return (
    <Box mb={0.5}>
      {sidebarOpen ? (
        <ListItemButton
          onClick={() => setOpen((v) => !v)}
          sx={{
            borderRadius: 1.5,
            py: 0.55,
            px: 1.25,
            mb: 0.5,
            gap: 0.75,
            "&:hover": { bgcolor: HOVER_BG },
          }}
        >
          <Chevron open={open} size={13} />
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: open ? palette.gold : "rgba(255,255,255,0.3)",
              flex: 1,
            }}
          >
            {subject.subject}
          </Typography>
          <Typography sx={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.18)" }}>
            {subject.chapters.length} ch
          </Typography>
        </ListItemButton>
      ) : (
        /* collapsed — gold dash as subject divider */
        <Tooltip title={subject.subject} placement="right" arrow>
          <Box
            sx={{
              width: 24, height: 2.5, borderRadius: 1,
              bgcolor: "rgba(212,175,55,0.35)",
              mx: "auto", mb: 1, mt: 0.5, cursor: "default",
            }}
          />
        </Tooltip>
      )}

      <Collapse in={!sidebarOpen || open} timeout={200}>
        <Box
          sx={{
            ml: sidebarOpen ? 0.5 : 0,
            pl: sidebarOpen ? 1 : 0,
            borderLeft: sidebarOpen ? `1.5px solid ${GOLD_GUIDE}` : "none",
            mb: 0.5,
          }}
        >
          {subject.chapters.map((chapter) => (
            <ChapterRow key={chapter.chapter} chapter={chapter} sidebarOpen={sidebarOpen} />
          ))}
        </Box>
      </Collapse>

      {sidebarOpen && (
        <Divider sx={{ borderColor: "rgba(255,255,255,0.04)", mx: 1, mb: 0.5 }} />
      )}
    </Box>
  );
};

// ── Root Sidebar ────────────────────────────────────────────────
const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        width: open ? EXPANDED_W : COLLAPSED_W,
        minWidth: open ? EXPANDED_W : COLLAPSED_W,
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        overflowY: "auto",
        overflowX: "hidden",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        bgcolor: SIDEBAR_BG,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease, min-width 0.25s ease",
        "&::-webkit-scrollbar": { width: 3 },
        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "rgba(255,255,255,0.07)",
          borderRadius: 2,
        },
      }}
    >
      {/* ── Brand header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: open ? 1.5 : 0,
          px: open ? 2 : 1,
          py: 1.75,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          justifyContent: open ? "flex-start" : "center",
          transition: "padding 0.25s, gap 0.25s",
        }}
      >
        <Box
          sx={{
            width: 34, height: 34, borderRadius: 1.5,
            bgcolor: "rgba(212,175,55,0.13)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MenuBookIcon sx={{ fontSize: 18, color: palette.gold }} />
        </Box>

        <Box
          sx={{
            overflow: "hidden",
            opacity: open ? 1 : 0,
            width: open ? "auto" : 0,
            transition: "opacity 0.18s, width 0.25s",
            whiteSpace: "nowrap",
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: "0.93rem", color: palette.cream, lineHeight: 1.2 }}>
            SSC CGL Notes
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.32)" }}>
            Revision Library
          </Typography>
        </Box>
      </Box>

      {/* ── Toggle button ── */}
      <Box
        sx={{
          px: open ? 1.5 : 0.5,
          py: 0.75,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          flexShrink: 0,
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          transition: "padding 0.25s",
        }}
      >
        <Tooltip title={open ? "Collapse" : "Expand"} placement="right" arrow>
          <IconButton
            onClick={() => setOpen((v) => !v)}
            size="small"
            sx={{
              color: "rgba(255,255,255,0.35)",
              bgcolor: "rgba(255,255,255,0.04)",
              borderRadius: 1.5,
              width: 28, height: 28,
              "&:hover": { bgcolor: "rgba(255,255,255,0.09)", color: palette.cream },
              transition: "all 0.15s",
            }}
          >
            {open
              ? <MenuOpenIcon sx={{ fontSize: 17 }} />
              : <MenuIcon     sx={{ fontSize: 17 }} />
            }
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Menu list ── */}
      <List sx={{ p: open ? 1.5 : 0.75, flex: 1, pt: 1 }}>
        {menuData.map((subject) => (
          <SubjectSection key={subject.subject} subject={subject} sidebarOpen={open} />
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
