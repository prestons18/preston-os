import { Children, h } from "fuse";

interface HStackProps {
  children?: Children;
  gap?: number;
  style?: string;
  class?: string;
  [key: string]: any;
}

export function HStack({ children, gap = 8, style = '', class: className = '', ...props }: HStackProps) {
  return h('div', {
    ...props,
    style: `display: flex; flex-direction: row; gap: ${gap}px; ${style}`.trim()
  }, children as any);
}

export const hstack = HStack;