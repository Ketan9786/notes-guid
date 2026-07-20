/**
 * NotesPage2.jsx — Tabbed layout for multi-part grammar notes (e.g. tenses-3.json)
 * Theme: "Sunrise Study Pro" (Theme-2.jsx) — light, clean, exam-revision friendly.
 *
 * Why a separate file: tenses-3.json has a nested `parts[]` array (Present /
 * Past / Future / Advanced Rules), each with its own tenseTypes, rules,
 * summaryTable, goldenRevision, pyqTraps, examStrategy, finalVerdict — plus
 * Part 4 has unique sections (sequenceOfTenses, stateVerbs, conditionalSentences,
 * specialUsageCases, timeMarkers, importantSscRules, finalGoldenRevision).
 * Cramming all of that into one scroll (like NotesPage.jsx does for flat
 * schemas) becomes unreadable. Tabs let the student focus on one tense
 * family at a time without losing the page's overall top-level context
 * (definition + types), which stays visible above the tabs.
 *
 * Usage:
 *   import NotesPage2 from "./NotesPage2.jsx";
 *   import data from "./tenses-3.json";
 *   <NotesPage2 data={data} />
 */

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Stack,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import palette from "../../theme/Theme.jsx";

const FONT_DISPLAY = '"Source Serif Pro", Georgia, "Times New Roman", serif';
const FONT_BODY = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

/* ---------------------------------------------------------------------- */
/* Shared primitives                                                      */
/* ---------------------------------------------------------------------- */

const SectionHeading = ({ children, icon }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, mt: 3 }}>
    {icon}
    <Typography
      sx={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: 20,
        color: palette.text,
      }}
    >
      {children}
    </Typography>
  </Stack>
);

const Panel = ({ children, sx, ...rest }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 3,
      bgcolor: palette.navy,
      border: `1px solid ${palette.border}`,
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Paper>
);

const Bilingual = ({ english, marathi }) => (
  <Box sx={{ mb: marathi ? 0.5 : 0 }}>
    {english && (
      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 15, color: palette.text, lineHeight: 1.6 }}>
        {english}
      </Typography>
    )}
    {marathi && (
      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: palette.muted, mt: 0.4 }}>
        {marathi}
      </Typography>
    )}
  </Box>
);

const ExampleChips = ({ examples, color = "blue" }) => {
  if (!examples?.length) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}>
      {examples.map((ex, i) => (
        <Chip
          key={i}
          label={typeof ex === "string" ? ex : ex.word}
          size="small"
          sx={{
            fontSize: 12.5,
            bgcolor: palette[`${color}Bg`] || palette.goldSoft,
            color: palette.text,
            border: `1px solid ${palette.border}`,
          }}
        />
      ))}
    </Stack>
  );
};

const WrongRight = ({ wrong, right }) => {
  if (!wrong && !right) return null;
  return (
    <Stack spacing={0.6} sx={{ mt: 1 }}>
      {wrong && (
        <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: palette.red }}>
          ✗ {wrong}
        </Typography>
      )}
      {right && (
        <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: palette.green }}>
          ✓ {right}
        </Typography>
      )}
    </Stack>
  );
};

const WrongRightList = ({ pairs }) => {
  if (!pairs?.length) return null;
  return (
    <Stack spacing={1.2} sx={{ mt: 1 }}>
      {pairs.map((p, i) => (
        <WrongRight key={i} wrong={p.wrong} right={p.right} />
      ))}
    </Stack>
  );
};

const SignalWordChips = ({ words }) => {
  if (!words?.length) return null;
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.8, mt: 1 }}>
      {words.map((w, i) => (
        <Chip
          key={i}
          label={w}
          size="small"
          sx={{
            fontFamily: FONT_BODY,
            fontSize: 12,
            fontWeight: 600,
            bgcolor: palette.amberBg,
            color: palette.amber,
          }}
        />
      ))}
    </Stack>
  );
};

