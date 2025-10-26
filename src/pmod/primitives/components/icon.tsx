import { icons } from "lucide";

interface IconProps {
    name: keyof typeof icons;
    size?: number;
    color?: string;
    strokeWidth?: number;
    class?: string;
}

export function Icon({ name, size = 20, color = '#ffffff', strokeWidth = 2, class: className }: IconProps) {
    const iconData = icons[name];
    if (!iconData) return null;
    
    // Lucide gives us arrays of [tag, attrs] tuples
    const elements = iconData as Array<[string, Record<string, any>]>;
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", color);
    svg.setAttribute("stroke-width", String(strokeWidth));
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    if (className) svg.setAttribute("class", className);
    
    // Add each path/shape element (I'd imagine this is performant lol)
    elements.forEach(([tag, attrs]) => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        Object.entries(attrs).forEach(([key, value]) => {
            el.setAttribute(key, String(value));
        });
        svg.appendChild(el);
    });
    
    return svg;
}
