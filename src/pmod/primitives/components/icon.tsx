import { h } from "@prestonarnold/fuse";
import { icons, IconName } from "../../../utils/icons";

interface IconProps {
  name: IconName;
  size?: number | (() => number);
  color?: string | (() => string);
  strokeWidth?: number | (() => number);
  class?: string | (() => string);
}

export function Icon({
  name,
  size = 20,
  color = "#ffffff",
  strokeWidth = 2,
  class: className,
}: IconProps) {
  const iconData = icons[name];
  if (!iconData) return null;

  const paths = iconData.map(([tag, attrs]) => h(tag, attrs));

  return (
    <svg
      width={() => (typeof size === "function" ? size() : size)}
      height={() => (typeof size === "function" ? size() : size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke={() => (typeof color === "function" ? color() : color)}
      stroke-width={() =>
        typeof strokeWidth === "function" ? strokeWidth() : strokeWidth
      }
      stroke-linecap="round"
      stroke-linejoin="round"
      class={() =>
        typeof className === "function" ? className() : className || ""
      }
    >
      {paths}
    </svg>
  );
}