/* Structure block: positive / negative / interrogative */
const StructureBox = ({ structure }) => {
  if (!structure) return null;
  const rows = [
    { label: "Positive", value: structure.positive, color: palette.green },
    { label: "Negative", value: structure.negative, color: palette.red },
    { label: "Question", value: structure.interrogative, color: palette.blue },
  ].filter((r) => r.value);
  return (
    <Stack spacing={1} sx={{ mt: 1.2 }}>
      {rows.map((r, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            bgcolor: palette.navyHover,
            borderRadius: 2,
            px: 1.5,
            py: 0.8,
            border: `1px solid ${palette.border}`,
          }}
        >
          <Chip
            label={r.label}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              bgcolor: "transparent",
              color: r.color,
              border: `1px solid ${r.color}`,
              minWidth: 78,
            }}
          />
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: 13.5,
              color: palette.text,
              fontWeight: 600,
            }}
          >
            {r.value}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

/* Generic 2-column summary table: { tense/label, structure/value } */
const SummaryTable = ({ rows, colA = "Tense", colB = "Structure" }) => {
  if (!rows?.length) return null;
  const keys = Object.keys(rows[0]);
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: `1px solid ${palette.border}`, borderRadius: 2, mt: 1 }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: palette.navyRaised }}>
            <TableCell sx={{ fontWeight: 700, fontFamily: FONT_BODY, color: palette.textSoft }}>
              {colA}
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontFamily: FONT_BODY, color: palette.textSoft }}>
              {colB}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i} sx={{ "&:nth-of-type(odd)": { bgcolor: palette.navyHover } }}>
              <TableCell sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: palette.text, fontWeight: 600 }}>
                {r[keys[0]]}
              </TableCell>
              <TableCell sx={{ fontFamily: "monospace", fontSize: 13, color: palette.blue }}>
                {r[keys[1]]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const GoldenRevisionList = ({ items }) => {
  if (!items?.length) return null;
  return (
    <Panel sx={{ bgcolor: palette.goldSoft, border: `1px solid ${palette.gold}` }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography sx={{ fontSize: 18 }}>⭐</Typography>
        <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: palette.text }}>
          Golden Revision
        </Typography>
      </Stack>
      <Grid container spacing={1}>
        {items.map((item, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: palette.textSoft }}>
              • {item}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Panel>
  );
};

const PyqTrapsPanel = ({ traps }) => {
  if (!traps?.length) return null;
  return (
    <Panel sx={{ bgcolor: palette.redBg, border: `1px solid ${palette.red}` }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <WarningAmberIcon sx={{ color: palette.red, fontSize: 20 }} />
        <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: palette.text }}>
          PYQ Traps
        </Typography>
      </Stack>
      <Stack spacing={1.4}>
        {traps.map((t, i) => (
          <WrongRight key={i} wrong={t.wrong} right={t.right} />
        ))}
      </Stack>
    </Panel>
  );
};

const ExamStrategyPanel = ({ strategy }) => {
  if (!strategy?.length) return null;
  return (
    <Panel>
      <SectionHeading>Exam Strategy</SectionHeading>
      <Stack spacing={1.5}>
        {strategy.map((s, i) => (
          <Box key={i}>
            <Chip
              label={s.label}
              size="small"
              sx={{ bgcolor: palette.blueBg, color: palette.blue, fontWeight: 700, mb: 0.5 }}
            />
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: palette.textSoft }}>
              {s.text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Panel>
  );
};

const FinalVerdictBox = ({ text }) => {
  if (!text) return null;
  return (
    <Panel sx={{ bgcolor: palette.greenBg, border: `1px solid ${palette.green}`, mt: 2 }}>
      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, color: palette.textSoft, fontStyle: "italic" }}>
        {text}
      </Typography>
    </Panel>
  );
};

/* ---------------------------------------------------------------------- */
/* Rule accordion (used inside each tenseType)                            */
/* ---------------------------------------------------------------------- */

