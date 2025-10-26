import { Children, h } from "fuse";

interface ButtonProps {
  children?: Children;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (event: Event) => void;
  class?: string;
  style?: string;
  [key: string]: any;
}
const sizeClasses = {
  sm: 'text-sm px-2 py-1',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500',
  ghost: 'bg-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-300',
  link: 'bg-transparent text-blue-600 hover:underline p-0',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  class: className = '',
  style = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  return h('button', {
    ...props,
    type,
    disabled,
    onclick: onClick,
    class: [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    ].filter(Boolean).join(' ').trim(),
    style: style.trim(),
  }, children as any);
}

export const button = (props: ButtonProps) => Button(props);
