import { styled } from "../../pmod";

export const BrowserHeader = styled("div", {
  padding: "var(--space-sm) var(--space-md)",
  background: "var(--bg-soft)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  alignItems: "center",
  gap: "var(--space-sm)",
});

export const AddressBar = styled("div", {
  flex: "1",
  padding: "var(--space-xs) var(--space-sm)",
  background: "var(--bg-base)",
  borderRadius: "var(--radius-sm)",
  fontSize: "var(--text-sm)",
  color: "var(--text-secondary)",
  border: "1px solid rgba(255,255,255,0.06)",
});

export const BrowserContent = styled("div", {
  flex: "1",
  overflowY: "auto",
  padding: "var(--space-lg)",
  background: "var(--bg-base)",
});

export const PostMeta = styled("div", {
  maxWidth: "800px",
  margin: "0 auto var(--space-lg)",
  paddingBottom: "var(--space-md)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
});

export const PostTitle = styled("h1", {
  fontSize: "var(--text-3xl)",
  fontWeight: "700",
  marginBottom: "var(--space-sm)",
  color: "var(--text-primary)",
});

export const PostDate = styled("div", {
  fontSize: "var(--text-sm)",
  color: "var(--text-muted)",
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
  fontSize: "var(--text-base)",
  color: "var(--text-secondary)",
  marginTop: "var(--space-sm)",
});

export const Tag = styled("span", {
  fontSize: "var(--text-xs)",
  padding: "4px 10px",
  marginRight: "var(--space-xs)",
  borderRadius: "999px",
  background: "var(--bg-muted)",
  color: "var(--text-muted)",
  border: "1px solid rgba(255,255,255,0.1)",
});

export const MarkdownStyles = `
.markdown-content {
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.7;
    color: var(--text-secondary);
}
.markdown-content h1, .markdown-content h2, .markdown-content h3 {
    color: var(--text-primary);
    margin-top: var(--space-lg);
    margin-bottom: var(--space-sm);
}
.markdown-content p { margin-bottom: var(--space-md); }
.markdown-content ul, .markdown-content ol {
    padding-left: var(--space-xl);
    margin-bottom: var(--space-md);
}
.markdown-content li { margin-bottom: var(--space-xs); }
.markdown-content code {
    background: var(--bg-soft);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
}
.markdown-content pre {
    background: var(--bg-soft);
    padding: var(--space-md);
    border-radius: var(--radius-base);
    overflow-x: auto;
}
.markdown-content a {
    color: var(--accent);
    text-decoration: none;
}
`;
