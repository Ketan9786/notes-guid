/**
 * MindMapPage — "Midnight Study" theme, same data schema as NotesPage
 * (noun.json etc.). No new JSON shape.
 *
 * REWRITE NOTES (v2):
 * The old radial "mind map" canvas looked nice but was bad for actual
 * revision — tapping a branch opened detail content *below* a tall
 * circular diagram, so you had to scroll down every single time just
 * to read it. For quick revision you want: click → answer is right
 * there, no scrolling, no losing your place.
 *
 * New structure is a fixed-height two-pane "study panel" (sidebar list
 * + detail reader), the way docs/reference sites are laid out:
 *   - Left: every section listed as a single vertical menu (always
 *     visible, always in the same place).
 *   - Right: the content for whatever is selected, scrolls internally
 *     if long, but the pane itself never moves.
 * On phones the sidebar becomes a horizontal chip strip pinned above
 * the detail pane — still zero page-scrolling to "get to" content.
 * Prev/Next controls let you walk the whole topic in order, which is
 * the actual revision motion (go section by section, then sub-item by
 * sub-item) instead of hunting around a diagram.
 *
 * Usage:
 *   import { ThemeProvider } from "@mui/material/styles";
 *   import { studyTheme } from "./theme";
 *   import data from "./noun.json";
 *
 *   <ThemeProvider theme={studyTheme}>
 *     <MindMapPage data={data} />
 *   </ThemeProvider>
 */

