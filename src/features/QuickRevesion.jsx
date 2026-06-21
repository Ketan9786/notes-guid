/**
 * QuickRevisionPage — "Midnight Study" theme, same data schema as
 * MindMapPage / NotesPage (noun.json etc.).
 *
 * Purpose: this is NOT the mind map. The mind map is for *learning* a
 * topic (click a section, read it, switch). This page is for the
 * night-before-the-exam pass: one continuous scroll, dense, scannable,
 * zero clicking required to see the high-value stuff.
 *
 * Ordering is deliberate — most exam-relevant first:
 *   1. Golden Revision  (the actual "remember this" list)
 *   2. PYQ Traps        (wrong vs right — what examiners actually test)
 *   3. Exam Strategy    (a checklist, ticked off as you read)
 *   4. Rules            (collapsed to one-line triggers by default —
 *                        tap only if you've genuinely forgotten one;
 *                        keeps the page short for fast scanning)
 *   5. Definition / Types / Countability (collapsed reference, lowest
 *      priority on a revision pass — you already know these)
 *   6. Final Verdict    (closing one-liner)
 *
 * Usage:
 *   import { ThemeProvider } from "@mui/material/styles";
 *   import { studyTheme } from "./theme";
 *   import data from "./noun.json";
 *
 *   <ThemeProvider theme={studyTheme}>
 *     <QuickRevisionPage data={data} />
 *   </ThemeProvider>
 */

