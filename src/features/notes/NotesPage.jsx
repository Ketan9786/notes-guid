/**
 * NotesPage v3 — "Midnight Study" theme.
 * Same JSON schema as before (noun.json etc.) — only the visual layer changed.
 *
 * Brief: no white/light backgrounds, dark-first like reading under a desk
 * lamp at night. The old cream/navy/gold palette is inverted — dark ink
 * surfaces everywhere, gold "lamp light" as the working accent, and the
 * original cream is now reserved for exactly one signature element (a
 * folded bookmark-ribbon on the header) so it stays under ~2–3% of the
 * page instead of being a background color.
 *
 * Signature element: the bookmark ribbon + the gold "lamp glow" behind the
 * title. Rule numbers are rendered as wax-seal medallions rather than flat
 * chips, reinforcing the "old study notebook at night" feeling.
 *
 * Usage:
 *   import { ThemeProvider } from "@mui/material/styles";
 *   import { studyTheme } from "./theme";
 *   import data from "./noun.json";
 *
 *   <ThemeProvider theme={studyTheme}>
 *     <NotesPage data={data} />
 *   </ThemeProvider>
 *
 * Note: this component sets all surface/text colors explicitly via sx, so
 * it renders correctly even if studyTheme itself is still in light mode.
 * If you do control studyTheme, setting palette.mode: "dark" there too
 * will keep MUI's own defaults (scrollbars, native inputs, etc.) consistent.
 */

import {useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import palette from "../../theme/Theme.jsx";
import CommonTable from "../../component/CommonTable.jsx";

// ---------- type scale ----------
// A serif display face for anything that should feel "written in a book",
// a quiet sans for body copy that needs to be read fast at revision speed.
const FONT_DISPLAY = '"Source Serif Pro", Georgia, "Times New Roman", serif';
const FONT_BODY =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ---------- shared bits ----------

const SectionHeading = ({ children }) => (
  <Typography
    variant="h6"
    sx={{
      color: palette.gold,
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      letterSpacing: "0.01em",
      mb: 2,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      "&::after": {
        content: '""',
        flex: 1,
        height: "1px",
        background: `linear-gradient(to right, ${palette.borderStrong}, transparent)`,
      },
    }}
  >
    {children}
  </Typography>
);

const Panel = ({ children, sx, ...rest }) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: palette.navy,
      border: `1px solid ${palette.border}`,
      borderRadius: 3,
      p: 3,
      mb: 3,
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Paper>
);

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