import { useMemo, useState } from "react";
import { Box, Typography, Chip, IconButton, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import palette from "../../theme/Theme.jsx";

const FONT_DISPLAY = '"Source Serif Pro", Georgia, "Times New Roman", serif';
const FONT_BODY =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ---------- shared bits (kept local so this file drops in standalone) ----------

const FormulaBox = ({ children }) => (
  <Box
    sx={{
      bgcolor: "rgba(217,178,92,0.06)",
      borderLeft: `3px solid ${palette.gold}`,
      borderRadius: "0 8px 8px 0",
      px: 2,
      py: 1.5,
      mb: 2,
      fontSize: "0.95rem",
      lineHeight: 1.7,
      color: palette.text,
      fontFamily: FONT_BODY,
    }}
  >
    {children}
  </Box>
);

const TagWrap = ({ tags }) => {
  if (!tags?.length) return null;
  return (
    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
      {tags.map((t, i) => (
        <Chip
          key={i}
          label={t}
          size="small"
          sx={{
            bgcolor: palette.mintBg,
            color: palette.green,
            border: `1px solid rgba(123,217,165,0.3)`,
            fontWeight: 600,
            fontFamily: FONT_BODY,
          }}
        />
      ))}
    </Box>
  );
};

const ExampleBlock = ({ wrong, right }) => (
  <Box
    sx={{
      bgcolor: "rgba(255,255,255,0.02)",
      border: `1px solid ${palette.border}`,
      borderRadius: 2,
      overflow: "hidden",
      mb: 1.5,
    }}
  >
    {wrong && (
      <Box sx={{ borderLeft: `3px solid ${palette.red}`, px: 2, py: 1, bgcolor: palette.redBg }}>
        <Typography
          variant="body2"
          sx={{ color: palette.red, textDecoration: "line-through", fontFamily: FONT_BODY, opacity: 0.85 }}
        >
          {wrong}
        </Typography>
      </Box>
    )}
    {right && (
      <Box sx={{ borderLeft: `3px solid ${palette.green}`, px: 2, py: 1, bgcolor: palette.mintBg }}>
        <Typography variant="body2" sx={{ color: palette.green, fontWeight: 600, fontFamily: FONT_BODY }}>
          {right}
        </Typography>
      </Box>
    )}
  </Box>
);

const WrongRightList = ({ pairs }) => (
  <Box>
    {pairs.map((p, i) => (
      <ExampleBlock key={i} wrong={p.wrong} right={p.right} />
    ))}
  </Box>
);

const RuleTable = ({ rows, tableType }) => (
  <Box sx={{ mb: 2, borderRadius: 2, border: `1px solid ${palette.border}`, overflow: "hidden" }}>
    <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_BODY }}>
      <Box component="thead">
        <Box component="tr" sx={{ bgcolor: palette.navyRaised }}>
          <Box component="th" sx={th}>Singular</Box>
          {tableType === "meaningChange" && <Box component="th" sx={th}>Meaning</Box>}
          <Box component="th" sx={th}>Plural</Box>
          {tableType === "meaningChange" && <Box component="th" sx={th}>Meaning</Box>}
        </Box>
      </Box>
      <Box component="tbody">
        {rows.map((r, i) => (
          <Box component="tr" key={i} sx={{ bgcolor: i % 2 ? "rgba(255,255,255,0.025)" : "transparent" }}>
            <Box component="td" sx={td}>{r.singular}</Box>
            {tableType === "meaningChange" && <Box component="td" sx={td}>{r.singularMeaning}</Box>}
            <Box component="td" sx={td}>{r.plural}</Box>
            {tableType === "meaningChange" && <Box component="td" sx={td}>{r.pluralMeaning}</Box>}
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);
const th = { textAlign: "left", color: palette.gold, fontWeight: 700, fontSize: "0.85rem", px: 1.5, py: 1 };
const td = { color: palette.text, fontSize: "0.88rem", px: 1.5, py: 1, borderTop: `1px solid ${palette.border}` };

// ---------- branch data builder ----------

const BRANCH_ICONS = {
  definition: "✎",
  types: "◈",
  countability: "▣",
  rules: "§",
  golden: "⭐",
  pyq: "🎯",
  examStrategy: "♟",
  verdict: "✓",
};

function buildBranches(data) {
  const branches = [];
  if (data.definition) branches.push({ id: "definition", label: "Definition", kind: "definition", payload: data.definition });
  if (data.types?.length)
    branches.push({
      id: "types",
      label: "Types",
      kind: "list",
      children: data.types.map((t, i) => ({ id: `type-${i}`, label: t.name, kind: "typeItem", payload: t })),
    });
  if (data.countability?.length)
    branches.push({
      id: "countability",
      label: "Countable / Uncountable",
      kind: "list",
      children: data.countability.map((c, i) => ({ id: `count-${i}`, label: c.name, kind: "countItem", payload: c })),
    });
  if (data.rules?.length)
    branches.push({
      id: "rules",
      label: "Rules",
      kind: "list",
      children: data.rules.map((r) => ({ id: `rule-${r.id}`, label: `${r.id}. ${r.title}`, kind: "ruleItem", payload: r })),
    });
  if (data.goldenRevision?.length) branches.push({ id: "golden", label: "Golden Revision", kind: "golden", payload: data.goldenRevision });
  if (data.pyqTraps?.length) branches.push({ id: "pyq", label: "PYQ Traps", kind: "pyq", payload: data.pyqTraps });
  if (data.examStrategy?.length)
    branches.push({
      id: "examStrategy",
      label: "Exam Strategy",
      kind: "list",
      children: data.examStrategy.map((s, i) => ({ id: `exam-${i}`, label: s.label, kind: "examItem", payload: s })),
    });
  if (data.finalVerdict) branches.push({ id: "verdict", label: "Final Verdict", kind: "verdict", payload: data.finalVerdict });
  return branches;
}

// ---------- detail content per kind (unchanged logic) ----------

function DetailContent({ node }) {
  if (!node) return null;
  const { kind, payload, label } = node;

  if (kind === "definition") {
    return (
      <>
        <Typography sx={{ color: palette.text, fontFamily: FONT_BODY, mb: 1 }}>{payload.english}</Typography>
        <FormulaBox>{payload.marathi}</FormulaBox>
        {payload.examples && (
          <Box display="flex" flexWrap="wrap" gap={1}>
            {payload.examples.map((ex, i) => (
              <Chip
                key={i}
                label={`${ex.word}${ex.tag ? ` (${ex.tag})` : ""}`}
                variant="outlined"
                sx={{ color: palette.text, borderColor: palette.borderStrong, fontFamily: FONT_BODY }}
              />
            ))}
          </Box>
        )}
      </>
    );
  }

  if (kind === "typeItem") {
    return (
      <>
        <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, mb: 1.5 }}>{payload.english}</Typography>
        <TagWrap tags={payload.examples} />
      </>
    );
  }

  if (kind === "countItem") {
    return (
      <>
        <FormulaBox>{payload.marathi}</FormulaBox>
        <TagWrap tags={payload.examples} />
      </>
    );
  }

  if (kind === "ruleItem") {
    return (
      <>
        {payload.english && (
          <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, mb: 1 }}>{payload.english}</Typography>
        )}
        {payload.marathi && <FormulaBox>{payload.marathi}</FormulaBox>}
        <TagWrap tags={payload.examples} />
        {payload.table && <RuleTable rows={payload.table} tableType={payload.tableType} />}
        {payload.wrongRight && <WrongRightList pairs={payload.wrongRight} />}
        {payload.subpoints && (
          <Box display="flex" flexDirection="column" gap={1.25}>
            {payload.subpoints.map((sp, i) => (
              <Box key={i} sx={{ p: 1.5, borderRadius: 2, border: `1px solid ${palette.border}`, bgcolor: "rgba(255,255,255,0.02)" }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: palette.text, fontFamily: FONT_BODY }}>
                  {sp.label}
                </Typography>
                <Typography variant="body2" sx={{ color: palette.green, fontWeight: 600, mt: 0.5, fontFamily: FONT_BODY }}>
                  {sp.example}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        {payload.subsections && (
          <Box display="flex" flexDirection="column" gap={2}>
            {payload.subsections.map((sub, i) => (
              <Box key={i} sx={{ p: 2, borderRadius: 2, border: `1px solid ${palette.border}`, bgcolor: "rgba(255,255,255,0.02)" }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: palette.text, fontFamily: FONT_BODY, mb: 0.5 }}>
                  {sub.title}
                </Typography>
                {sub.marathi && <FormulaBox>{sub.marathi}</FormulaBox>}
                <TagWrap tags={sub.examples} />
                {sub.wrongRight && <WrongRightList pairs={sub.wrongRight} />}
              </Box>
            ))}
          </Box>
        )}
      </>
    );
  }

  if (kind === "golden") {
    return (
      <Box display="flex" flexWrap="wrap" gap={1}>
        {payload.map((item, i) => (
          <Chip key={i} label={item} variant="outlined" sx={{ borderColor: palette.gold, color: palette.amber, fontFamily: FONT_BODY }} />
        ))}
      </Box>
    );
  }

  if (kind === "pyq") return <WrongRightList pairs={payload} />;

  if (kind === "examItem") {
    return <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY }}>{payload.text}</Typography>;
  }

  if (kind === "verdict") {
    return (
      <Box sx={{ p: 2, borderRadius: 2, bgcolor: palette.mintBg, border: `1px solid rgba(123,217,165,0.25)` }}>
        <Typography sx={{ color: palette.green, fontWeight: 600, fontFamily: FONT_BODY }}>{payload}</Typography>
      </Box>
    );
  }

  return <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY }}>{label}</Typography>;
}

