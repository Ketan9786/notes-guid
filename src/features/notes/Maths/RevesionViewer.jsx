import { useState } from "react";
import palette from "../../../theme/Theme.jsx";

const BADGE_STYLES = {
blue: {
bg: palette.goldSoft,
color: palette.gold,
},
green: {
bg: palette.mintBg,
color: palette.green,
},
amber: {
bg: "rgba(232,184,92,0.10)",
color: palette.amber,
},
red: {
bg: palette.redBg,
color: palette.red,
},
};

function Badge({ text, color = "blue", style = {} }) {
const s = BADGE_STYLES[color] || BADGE_STYLES.blue;

return (
<span
style={{
fontSize: 11,
padding: "2px 8px",
borderRadius: 10,
background: s.bg,
color: s.color,
fontWeight: 500,
whiteSpace: "nowrap",
...style,
}}
>
{text} </span>
);
}

function FormulaBlock({ text }) {
return (
<div
style={{
background: palette.navyRaised,
borderLeft: `3px solid ${palette.gold}`,
padding: "8px 12px",
margin: "6px 0",
fontSize: 13,
fontFamily: "monospace",
color: palette.text,
lineHeight: 1.6,
}}
>
{text} </div>
);
}

function StepItem({ index, text }) {
return (
<div
style={{
display: "flex",
gap: 10,
margin: "5px 0",
alignItems: "flex-start",
}}
>
<span
style={{
minWidth: 20,
height: 20,
borderRadius: "50%",
background: palette.goldSoft,
color: palette.gold,
border: `1px solid ${palette.border}`,
fontSize: 11,
fontWeight: 500,
display: "flex",
alignItems: "center",
justifyContent: "center",
flexShrink: 0,
marginTop: 2,
}}
>
{index} </span>


  <span
    style={{
      fontSize: 13,
      color: palette.muted,
      lineHeight: 1.6,
    }}
  >
    {text}
  </span>
</div>


);
}

function ExampleItem({ text }) {
return (
<div
style={{
fontSize: 12,
color: palette.text,
padding: "6px 10px",
background: palette.navyHover,
borderRadius: 6,
margin: "4px 0",
lineHeight: 1.6,
}}
>
{text} </div>
);
}

function TipBlock({ text }) {
return (
<div
style={{
fontSize: 12,
padding: "8px 12px",
background: palette.goldSoft,
color: palette.gold,
border: `1px solid ${palette.borderStrong}`,
borderRadius: 6,
margin: "8px 0",
lineHeight: 1.6,
}}
> <strong>Tip:</strong> {text} </div>
);
}

function ConceptCard({ card }) {
return (
<div
style={{
background: palette.navy,
border: `1px solid ${palette.border}`,
borderRadius: 12,
padding: "14px 16px",
marginBottom: 12,
boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
}}
>
<div
style={{
display: "flex",
alignItems: "center",
gap: 8,
marginBottom: 10,
}}
>
<span
style={{
fontSize: 14,
fontWeight: 500,
color: palette.text,
}}
>
{card.title} </span>


    {card.badge && (
      <Badge
        text={card.badge}
        color={card.badgeColor}
      />
    )}
  </div>

  {card.tip &&
    !card.formulas &&
    !card.steps && (
      <TipBlock text={card.tip} />
    )}

  {card.formulas?.map((f, i) => (
    <FormulaBlock key={i} text={f} />
  ))}

  {card.steps?.length > 0 && (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: palette.gold,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 6,
        }}
      >
        Method
      </div>

      {card.steps.map((s, i) => (
        <StepItem
          key={i}
          index={i + 1}
          text={s}
        />
      ))}
    </div>
  )}

  {card.tip &&
    (card.formulas || card.steps) && (
      <TipBlock text={card.tip} />
    )}

  {card.examples?.length > 0 && (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: palette.gold,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        Examples
      </div>

      {card.examples.map((e, i) => (
        <ExampleItem
          key={i}
          text={e}
        />
      ))}
    </div>
  )}
</div>


);
}

function TableCard({ card }) {
return (
<div
style={{
background: palette.navy,
border: `1px solid ${palette.border}`,
borderRadius: 12,
padding: "14px 16px",
marginBottom: 12,
boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
}}
>
<div
style={{
fontSize: 14,
fontWeight: 500,
marginBottom: 12,
color: palette.text,
}}
>
{card.title} </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 6,
    }}
  >
    {card.rows.map((row, ri) =>
      row.map((cell, ci) => (
        <div
          key={`${ri}-${ci}`}
          style={{
            fontSize: 12,
            padding: "6px 10px",
            background: palette.navyRaised,
            borderRadius: 6,
            fontFamily: "monospace",
            color: palette.text,
          }}
        >
          {cell}
        </div>
      ))
    )}
  </div>

  {card.tip && <TipBlock text={card.tip} />}
</div>


);
}

