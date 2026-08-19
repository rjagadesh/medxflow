// A short, quotable "answer-first" block for Answer Engine Optimization (AEO):
// AI answer engines (Google AI Overviews, ChatGPT, Perplexity, Claude) and
// featured snippets pull a concise, self-contained answer from near the top of
// a page. Styled with inline styles so it renders correctly inside any page's
// CSS scope (.eirim, .pillar, etc.) without collisions.
export default function AnswerBox({ label = "Quick answer", children }) {
  return (
    <div
      style={{
        background: "#F2F6FB",
        border: "1px solid #CFE0F2",
        borderLeft: "4px solid #17C3B2",
        borderRadius: "12px",
        padding: "18px 20px",
        margin: "22px 0",
        maxWidth: "720px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "#0E8A7D",
          margin: "0 0 8px",
        }}
      >
        {label}
      </div>
      <p style={{ fontSize: "17px", lineHeight: 1.6, color: "#22364B", margin: 0, fontWeight: 500 }}>
        {children}
      </p>
    </div>
  );
}
