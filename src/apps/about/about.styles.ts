import { styled } from "../../pmod";

export const Header = styled("div", {
  display: "flex",
  gap: "var(--space-lg)",
  alignItems: "center",
  padding: "var(--space-xl) var(--space-lg)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)",
});

export const Avatar = styled("div", {
  width: "110px",
  height: "110px",
  borderRadius: "16px",
  overflow: "hidden",
  flexShrink: "0",
  border: "2px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
});

export const HeaderText = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  flex: "1",
});

export const Name = styled("h1", {
  fontSize: "22px",
  fontWeight: "700",
  color: "var(--text-primary)",
  margin: "0",
  letterSpacing: "-0.02em",
});

export const Role = styled("p", {
  fontSize: "14px",
  color: "var(--text-secondary)",
  margin: "0",
  fontWeight: "500",
});

export const Location = styled("p", {
  fontSize: "12px",
  color: "var(--text-muted)",
  margin: "0",
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

export const Section = styled("div", {
  padding: "var(--space-lg)",
  paddingTop: "var(--space-md)",
  paddingBottom: "var(--space-lg)",
});

export const SectionTitle = styled("h2", {
  fontSize: "11px",
  fontWeight: "700",
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  margin: "0 0 var(--space-md) 0",
});

export const Bio = styled("p", {
  fontSize: "14px",
  color: "var(--text-secondary)",
  lineHeight: "1.7",
  margin: "0",
});

export const SkillGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "var(--space-sm)",
  marginTop: "var(--space-sm)",
});

export const Skill = styled("div", {
  padding: "var(--space-sm) var(--space-md)",
  background: "var(--bg-soft)",
  borderRadius: "var(--radius-md)",
  fontSize: "12px",
  color: "var(--text-secondary)",
  border: "1px solid rgba(255,255,255,0.06)",
  fontWeight: "500",
  transition: "all 0.2s ease",
  textAlign: "center",
  wordBreak: "break-word",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ":hover":
    "background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); transform: translateY(-1px);",
});

export const Experience = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  padding: "var(--space-md)",
  borderRadius: "var(--radius-md)",
  transition: "all 0.2s ease",
  border: "1px solid transparent",
  ":hover":
    "background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transform: translateY(-1px);",
});

export const ExpTitle = styled("div", {
  fontSize: "15px",
  fontWeight: "600",
  color: "var(--text-primary)",
  letterSpacing: "-0.01em",
});

export const ExpMeta = styled("div", {
  fontSize: "13px",
  color: "var(--text-muted)",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const Divider = styled("div", {
  height: "1px",
  background:
    "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
  margin: "var(--space-md) 0",
  opacity: "0.8",
});

export const ExpMetaDot = styled("span", {
  width: "4px",
  height: "4px",
  background: "var(--text-muted)",
  opacity: "0.5",
  borderRadius: "50%",
});