import { useState } from "react";
import { Box, Typography, Chip, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import palette from "../theme/Theme";

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
      py: 1.25,
      mb: 1.5,
      fontSize: "0.9rem",
      lineHeight: 1.6,
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
    <Box display="flex" flexWrap="wrap" gap={0.75} mb={1.5}>
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
      mb: 1,
    }}
  >
    {wrong && (
      <Box sx={{ borderLeft: `3px solid ${palette.red}`, px: 1.75, py: 0.85, bgcolor: palette.redBg }}>
        <Typography
          variant="body2"
          sx={{ color: palette.red, textDecoration: "line-through", fontFamily: FONT_BODY, opacity: 0.85, fontSize: "0.85rem" }}
        >
          {wrong}
        </Typography>
      </Box>
    )}
    {right && (
      <Box sx={{ borderLeft: `3px solid ${palette.green}`, px: 1.75, py: 0.85, bgcolor: palette.mintBg }}>
        <Typography variant="body2" sx={{ color: palette.green, fontWeight: 600, fontFamily: FONT_BODY, fontSize: "0.85rem" }}>
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
  <Box sx={{ mb: 1.5, borderRadius: 2, border: `1px solid ${palette.border}`, overflow: "hidden" }}>
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
const th = { textAlign: "left", color: palette.gold, fontWeight: 700, fontSize: "0.8rem", px: 1.5, py: 0.85 };
const td = { color: palette.text, fontSize: "0.85rem", px: 1.5, py: 0.85, borderTop: `1px solid ${palette.border}` };

// ---------- section shell ----------

const SectionCard = ({ icon, title, accent = palette.gold, children, dense }) => (
  <Box
    sx={{
      mb: 2,
      borderRadius: 3,
      border: `1px solid ${palette.border}`,
      bgcolor: palette.navy,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: dense ? 1.1 : 1.4,
        borderBottom: `1px solid ${palette.border}`,
        bgcolor: palette.navyRaised,
      }}
    >
      <Box component="span" sx={{ fontSize: "1rem" }} aria-hidden="true">{icon}</Box>
      <Typography sx={{ color: accent, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1rem" }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 2 }}>{children}</Box>
  </Box>
);

// ---------- collapsed one-line trigger (for low-priority-on-revision content) ----------

const TriggerRow = ({ label, sub, open, onClick, children }) => (
  <Box sx={{ borderBottom: `1px solid ${palette.border}`, "&:last-of-type": { borderBottom: "none" } }}>
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.1,
        cursor: "pointer",
        "&:hover .trig-label": { color: palette.gold },
      }}
    >
      <Box>
        <Typography className="trig-label" sx={{ color: palette.text, fontFamily: FONT_BODY, fontWeight: 600, fontSize: "0.9rem", transition: "color 0.15s" }}>
          {label}
        </Typography>
        {sub && (
          <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, fontSize: "0.78rem", mt: 0.2 }}>
            {sub}
          </Typography>
        )}
      </Box>
      <ExpandMoreIcon
        fontSize="small"
        sx={{ color: palette.muted, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
      />
    </Box>
    <Collapse in={open}>
      <Box sx={{ pb: 1.5, pl: 0.5 }}>{children}</Box>
    </Collapse>
  </Box>
);

// ---------- main component ----------

const QuickRevisionPage = ({ data }) => {
  const [openRule, setOpenRule] = useState(null);
  const [refOpen, setRefOpen] = useState(false);

  if (!data) return null;

  return (
    <Box sx={{ mx: "auto", maxWidth: 760, bgcolor: palette.ink, p: { xs: 2, sm: 3 }, fontFamily: FONT_BODY }}>
      {/* Header */}
      <Box sx={{ mb: 2.5, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{ color: palette.gold, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.9rem" } }}
        >
          {data.title} — Quick Revision
        </Typography>
        <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, mt: 0.4, fontSize: "0.82rem" }}>
          One scroll. Just the exam-relevant stuff.
        </Typography>
      </Box>

      {/* 1. Golden Revision — top priority */}
      {data.goldenRevision?.length > 0 && (
        <SectionCard icon="⭐" title="Golden Revision">
          <Box display="flex" flexWrap="wrap" gap={0.75}>
            {data.goldenRevision.map((item, i) => (
              <Chip
                key={i}
                label={item}
                variant="outlined"
                sx={{ borderColor: palette.gold, color: palette.amber, fontFamily: FONT_BODY, fontWeight: 600 }}
              />
            ))}
          </Box>
        </SectionCard>
      )}

      {/* 2. PYQ Traps */}
      {data.pyqTraps?.length > 0 && (
        <SectionCard icon="🎯" title="PYQ Traps" accent={palette.red}>
          <WrongRightList pairs={data.pyqTraps} />
        </SectionCard>
      )}

      {/* 3. Exam Strategy — checklist */}
      {data.examStrategy?.length > 0 && (
        <SectionCard icon="♟" title="Exam Strategy" dense>
          <Box display="flex" flexDirection="column" gap={0.9}>
            {data.examStrategy.map((s, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    mt: 0.2,
                    flexShrink: 0,
                    borderRadius: "4px",
                    border: `1.5px solid ${palette.gold}`,
                  }}
                />
                <Typography sx={{ color: palette.text, fontFamily: FONT_BODY, fontSize: "0.88rem", lineHeight: 1.5 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </SectionCard>
      )}

      {/* 4. Rules — collapsed one-liners, expand only if forgotten */}
      {data.rules?.length > 0 && (
        <SectionCard icon="§" title="Rules — tap to recall">
          {data.rules.map((r) => (
            <TriggerRow
              key={r.id}
              label={`${r.id}. ${r.title}`}
              open={openRule === r.id}
              onClick={() => setOpenRule(openRule === r.id ? null : r.id)}
            >
              {r.english && (
                <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, fontSize: "0.85rem", mb: 1 }}>
                  {r.english}
                </Typography>
              )}
              {r.marathi && <FormulaBox>{r.marathi}</FormulaBox>}
              <TagWrap tags={r.examples} />
              {r.table && <RuleTable rows={r.table} tableType={r.tableType} />}
              {r.wrongRight && <WrongRightList pairs={r.wrongRight} />}
              {r.subpoints && (
                <Box display="flex" flexDirection="column" gap={1}>
                  {r.subpoints.map((sp, i) => (
                    <Box key={i} sx={{ p: 1.25, borderRadius: 2, border: `1px solid ${palette.border}` }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: palette.text, fontFamily: FONT_BODY, fontSize: "0.85rem" }}>
                        {sp.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: palette.green, fontWeight: 600, mt: 0.3, fontFamily: FONT_BODY, fontSize: "0.85rem" }}>
                        {sp.example}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              {r.subsections && (
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {r.subsections.map((sub, i) => (
                    <Box key={i} sx={{ p: 1.5, borderRadius: 2, border: `1px solid ${palette.border}` }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: palette.text, fontFamily: FONT_BODY, fontSize: "0.85rem", mb: 0.4 }}>
                        {sub.title}
                      </Typography>
                      {sub.marathi && <FormulaBox>{sub.marathi}</FormulaBox>}
                      <TagWrap tags={sub.examples} />
                      {sub.wrongRight && <WrongRightList pairs={sub.wrongRight} />}
                    </Box>
                  ))}
                </Box>
              )}
            </TriggerRow>
          ))}
        </SectionCard>
      )}

      {/* 5. Reference — Definition / Types / Countability, all collapsed under one trigger */}
      {(data.definition || data.types?.length || data.countability?.length) && (
        <SectionCard icon="✎" title="Reference">
          <TriggerRow
            label="Definition, Types, Countability"
            sub="Lowest priority on a revision pass — expand only if rusty"
            open={refOpen}
            onClick={() => setRefOpen(!refOpen)}
          >
            {data.definition && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, fontSize: "0.85rem", mb: 0.75 }}>
                  {data.definition.english}
                </Typography>
                <FormulaBox>{data.definition.marathi}</FormulaBox>
              </Box>
            )}
            {data.types?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: palette.gold, fontFamily: FONT_BODY, fontWeight: 700, fontSize: "0.82rem", mb: 1 }}>
                  Types
                </Typography>
                {data.types.map((t, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <Typography sx={{ color: palette.text, fontFamily: FONT_BODY, fontWeight: 600, fontSize: "0.85rem" }}>
                      {t.name}
                    </Typography>
                    <TagWrap tags={t.examples} />
                  </Box>
                ))}
              </Box>
            )}
            {data.countability?.length > 0 && (
              <Box>
                <Typography sx={{ color: palette.gold, fontFamily: FONT_BODY, fontWeight: 700, fontSize: "0.82rem", mb: 1 }}>
                  Countable / Uncountable
                </Typography>
                {data.countability.map((c, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <Typography sx={{ color: palette.text, fontFamily: FONT_BODY, fontWeight: 600, fontSize: "0.85rem" }}>
                      {c.name}
                    </Typography>
                    <FormulaBox>{c.marathi}</FormulaBox>
                    <TagWrap tags={c.examples} />
                  </Box>
                ))}
              </Box>
            )}
          </TriggerRow>
        </SectionCard>
      )}

      {/* 6. Final Verdict — closing line */}
      {data.finalVerdict && (
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: palette.mintBg,
            border: `1px solid rgba(123,217,165,0.25)`,
            textAlign: "center",
          }}
        >
          <Typography sx={{ color: palette.green, fontWeight: 700, fontFamily: FONT_BODY, fontSize: "0.92rem" }}>
            {data.finalVerdict}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default QuickRevisionPage;