const RuleItem = ({ rule, expanded, onToggle, revised }) => (
  <Accordion
    expanded={expanded}
    onChange={onToggle}
    elevation={0}
    disableGutters
    sx={{
      bgcolor: expanded ? palette.navyHover : palette.navy,
      border: `1px solid ${palette.border}`,
      borderRadius: 2,
      mb: 1,
      "&:before": { display: "none" },
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: palette.muted }} />}
      sx={{ "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1.2 } }}
    >
      {revised ? (
        <CheckCircleIcon sx={{ color: palette.green, fontSize: 18 }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ color: palette.hint, fontSize: 18 }} />
      )}
      <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: palette.text }}>
        {rule.id != null ? `${rule.id}. ` : ""}
        {rule.title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ pt: 0 }}>
      <Bilingual english={rule.english} marathi={rule.marathi} />
      <ExampleChips examples={rule.examples} color="blue" />
      <WrongRightList pairs={rule.wrongRight} />
    </AccordionDetails>
  </Accordion>
);

/* ---------------------------------------------------------------------- */
/* Tense type card (Simple Present, Past Continuous, etc.)                */
/* ---------------------------------------------------------------------- */

const TenseTypeCard = ({ tense, revisedSet, onToggleRule }) => {
  const ruleKeyPrefix = tense.name;
  return (
    <Panel sx={{ mb: 2.5 }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold }}>
        {tense.name}
      </Typography>
      <Bilingual english={tense.definition?.english} marathi={tense.definition?.marathi} />

      <StructureBox structure={tense.structure} />

      {tense.examples && (
        <Box sx={{ mt: 1.2 }}>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, color: palette.hint, textTransform: "uppercase" }}>
            Examples
          </Typography>
          <ExampleChips examples={tense.examples} color="green" />
        </Box>
      )}

      {tense.signalWords && (
        <Box sx={{ mt: 1.2 }}>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, color: palette.hint, textTransform: "uppercase" }}>
            Signal Words
          </Typography>
          <SignalWordChips words={tense.signalWords} />
        </Box>
      )}

      {tense.rules?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, color: palette.hint, textTransform: "uppercase", mb: 0.8 }}>
            Rules
          </Typography>
          {tense.rules.map((rule) => {
            const key = `${ruleKeyPrefix}-${rule.id}`;
            return (
              <RuleItem
                key={key}
                rule={rule}
                expanded={revisedSet.expandedId === key}
                revised={revisedSet.set.has(key)}
                onToggle={() => onToggleRule(key)}
              />
            );
          })}
        </Box>
      )}

      {(tense.sscTrap || tense.sscPyqTrap) && (
        <Box sx={{ mt: 1.5 }}>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, color: palette.red, textTransform: "uppercase" }}>
            SSC Trap
          </Typography>
          <WrongRight
            wrong={(tense.sscTrap || tense.sscPyqTrap).wrong}
            right={(tense.sscTrap || tense.sscPyqTrap).right}
          />
        </Box>
      )}

      {tense.sscPyqRule && (
        <Box
          sx={{
            mt: 1.5,
            p: 1,
            bgcolor: palette.amberBg,
            borderRadius: 1.5,
            borderLeft: `3px solid ${palette.amber}`,
          }}
        >
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12.5, color: palette.textSoft, fontWeight: 600 }}>
            📌 {tense.sscPyqRule}
          </Typography>
        </Box>
      )}

      {tense.sinceVsFor && (
        <SummaryTable
          rows={tense.sinceVsFor.map((r) => ({ Since: r.since, For: r.for }))}
          colA="Since"
          colB="For"
        />
      )}
    </Panel>
  );
};

/* ---------------------------------------------------------------------- */
/* Part-specific extra sections (Part 2 & 3 have unique bits)             */
/* ---------------------------------------------------------------------- */