// Wrong/right pair, rendered as one annotated card instead of a cream box —
// a thin red rule for the crossed-out form, a thin green rule for the
// corrected one, like a teacher's pen marks on a dark page.
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
      <Box
        sx={{
          borderLeft: `3px solid ${palette.red}`,
          px: 2,
          py: 1,
          bgcolor: palette.redBg,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: palette.red,
            textDecoration: "line-through",
            fontFamily: FONT_BODY,
            opacity: 0.85,
          }}
        >
          {wrong}
        </Typography>
      </Box>
    )}
    {right && (
      <Box
        sx={{
          borderLeft: `3px solid ${palette.green}`,
          px: 2,
          py: 1,
          bgcolor: palette.mintBg,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: palette.green, fontWeight: 600, fontFamily: FONT_BODY }}
        >
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
  <TableContainer
    sx={{ mb: 2, borderRadius: 2, border: `1px solid ${palette.border}`, overflow: "hidden" }}
  >
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: palette.navyRaised }}>
          <TableCell sx={{ color: palette.gold, fontWeight: 700, fontFamily: FONT_BODY }}>
            Singular
          </TableCell>
          {tableType === "meaningChange" && (
            <TableCell sx={{ color: palette.gold, fontWeight: 700, fontFamily: FONT_BODY }}>
              Meaning
            </TableCell>
          )}
          <TableCell sx={{ color: palette.gold, fontWeight: 700, fontFamily: FONT_BODY }}>
            Plural
          </TableCell>
          {tableType === "meaningChange" && (
            <TableCell sx={{ color: palette.gold, fontWeight: 700, fontFamily: FONT_BODY }}>
              Meaning
            </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow
            key={i}
            sx={{
              "&:nth-of-type(even)": { bgcolor: "rgba(255,255,255,0.025)" },
              "& .MuiTableCell-root": {
                color: palette.text,
                borderColor: palette.border,
                fontFamily: FONT_BODY,
              },
            }}
          >
            <TableCell>{r.singular}</TableCell>
            {tableType === "meaningChange" && <TableCell>{r.singularMeaning}</TableCell>}
            <TableCell>{r.plural}</TableCell>
            {tableType === "meaningChange" && <TableCell>{r.pluralMeaning}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// ---------- rule accordion item ----------

// A circular "wax seal" badge for the rule number, instead of a flat chip —
// reads more like a chapter marker in a notebook than a UI control.
const RuleMedallion = ({ id, revised }) => (
  <Box
    sx={{
      flexShrink: 0,
      width: 34,
      height: 34,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT_DISPLAY,
      fontWeight: 700,
      fontSize: "0.95rem",
      bgcolor: revised ? palette.goldSoft : "rgba(255,255,255,0.04)",
      border: `1.5px solid ${revised ? palette.gold : palette.borderStrong}`,
      color: revised ? palette.gold : palette.muted,
      transition: "all 0.2s ease",
    }}
  >
    {id}
  </Box>
);

const RuleAccordion = ({ rule, expanded, onToggle, revised }) => (
  <Accordion
    expanded={expanded}
    onChange={onToggle}
    disableGutters
    sx={{
      mb: 1.5,
      bgcolor: palette.navy,
      borderRadius: "12px !important",
      border: `1px solid ${expanded ? palette.gold : palette.border}`,
      overflow: "hidden",
      "&:before": { display: "none" },
      boxShadow: expanded ? `0 4px 24px rgba(217,178,92,0.08)` : "none",
      transition: "border-color 0.2s ease",
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: palette.muted }} />}
      sx={{
        bgcolor: expanded ? palette.navyRaised : "transparent",
        "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1.5, my: 1.25 },
      }}
    >
      {revised ? (
        <CheckCircleIcon sx={{ color: palette.green, fontSize: 18, flexShrink: 0 }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ color: palette.border, fontSize: 18, flexShrink: 0 }} />
      )}
      <RuleMedallion id={rule.id} revised={revised} />
      <Typography
        fontWeight={600}
        sx={{ color: palette.text, fontFamily: FONT_DISPLAY, fontSize: "1.05rem" }}
      >
        {rule.title}
      </Typography>
    </AccordionSummary>

    <AccordionDetails sx={{ p: 2.5, pt: 2, borderTop: `1px solid ${palette.border}` }}>
      {rule.english && (
        <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY, mb: 1 }}>
          {rule.english}
        </Typography>
      )}
      {rule.marathi && <FormulaBox>{rule.marathi}</FormulaBox>}

      <TagWrap tags={rule.examples} />

      {rule.table && <RuleTable rows={rule.table} tableType={rule.tableType} />}

      {rule.wrongRight && <WrongRightList pairs={rule.wrongRight} />}

      {rule.subpoints && (
        <Stack spacing={1.25}>
          {rule.subpoints.map((sp, i) => (
            <Box
              key={i}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${palette.border}`,
                bgcolor: "rgba(255,255,255,0.02)",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: palette.text, fontFamily: FONT_BODY }}
              >
                {sp.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: palette.green, fontWeight: 600, mt: 0.5, fontFamily: FONT_BODY }}
              >
                {sp.example}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {rule.subsections && (
        <Stack spacing={2}>
          {rule.subsections.map((sub, i) => (
            <Box
              key={i}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${palette.border}`,
                bgcolor: "rgba(255,255,255,0.02)",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: palette.text, fontFamily: FONT_BODY, mb: 0.5 }}
              >
                {sub.title}
              </Typography>
              {sub.marathi && <FormulaBox>{sub.marathi}</FormulaBox>}
              <TagWrap tags={sub.examples} />
              {sub.wrongRight && <WrongRightList pairs={sub.wrongRight} />}
            </Box>
          ))}
        </Stack>
      )}
    </AccordionDetails>
  </Accordion>
);

// ---------- main component ----------