// ---------- sidebar item ----------

const SidebarItem = ({ label, icon, active, onClick, compact }) =>
  compact ? (
    <Chip
      onClick={onClick}
      label={
        <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
          <span aria-hidden="true">{icon}</span>
          {label}
        </Box>
      }
      sx={{
        flexShrink: 0,
        fontFamily: FONT_BODY,
        fontWeight: 600,
        cursor: "pointer",
        bgcolor: active ? palette.goldSoft : "transparent",
        color: active ? palette.gold : palette.muted,
        border: `1px solid ${active ? palette.gold : palette.border}`,
      }}
    />
  ) : (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.75,
        py: 1.1,
        borderRadius: 2,
        cursor: "pointer",
        fontFamily: FONT_BODY,
        fontWeight: 600,
        fontSize: "0.9rem",
        color: active ? palette.gold : palette.text,
        bgcolor: active ? palette.goldSoft : "transparent",
        borderLeft: `3px solid ${active ? palette.gold : "transparent"}`,
        transition: "all 0.15s ease",
        "&:hover": { bgcolor: active ? palette.goldSoft : "rgba(255,255,255,0.03)", color: palette.gold },
        "&:focus-visible": { outline: `2px solid ${palette.gold}`, outlineOffset: -2 },
      }}
    >
      <Box component="span" sx={{ width: 18, textAlign: "center" }} aria-hidden="true">{icon}</Box>
      {label}
    </Box>
  );

// ---------- main component ----------

const PANEL_HEIGHT = { xs: "auto", sm: 560, md: 600 };