const UsedToWouldSection = ({ usedTo, would }) => {
  if (!usedTo && !would) return null;
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {usedTo && (
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: palette.gold }}>
              Used To
            </Typography>
            <Bilingual english={usedTo.definition} />
            <Typography sx={{ fontFamily: "monospace", fontSize: 13, color: palette.blue, mt: 0.8 }}>
              {usedTo.structure}
            </Typography>
            <ExampleChips examples={usedTo.examples} />
            {usedTo.sscRule && (
              <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12.5, color: palette.amber, mt: 1, fontWeight: 600 }}>
                📌 {usedTo.sscRule}
              </Typography>
            )}
          </Panel>
        </Grid>
      )}
      {would && (
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: palette.gold }}>
              Would
            </Typography>
            <Bilingual english={would.definition} />
            <ExampleChips examples={would.examples} />
            {would.difference && (
              <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12.5, color: palette.textSoft, mt: 1 }}>
                {would.difference}
              </Typography>
            )}
            <WrongRightList pairs={would.wrongRight} />
          </Panel>
        </Grid>
      )}
    </Grid>
  );
};

const ShallVsWillGoingTo = ({ shallVsWill, goingTo }) => {
  if (!shallVsWill && !goingTo) return null;
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {shallVsWill && (
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: palette.gold, mb: 1 }}>
              Shall vs Will
            </Typography>
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: palette.textSoft }}>
              <b>Shall:</b> {shallVsWill.shall?.usage}
            </Typography>
            <ExampleChips examples={shallVsWill.shall?.examples} />
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: palette.textSoft, mt: 1 }}>
              <b>Will:</b> {shallVsWill.will?.usage}
            </Typography>
            <ExampleChips examples={shallVsWill.will?.examples} />
          </Panel>
        </Grid>
      )}
      {goingTo && (
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: palette.gold }}>
              Going To
            </Typography>
            <Bilingual english={goingTo.definition} />
            <Typography sx={{ fontFamily: "monospace", fontSize: 13, color: palette.blue, mt: 0.8 }}>
              {goingTo.structure}
            </Typography>
            <ExampleChips examples={goingTo.examples} />
            {goingTo.difference && (
              <Stack spacing={0.4} sx={{ mt: 1 }}>
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12.5, color: palette.textSoft }}>
                  Will → {goingTo.difference.will}
                </Typography>
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12.5, color: palette.textSoft }}>
                  Going To → {goingTo.difference.goingTo}
                </Typography>
              </Stack>
            )}
          </Panel>
        </Grid>
      )}
    </Grid>
  );
};

const FutureTimeClauses = ({ clauses, ifClause }) => {
  if (!clauses && !ifClause) return null;
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {clauses && (
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: palette.gold }}>
              Future Time Clauses
            </Typography>
            <SignalWordChips words={clauses.connectors} />
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: palette.textSoft, mt: 1 }}>
              {clauses.rule}
            </Typography>
            <WrongRightList pairs={clauses.wrongRight} />
          </Panel>
        </Grid>
      )}
      {ifClause && (
        <Grid item xs={12} md={6}>
          <Panel>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: palette.gold }}>
              First Conditional
            </Typography>
            <Typography sx={{ fontFamily: "monospace", fontSize: 13, color: palette.blue, mt: 0.8 }}>
              {ifClause.formula}
            </Typography>
            <ExampleChips examples={ifClause.examples} />
            <WrongRightList pairs={ifClause.wrongRight} />
          </Panel>
        </Grid>
      )}
    </Grid>
  );
};

