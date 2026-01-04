import { styled } from "../../pmod";

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: "#1a1b26",
  color: "#a9b1d6",
  fontFamily: "monospace",
  fontSize: "14px",
  padding: "12px",
});

export const Output = styled("div", {
  flex: "1",
  overflowY: "auto",
  whiteSpace: "pre-wrap",
  marginBottom: "12px",
});

export const InputLine = styled("div", {
  display: "flex",
  gap: "8px",
});

export const Prompt = styled("span", {
  color: "#9ece6a",
});

export const Input = styled("input", {
  flex: "1",
  background: "transparent",
  border: "none",
  color: "#c0caf5",
  fontFamily: "inherit",
  fontSize: "inherit",
  outline: "none",
});
