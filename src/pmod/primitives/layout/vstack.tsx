import { Children, h } from "@prestonarnold/fuse";

interface VStackProps {
  children?: Children;
  gap?: number;
  style?: string;
  class?: string;
  [key: string]: any;
}

export function VStack({ 
  children, 
  gap = 8, 
  style = '',
  class: className = '',
  ...props 
}: VStackProps) {
  return h('div', {
    ...props,
    class: `flex flex-col gap-${gap} ${className}`.trim(),
    style: `display: flex; flex-direction: column; gap: ${gap}px; ${style}`.trim()
  }, children as any);
}

export const vstack = VStack;