/* Part 4 — Advanced Rules unique sections */
const SequenceOfTenses = ({ data }) => {
  if (!data) return null;
  return (
    <Panel sx={{ mb: 2.5 }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold }}>
        Sequence of Tenses
      </Typography>
      <Bilingual english={data.definition?.english} marathi={data.definition?.marathi} />
      <Stack spacing={1} sx={{ mt: 1.5 }}>
        {data.rules?.map((r) => (
          <Box key={r.id}>
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: palette.text }}>
              {r.id}. {r.title}
            </Typography>
            <Bilingual english={r.english} marathi={r.marathi} />
            <ExampleChips examples={r.examples} />
            <WrongRightList pairs={r.wrongRight} />
          </Box>
        ))}
      </Stack>
      {data.sscTrap && (
        <Box sx={{ mt: 1 }}>
          <WrongRight wrong={data.sscTrap.wrong} right={data.sscTrap.right} />
        </Box>
      )}
    </Panel>
  );
};

const StateVerbsSection = ({ data }) => {
  if (!data) return null;
  return (
    <Panel sx={{ mb: 2.5 }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold }}>
        State Verbs
      </Typography>
      <Bilingual english={data.definition?.english} marathi={data.definition?.marathi} />
      <SignalWordChips words={data.commonVerbs} />
      <WrongRightList pairs={data.wrongRight} />
    </Panel>
  );
};

const ConditionalSentences = ({ data, goldenRule }) => {
  if (!data?.length) return null;
  return (
    <Panel sx={{ mb: 2.5 }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold }}>
        Conditional Sentences
      </Typography>
      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {data.map((c, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Box sx={{ p: 1.2, bgcolor: palette.navyHover, borderRadius: 2, border: `1px solid ${palette.border}` }}>
              <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, color: palette.blue }}>
                {c.type}
              </Typography>
              <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12.5, color: palette.muted }}>
                {c.usage}
              </Typography>
              <Typography sx={{ fontFamily: "monospace", fontSize: 12.5, color: palette.text, mt: 0.5 }}>
                {c.formula}
              </Typography>
              <ExampleChips examples={c.examples} />
            </Box>
          </Grid>
        ))}
      </Grid>
      {goldenRule && (
        <Box sx={{ mt: 1.5 }}>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, color: palette.amber }}>
            📌 {goldenRule.rule}
          </Typography>
          <WrongRightList pairs={goldenRule.wrongRight} />
        </Box>
      )}
    </Panel>
  );
};

const SpecialUsageCases = ({ cases }) => {
  if (!cases?.length) return null;
  return (
    <Panel sx={{ mb: 2.5 }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold }}>
        Special Usage Cases
      </Typography>
      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {cases.map((c, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Box sx={{ p: 1.2, bgcolor: palette.navyHover, borderRadius: 2, border: `1px solid ${palette.border}` }}>
              <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, color: palette.text }}>
                {c.case}
              </Typography>
              <Chip label={c.usage} size="small" sx={{ mt: 0.5, bgcolor: palette.blueBg, color: palette.blue }} />
              <ExampleChips examples={c.examples} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Panel>
  );
};

const TimeMarkersTable = ({ markers }) => {
  if (!markers?.length) return null;
  return (
    <Panel sx={{ mb: 2.5 }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold, mb: 1 }}>
        Time Markers by Tense
      </Typography>
      <Grid container spacing={1.2}>
        {markers.map((m, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Box sx={{ p: 1, bgcolor: palette.navyHover, borderRadius: 2 }}>
              <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12.5, color: palette.text }}>
                {m.tense}
              </Typography>
              <SignalWordChips words={m.markers} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Panel>
  );
};

const ImportantRulesList = ({ rules }) => {
  if (!rules?.length) return null;
  return (
    <Panel sx={{ mb: 2.5 }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold, mb: 1 }}>
        Important SSC Rules
      </Typography>
      <Stack spacing={1.2}>
        {rules.map((r) => (
          <Box key={r.id}>
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: palette.text }}>
              {r.id}. {r.title}{r.english ? ` — ${r.english}` : ""}
            </Typography>
            <ExampleChips examples={r.examples} />
            <WrongRightList pairs={r.wrongRight} />
          </Box>
        ))}
      </Stack>
    </Panel>
  );
};