function TopicView({ topic }) {
return ( <div>
<div style={{ marginBottom: 16 }}>
<div
style={{
display: "flex",
alignItems: "center",
gap: 8,
marginBottom: 4,
}}
>
<span style={{ fontSize: 20 }}>
{topic.icon} </span>


      <span
        style={{
          fontSize: 17,
          fontWeight: 500,
          color: palette.text,
        }}
      >
        {topic.title}
      </span>

      <Badge
        text={topic.badge}
        color={topic.badgeColor}
      />
    </div>

    <p
      style={{
        fontSize: 13,
        color: palette.muted,
        margin: 0,
        lineHeight: 1.6,
      }}
    >
      {topic.summary}
    </p>
  </div>

  {topic.cards.map((card, i) =>
    card.type === "table" ? (
      <TableCard key={i} card={card} />
    ) : (
      <ConceptCard key={i} card={card} />
    )
  )}
</div>


);
}

export default function RevisionViewer({
chapterData,
}) {
const chapterKeys =
Object.keys(chapterData);

const [activeChapter, setActiveChapter] =
useState(chapterKeys[0]);

const [activeTopic, setActiveTopic] =
useState(0);

const data =
chapterData[activeChapter];

const topic =
data.topics[activeTopic];

return (
<div
style={{
fontFamily:
"var(--font-sans, sans-serif)",
margin: "0 auto",
padding: "1rem",
background: palette.ink,

    "--color-background-primary":
      palette.navy,

    "--color-background-secondary":
      palette.navyRaised,

    "--color-background-tertiary":
      palette.navyHover,

    "--color-text-primary":
      palette.text,

    "--color-text-secondary":
      palette.muted,

    "--color-text-tertiary":
      "#6F7785",
  }}
>
  <div
    style={{
      background: palette.navy,
      border: `1px solid ${palette.border}`,
      borderRadius: 14,
      overflow: "hidden",
      boxShadow:
        "0 0 40px rgba(217,178,92,0.08)",
    }}
  >
    {/* Header */}

    <div
      style={{
        padding: "14px 18px",
        borderBottom: `1px solid ${palette.border}`,
        background: palette.navyRaised,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: palette.gold,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {data.exam} · {data.subject}
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: palette.text,
            marginTop: 2,
          }}
        >
          {data.chapter}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
        }}
      >
        {chapterKeys.map((k) => (
          <button
            key={k}
            onClick={() => {
              setActiveChapter(k);
              setActiveTopic(0);
            }}
            style={{
              padding: "5px 12px",
              fontSize: 12,
              borderRadius: 20,
              cursor: "pointer",

              border:
                activeChapter === k
                  ? `1px solid ${palette.gold}`
                  : `1px solid ${palette.border}`,

              background:
                activeChapter === k
                  ? palette.goldSoft
                  : "transparent",

              color:
                activeChapter === k
                  ? palette.gold
                  : palette.muted,
            }}
          >
            {chapterData[k].chapter}
          </button>
        ))}
      </div>
    </div>

    <div
      style={{
        display: "flex",
        minHeight: 500,
      }}
    >
      {/* Sidebar */}

      <div
        style={{
          width: 190,
          flexShrink: 0,
          borderRight: `1px solid ${palette.border}`,
          padding: "10px 8px",
          background:
            palette.navyRaised,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: palette.gold,
            textTransform:
              "uppercase",
            letterSpacing:
              "0.07em",
            padding: "0 8px",
            marginBottom: 6,
          }}
        >
          Topics (
          {data.topics.length})
        </div>

        {data.topics.map((t, i) => (
          <button
            key={t.id}
            onClick={() =>
              setActiveTopic(i)
            }
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",

              background:
                activeTopic === i
                  ? palette.goldSoft
                  : "transparent",

              color:
                activeTopic === i
                  ? palette.gold
                  : palette.muted,

              fontSize: 13,
              fontWeight:
                activeTopic === i
                  ? 500
                  : 400,

              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              {t.icon}
            </span>

            <span>{t.title}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}

      <div
        style={{
          flex: 1,
          padding: "16px 18px",
          overflowY: "auto",
          background: palette.navy,
        }}
      >
        <TopicView topic={topic} />
      </div>
    </div>

    {/* Footer */}

    <div
      style={{
        borderTop: `1px solid ${palette.border}`,
        background:
          palette.navyRaised,
        padding: "10px 18px",

        display: "flex",
        justifyContent:
          "space-between",

        alignItems: "center",
      }}
    >
      <button
        onClick={() =>
          setActiveTopic(
            Math.max(
              0,
              activeTopic - 1
            )
          )
        }
        disabled={activeTopic === 0}
        style={{
          padding: "6px 14px",
          fontSize: 13,
          borderRadius: 8,

          border: `1px solid ${palette.border}`,

          background:
            palette.navyHover,

          color:
            activeTopic === 0
              ? "#596170"
              : palette.text,
        }}
      >
        ← Previous
      </button>

      <span
        style={{
          fontSize: 12,
          color: palette.muted,
        }}
      >
        {activeTopic + 1} /{" "}
        {data.topics.length}
      </span>

      <button
        onClick={() =>
          setActiveTopic(
            Math.min(
              data.topics.length - 1,
              activeTopic + 1
            )
          )
        }
        disabled={
          activeTopic ===
          data.topics.length - 1
        }
        style={{
          padding: "6px 14px",
          fontSize: 13,
          borderRadius: 8,

          border: `1px solid ${palette.border}`,

          background:
            palette.navyHover,

          color:
            activeTopic ===
            data.topics.length - 1
              ? "#596170"
              : palette.text,
        }}
      >
        Next →
      </button>
    </div>
  </div>
</div>


);
}
