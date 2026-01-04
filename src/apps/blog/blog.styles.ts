import { styled } from "../../pmod";

export const PostCard = styled("div", {
  padding: "var(--space-md)",
  background: "var(--bg-soft)",
  borderRadius: "var(--radius-base)",
  border: "1px solid rgba(255,255,255,0.06)",
  cursor: "pointer",
  transition: "all 0.2s ease",
});

export const PostDate = styled("div", {
  fontSize: "var(--text-sm)",
  color: "var(--text-muted)",
  marginTop: "var(--space-xs)",
  display: "flex",
  gap: "var(--space-sm)",
  alignItems: "center",
});

export const ReadingTime = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
});

export const PostDescription = styled("div", {
  fontSize: "var(--text-sm)",
  color: "var(--text-secondary)",
  marginTop: "var(--space-sm)",
});

export const TagsContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-xs)",
  marginTop: "var(--space-sm)",
});

export const Tag = styled("span", {
  fontSize: "var(--text-xs)",
  padding: "2px 8px",
  borderRadius: "var(--radius-sm)",
  background: "var(--bg-muted)",
  color: "var(--text-muted)",
});