const MindMapPage = ({ data }) => {
  const branches = useMemo(() => (data ? buildBranches(data) : []), [data]);
  const isNarrow = useMediaQuery("(max-width:760px)");

  const [activeBranchId, setActiveBranchId] = useState(branches[0]?.id ?? null);
  const [activeChildId, setActiveChildId] = useState(branches[0]?.children?.[0]?.id ?? null);

  if (!data || branches.length === 0) return null;

  const activeIndex = Math.max(0, branches.findIndex((b) => b.id === activeBranchId));
  const activeBranch = branches[activeIndex];
  const activeChild =
    activeBranch?.children?.find((c) => c.id === activeChildId) || activeBranch?.children?.[0] || null;
  const detailNode = activeBranch.kind === "list" ? activeChild : activeBranch;

  const selectBranch = (branch) => {
    setActiveBranchId(branch.id);
    setActiveChildId(branch.children?.[0]?.id ?? null);
  };

  const goAdjacent = (dir) => {
    const next = branches[(activeIndex + dir + branches.length) % branches.length];
    selectBranch(next);
  };

  return (
    <Box sx={{ mx: "auto", bgcolor: palette.ink, p: { xs: 2, sm: 4 }, fontFamily: FONT_BODY, minHeight: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 2.5, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{ color: palette.gold, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: { xs: "1.5rem", sm: "2.1rem" } }}
        >
          {data.title} — Quick Revision
        </Typography>
        <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, mt: 0.5, fontSize: "0.85rem" }}>
          {activeIndex + 1} / {branches.length} · click a section, content appears right here — no scrolling
        </Typography>
      </Box>

      {/* Study panel: sidebar + detail, side-by-side, fixed height so nothing pushes off-screen */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isNarrow ? "column" : "row",
          border: `1px solid ${palette.border}`,
          borderRadius: 4,
          bgcolor: palette.navy,
          overflow: "hidden",
          height: PANEL_HEIGHT,
        }}
      >
        {/* Sidebar / chip strip */}
        {isNarrow ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1.5,
              overflowX: "auto",
              borderBottom: `1px solid ${palette.border}`,
              bgcolor: palette.navyRaised,
            }}
          >
            {branches.map((b) => (
              <SidebarItem
                key={b.id}
                compact
                label={b.label}
                icon={BRANCH_ICONS[b.kind === "list" ? b.id : b.kind] || "•"}
                active={b.id === activeBranchId}
                onClick={() => selectBranch(b)}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              width: 240,
              flexShrink: 0,
              borderRight: `1px solid ${palette.border}`,
              bgcolor: palette.navyRaised,
              p: 1.25,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {branches.map((b) => (
              <SidebarItem
                key={b.id}
                label={b.label}
                icon={BRANCH_ICONS[b.kind === "list" ? b.id : b.kind] || "•"}
                active={b.id === activeBranchId}
                onClick={() => selectBranch(b)}
              />
            ))}
          </Box>
        )}

        {/* Detail pane */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: { xs: 320, sm: "auto" },
          }}
        >
          {/* sub-item chips for list-type branches */}
          {activeBranch.kind === "list" && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                px: 2.5,
                pt: 2,
                pb: 1.5,
                borderBottom: `1px solid ${palette.border}`,
              }}
            >
              {activeBranch.children.map((c) => (
                <Chip
                  key={c.id}
                  label={c.label}
                  size="small"
                  onClick={() => setActiveChildId(c.id)}
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    cursor: "pointer",
                    bgcolor: c.id === (activeChildId ?? activeBranch.children[0].id) ? palette.goldSoft : "transparent",
                    color: c.id === (activeChildId ?? activeBranch.children[0].id) ? palette.gold : palette.muted,
                    border: `1px solid ${c.id === (activeChildId ?? activeBranch.children[0].id) ? palette.gold : palette.border}`,
                  }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
            <Typography
              variant="h6"
              sx={{ color: palette.gold, fontFamily: FONT_DISPLAY, fontWeight: 600, mb: 2 }}
            >
              {activeBranch.label}
              {activeBranch.kind === "list" && activeChild ? (
                <Typography component="span" sx={{ color: palette.muted, fontFamily: FONT_BODY, fontSize: "0.85rem", ml: 1.5 }}>
                  / {activeChild.label}
                </Typography>
              ) : null}
            </Typography>

            <DetailContent node={detailNode} />
          </Box>

          {/* Prev / Next — the actual revision motion: walk every section in order */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.25,
              borderTop: `1px solid ${palette.border}`,
              bgcolor: palette.navyRaised,
            }}
          >
            <IconButton
              onClick={() => goAdjacent(-1)}
              size="small"
              aria-label="Previous section"
              sx={{ color: palette.muted, "&:hover": { color: palette.gold } }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, fontSize: "0.8rem" }}>
              {branches[(activeIndex + 1) % branches.length].label} next
            </Typography>
            <IconButton
              onClick={() => goAdjacent(1)}
              size="small"
              aria-label="Next section"
              sx={{ color: palette.muted, "&:hover": { color: palette.gold } }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MindMapPage;