/* ---------------------------------------------------------------------- */
/* Part renderer — decides which sections to show per part                */
/* ---------------------------------------------------------------------- */

const PartContent = ({ part, revisedSet, onToggleRule }) => {
  if (!part) return null;

  const isAdvancedPart = !part.tenseTypes; // Part 4 has no tenseTypes array

  return (
    <Box>
      {part.definition && (
        <Panel sx={{ mb: 2.5, bgcolor: palette.blueBg, border: `1px solid ${palette.blue}` }}>
          <Bilingual english={part.definition.english} marathi={part.definition.marathi} />
        </Panel>
      )}

      {part.tenseTypes?.map((tense, i) => (
        <TenseTypeCard key={i} tense={tense} revisedSet={revisedSet} onToggleRule={onToggleRule} />
      ))}

      {part.usedTo || part.would ? (
        <UsedToWouldSection usedTo={part.usedTo} would={part.would} />
      ) : null}

      {part.sinceVsAgo && (
        <SummaryTable
          rows={part.sinceVsAgo.since.map((s, i) => ({ Since: s, Ago: part.sinceVsAgo.ago[i] || "" }))}
          colA="Since"
          colB="Ago"
        />
      )}

      {part.simplePastVsPresentPerfect && (
        <Box sx={{ mt: 2 }}>
          <SectionHeading>Simple Past vs Present Perfect Signal Words</SectionHeading>
          <SummaryTable
            rows={part.simplePastVsPresentPerfect.map((r) => ({
              "Simple Past": r.simplePast,
              "Present Perfect": r.presentPerfect,
            }))}
            colA="Simple Past"
            colB="Present Perfect"
          />
        </Box>
      )}

      <ShallVsWillGoingTo shallVsWill={part.shallVsWill} goingTo={part.goingTo} />
      <FutureTimeClauses clauses={part.futureTimeClauses} ifClause={part.ifClauseFirstConditional} />

      {isAdvancedPart && (
        <>
          <SequenceOfTenses data={part.sequenceOfTenses} />
          <StateVerbsSection data={part.stateVerbs} />
          <ConditionalSentences data={part.conditionalSentences} goldenRule={part.sscGoldenRuleConditional} />
          <SpecialUsageCases cases={part.specialUsageCases} />
          <TimeMarkersTable markers={part.timeMarkers} />
          <ImportantRulesList rules={part.importantSscRules} />
          {part.sentenceImprovementRules && (
            <Panel sx={{ mb: 2.5 }}>
              <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold, mb: 1 }}>
                Sentence Improvement Cheatsheet
              </Typography>
              <SignalWordChips words={part.sentenceImprovementRules} />
            </Panel>
          )}
          {part.finalGoldenRevision && (
            <Panel sx={{ mb: 2.5, bgcolor: palette.goldSoft, border: `1px solid ${palette.gold}` }}>
              <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.text, mb: 1 }}>
                Final Golden Revision — All 12 Tenses
              </Typography>
              <Grid container spacing={1}>
                {part.finalGoldenRevision.structures?.map((s, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Typography sx={{ fontFamily: "monospace", fontSize: 12.5, color: palette.textSoft }}>
                      • {s}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Panel>
          )}
          {part.goldenFormulas && (
            <Panel sx={{ mb: 2.5 }}>
              <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold, mb: 1 }}>
                Golden Formulas
              </Typography>
              <SignalWordChips words={part.goldenFormulas} />
            </Panel>
          )}
          {part.pyqRapidFire && (
            <Panel sx={{ mb: 2.5 }}>
              <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: palette.gold, mb: 1 }}>
                PYQ Rapid Fire
              </Typography>
              <SignalWordChips words={part.pyqRapidFire} color="green" />
            </Panel>
          )}
        </>
      )}

      {part.summaryTable && (
        <Box sx={{ mt: 2 }}>
          <SectionHeading>Summary Table</SectionHeading>
          <SummaryTable rows={part.summaryTable} />
        </Box>
      )}

      {part.goldenRevision && (
        <Box sx={{ mt: 2 }}>
          <GoldenRevisionList items={part.goldenRevision} />
        </Box>
      )}

      {part.pyqTraps && (
        <Box sx={{ mt: 2 }}>
          <PyqTrapsPanel traps={part.pyqTraps} />
        </Box>
      )}

      {part.examStrategy && (
        <Box sx={{ mt: 2 }}>
          <ExamStrategyPanel strategy={part.examStrategy} />
        </Box>
      )}

      <FinalVerdictBox text={part.finalVerdict} />
    </Box>
  );
};