const NotesPage = ({ data }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [revisedSet, setRevisedSet] = useState(new Set());

  const totalRules = data?.rules?.length || 0;
  const revisedCount = revisedSet.size;
  const progressPct = totalRules ? Math.round((revisedCount / totalRules) * 100) : 0;

  const handleToggle = (id) => () => {
    setExpandedId((prev) => (prev === id ? null : id));
    setRevisedSet((prev) => new Set(prev).add(id));
  };

  if (!data) return null;

  return (
    <Box
      sx={{
        mx: "auto",
        bgcolor: palette.ink,
        p: 4,
        fontFamily: FONT_BODY,
        minHeight: "100%",
      }}
    >
      {/* Header — the only place the gold "lamp glow" and the cream bookmark
          ribbon appear. Everything else in the page stays quiet. */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          p: 3,
          pr: 6,
          mb: 3,
          bgcolor: palette.navyRaised,
          border: `1px solid ${palette.border}`,
          borderRadius: 4,
          overflow: "hidden",
          backgroundImage: `radial-gradient(ellipse 70% 100% at 15% 0%, ${palette.goldGlow}, transparent 60%)`,
        }}
      >
        {/* signature element: folded bookmark ribbon, the one cream accent on the page */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 28,
            width: 34,
            height: 56,
            bgcolor: palette.cream,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
          }}
        />

        <Typography
          variant="h3"
          sx={{
            color: palette.gold,
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: { xs: "1.8rem", sm: "2.4rem" },
          }}
        >
          {data.title}
        </Typography>
        {data.subtitle && (
          <Typography sx={{ color: palette.muted, fontFamily: FONT_BODY }} mt={1}>
            {data.subtitle}
          </Typography>
        )}
        {data.tags && (
          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            {data.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: palette.goldSoft,
                  color: palette.gold,
                  fontWeight: 600,
                  fontFamily: FONT_BODY,
                  border: `1px solid rgba(217,178,92,0.25)`,
                }}
              />
            ))}
          </Box>
        )}

        {/* progress — reads like a bookmark ribbon advancing through the chapter */}
        {totalRules > 0 && (
          <Box mt={3} sx={{ position: "relative", zIndex: 1 }}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" sx={{ color: palette.muted, fontFamily: FONT_BODY }}>
                Revised
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: palette.gold, fontWeight: 700, fontFamily: FONT_BODY }}
              >
                {revisedCount}/{totalRules}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.08)",
                "& .MuiLinearProgress-bar": { bgcolor: palette.gold },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Definition */}
      {data.definition && (
        <Panel>
          <SectionHeading>Definition</SectionHeading>
          <Typography mb={1} sx={{ color: palette.text, fontFamily: FONT_BODY }}>
            {data.definition.english}
          </Typography>
          <FormulaBox>{data.definition.marathi}</FormulaBox>
          {data.definition.examples && (
            <Box mt={1.5} display="flex" gap={1} flexWrap="wrap">
              {data.definition.examples.map((ex, i) => (
                <Chip
                  key={i}
                  label={`${ex.word}${ex.tag ? ` (${ex.tag})` : ""}`}
                  variant="outlined"
                  sx={{
                    color: palette.text,
                    borderColor: palette.borderStrong,
                    fontFamily: FONT_BODY,
                  }}
                />
              ))}
            </Box>
          )}
        </Panel>
      )}

      {/* Types */}
      {data.cases && data.cases.length > 0 && (
        <Panel>
          <SectionHeading>Cases of {data.title}s</SectionHeading>
          <Grid container spacing={2}>
            {data.cases.map((caseItem) => (
              <Grid size={{ xs: 12, md: 4 }} key={caseItem.name}>
                <Box
                  sx={{
                    p: 2,
                    height: "100%",
                    borderRadius: 2,
                    border: `1px solid ${palette.border}`,
                    bgcolor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{ color: palette.text, fontFamily: FONT_DISPLAY }}
                  >
                    {caseItem.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: palette.muted, fontFamily: FONT_BODY }}
                    mt={0.5}
                  >
                    {caseItem.english}
                  </Typography>
                  {caseItem.examples && (
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                      {caseItem.examples.map((ex, i) => (
                        <Chip
                          key={i}
                          size="small"
                          label={ex}
                          sx={{
                            bgcolor: palette.mintBg,
                            color: palette.green,
                            fontFamily: FONT_BODY,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Panel>
      )}
      {data.types && 
      (
        <Panel>
          <SectionHeading>Types of {data.title}s</SectionHeading>
          <Grid container spacing={2}>
            {data.types.map((type) => (
              <Grid size={{ xs: 12, md: 6 }} key={type.name}>
                <Box
                  sx={{
                    p: 2,
                    height: "100%",
                    borderRadius: 2,
                    border: `1px solid ${palette.border}`,
                    bgcolor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{ color: palette.text, fontFamily: FONT_DISPLAY }}
                  >
                    {type.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: palette.muted, fontFamily: FONT_BODY }}
                    mt={0.5}
                  >
                    {type.english}
                  </Typography>
                  {type.examples && (
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                      {type.examples.map((ex, i) => (
                        <Chip
                          key={i}
                          size="small"
                          label={ex}
                          sx={{
                            bgcolor: palette.mintBg,
                            color: palette.green,
                            fontFamily: FONT_BODY,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Panel>
      )}

      {/* Countability */}
      {data.countability && (
        <Panel>
          <SectionHeading>Countable vs Uncountable</SectionHeading>
          <Grid container spacing={2}>
            {data.countability.map((c) => (
              <Grid size={{ xs: 12, md: 6 }} key={c.name}>
                <Box
                  sx={{
                    p: 2,
                    height: "100%",
                    borderRadius: 2,
                    border: `1px solid ${palette.border}`,
                    bgcolor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{ color: palette.text, fontFamily: FONT_DISPLAY }}
                  >
                    {c.name}
                  </Typography>
                  <FormulaBox>{c.marathi}</FormulaBox>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {c.examples.map((ex, i) => (
                      <Chip
                        key={i}
                        size="small"
                        label={ex}
                        variant="outlined"
                        sx={{ color: palette.text, borderColor: palette.borderStrong, fontFamily: FONT_BODY }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Panel>
      )}

     {data?.tables && (
  <>
   

    {data.tables.map((table, index) => (
      <>
       <SectionHeading>{table?.title}</SectionHeading>
      <CommonTable
        key={index}
        columns={table.columns}
        rows={table.rows}
      />
      </>
    ))}
  </>
)}
      {/* Rules — accordion */}
      {data.rules && (
        <Box mb={3}>
          <SectionHeading>Rules</SectionHeading>
          {data.rules.map((rule) => (
            <RuleAccordion
              key={rule.id}
              rule={rule}
              expanded={expandedId === rule.id}
              onToggle={handleToggle(rule.id)}
              revised={revisedSet.has(rule.id)}
            />
          ))}
        </Box>
      )}

      {/* Golden Revision */}
      {data.goldenRevision && (
        <Panel sx={{ border: `1px solid ${palette.gold}` }}>
          <SectionHeading>⭐ Golden Revision</SectionHeading>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {data.goldenRevision.map((item, i) => (
              <Chip
                key={i}
                label={item}
                sx={{ borderColor: palette.gold, color: palette.amber, fontFamily: FONT_BODY }}
                variant="outlined"
              />
            ))}
          </Box>
        </Panel>
      )}

      {/* PYQ Traps */}
      {data.pyqTraps && (
        <Panel>
          <SectionHeading>🎯 PYQ Traps</SectionHeading>
          <WrongRightList pairs={data.pyqTraps} />
        </Panel>
      )}

      {/* Exam Strategy */}
      {data.examStrategy && (
        <Panel>
          <SectionHeading>Exam Strategy</SectionHeading>
          <Grid container spacing={2}>
            {data.examStrategy.map((s, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${palette.border}`,
                    bgcolor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{ color: palette.text, fontFamily: FONT_DISPLAY }}
                  >
                    {s.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: palette.muted, fontFamily: FONT_BODY }}
                    mt={0.5}
                  >
                    {s.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Panel>
      )}

      {/* Final Verdict */}
      {data.finalVerdict && (
        <Box
          sx={{
            p: 2.5,
            mb: 1,
            borderRadius: 3,
            bgcolor: palette.mintBg,
            border: `1px solid rgba(123,217,165,0.25)`,
          }}
        >
          <Typography sx={{ color: palette.green, fontWeight: 600, fontFamily: FONT_BODY }}>
            {data.finalVerdict}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotesPage;
