import { styled } from "../../pmod";

export const Card = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-sm)",
  background: "var(--bg-soft)",
  borderRadius: "var(--radius-base)",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "var(--space-sm)",
  marginBottom: "var(--space-sm)",
  transition: "all 0.2s ease",
  cursor: "pointer",
  ":hover": "background: rgba(255,255,255,0.03); transform: translateY(-1px);",
});

export const Detail = styled("div", {
  fontSize: "13px",
  color: "var(--text-secondary)",
  display: "flex",
  alignItems: "center",
  gap: "6px",
});