/* ---------------------------------------------------------------------- */
/* Main component                                                         */
/* ---------------------------------------------------------------------- */

const NotesPage2 = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [revisedIds, setRevisedIds] = useState(new Set());

  if (!data) return null;

  const handleToggleRule = (key) => {
    setExpandedId((prev) => (prev === key ? null : key));
    setRevisedIds((prev) => new Set(prev).add(key));
  };

  const revisedSet = { expandedId, set: revisedIds };
  const parts = data.parts || [];

  return (
    <Box sx={{ bgcolor: palette.ink, minHeight: "100vh", pb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: palette.navyRaised,
          borderBottom: `1px solid ${palette.border}`,
          px: { xs: 2, md: 5 },
          py: 4,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: { xs: 28, md: 36 },
            color: palette.text,
          }}
        >
          {data.title}
        </Typography>
        {data.subtitle && (
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 15, color: palette.muted, mt: 0.5 }}>
            {data.subtitle}
          </Typography>
        )}
        {data.tags && (
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
            {data.tags.map((t, i) => (
              <Chip
                key={i}
                label={t}
                size="small"
                sx={{ bgcolor: palette.goldSoft, color: palette.gold, fontWeight: 600 }}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Box sx={{ px: { xs: 2, md: 5 }, pt: 3, maxWidth: 1100, mx: "auto" }}>
        {/* Top-level definition + types — always visible, gives context before tabs */}
        {data.definition && (
          <Panel sx={{ mb: 2 }}>
            <SectionHeading>Definition</SectionHeading>
            <Bilingual english={data.definition.english} marathi={data.definition.marathi} />
            <ExampleChips examples={data.definition.examples} />
          </Panel>
        )}

        {data.types && (
          <Panel sx={{ mb: 3 }}>
            <SectionHeading>Types of {data.title}</SectionHeading>
            <Grid container spacing={1.5}>
              {data.types.map((t, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Box sx={{ p: 1.2, bgcolor: palette.navyHover, borderRadius: 2, height: "100%" }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13.5, color: palette.text }}>
                      {t.name}
                    </Typography>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12.5, color: palette.muted, mt: 0.3 }}>
                      {t.english}
                    </Typography>
                    <ExampleChips examples={t.examples} color="amber" />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Panel>
        )}

        {/* Tabs — one per part, sticky so students can jump between tense groups fast */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            bgcolor: palette.ink,
            borderBottom: `1px solid ${palette.border}`,
            mb: 3,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { backgroundColor: palette.gold, height: 3 } }}
            sx={{
              "& .MuiTab-root": {
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: 13.5,
                color: palette.muted,
                textTransform: "none",
                minHeight: 48,
              },
              "& .Mui-selected": { color: `${palette.gold} !important` },
            }}
          >
            {parts.map((p, i) => (
              <Tab key={i} label={`Part ${p.partNumber} · ${p.title}`} />
            ))}
          </Tabs>
        </Box>

        {/* Active part content */}
        <PartContent part={parts[activeTab]} revisedSet={revisedSet} onToggleRule={handleToggleRule} />

        <Divider sx={{ my: 4, borderColor: palette.border }} />
      </Box>
    </Box>
  );
};

export default NotesPage2;
