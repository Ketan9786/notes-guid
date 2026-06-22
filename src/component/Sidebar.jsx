/**
 * Sidebar v2 — same menuData shape as before, restructured for clarity:
 * - Navy active state with gold text (matches NotesPage header) so the
 *   sidebar and content read as one product, not two different UIs.
 * - Chevron rotates instead of text appearing/disappearing — cheaper to
 *   parse at a glance which branches are open.
 * - A vertical guide line per nesting level so depth is visible even when
 *   several branches are expanded at once (the flat version made depth
 *   hard to track past 2 levels).
 * - Subject headers get an icon + uppercase eyebrow treatment so they read
 *   as section dividers, not just another clickable row.
 */

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import palette from "../theme/Theme.jsx"
import menuData from "../data/menuData.json";


// One row, reused for chapter/topic levels — keeps spacing & the chevron
// rotation logic in a single place instead of duplicated per level.
const Branch = ({ label, depth, open, onClick }) => (
  <ListItemButton
    onClick={onClick}
    sx={{
      ml: depth * 2,
      pl: 1.5,
      borderRadius: 2,
      mb: 0.25,
      borderLeft: depth > 0 ? `2px solid ${palette.border}` : "none",
      "&:hover": { bgcolor: "rgba(13,27,42,0.06)" },
      color:palette.cream
    }}
  >
    <ChevronRightIcon
      sx={{
        fontSize: 18,
        color: palette.muted,
        mr: 0.5,
        transition: "transform 0.2s ease",
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
      }}
    />
    <ListItemText
      primary={label}
      primaryTypographyProps={{
        fontWeight: depth === 0 ? 700 : 600,
        fontSize: depth === 0 ? "0.95rem" : "0.88rem",
        color: palette.navy,
      }}
    />
  </ListItemButton>
);

const Sidebar = () => {
  const [openChapter, setOpenChapter] = useState("");
  const [openTopic, setOpenTopic] = useState("");

  return (
    <Box
      sx={{
        width: 300,
        height: "100vh",
        position:"sticky",
        left: 0,
        top: 0,
        overflowY: "auto",
        borderRight: `1px solid ${palette.border}`,
        bgcolor: "#0B1825",
       
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <MenuBookIcon sx={{ color: palette.gold }} />
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.05rem",
              color: palette.cream,
              lineHeight: 1.1,
            }}
          >
            SSC CGL Notes
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: palette.cream, }}>
            Revision Library
          </Typography>
          <Divider sx={{height:"2px" ,color: palette.cream }}/>
        </Box>
      </Box>

      <List sx={{ p: 0 }}>
        {menuData.map((subject) => (
          <Box key={subject.subject} mb={1}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: palette.cream,
                px: 1,
                mb: 0.5,
              }}
            >
              {subject.subject}
            </Typography>

            <Box
              sx={{
                cursor: "pointer",
                px: 1,
                pb: 0.5,
              }}
            >
              {subject.chapters.map((chapter) => (
                <Box key={chapter.chapter}>
                  <Branch
                    label={chapter.chapter}
                    depth={0}
                    open={openChapter === chapter.chapter}
                    onClick={() =>
                      setOpenChapter(openChapter === chapter.chapter ? "" : chapter.chapter)
                    }
                  />

                  <Collapse in={openChapter === chapter.chapter}>
                    {chapter.topics.map((topic) => (
                      <Box key={topic.topic}>
                        <Branch
                          label={topic.topic}
                       
                          depth={1}
                          open={openTopic === topic.topic}
                          onClick={() =>
                            setOpenTopic(openTopic === topic.topic ? "" : topic.topic)
                          }
                        />

                        <Collapse in={openTopic === topic.topic}>
                          <Box sx={{ ml: 4, borderLeft: `2px solid ${palette.border}`, pl: 1 }}>
                            {topic.subTopics.map((subTopic) => (
                              <ListItemButton
                                key={subTopic.name}
                                component={NavLink}
                                to={subTopic.path}
                                sx={{
                                  borderRadius: 2,
                                  mb: 0.25,
                                  py: 0.6,
                                  fontSize: "0.85rem",
                                 color: palette.cream,
                                  "&:hover": { bgcolor: "rgba(13,27,42,0.06)" },
                                  "&.active": {
                                    bgcolor: palette.navy,
                                    color: palette.gold,
                                    fontWeight: 700,
                                    "& .MuiListItemText-primary": { color: palette.gold },
                                  },
                                }}
                              >
                                <ListItemText
                                  primary={subTopic.name}
                                  primaryTypographyProps={{ fontSize: "0.85rem" }}
                                />
                              </ListItemButton>
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    ))}
                  </Collapse>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
