import { h } from "fuse";

type StyleObj = Record<string, string | number>;
type Variants<T extends string> = Record<T, StyleObj>;

export function styled<V extends string = never>(
  tag: string,
  base: StyleObj,
  variants?: Variants<V>
) {
  return (props: any) => {
    let style = { ...base };
    if (variants && props.variant) {
      style = { ...style, ...variants[props.variant as V] };
    }
    const { variant, style: extraStyle, ...rest } = props;
    const baseStyle = toStyleString(style);
    const finalStyle = typeof extraStyle === 'function' 
      ? () => baseStyle + ';' + extraStyle()
      : baseStyle + (extraStyle ? `;${extraStyle}` : '');
    return h(tag, { ...rest, style: finalStyle }, props.children);
  };
}

const toStyleString = (obj: StyleObj) =>
  Object.entries(obj).map(([k, v]) => `${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${v}`).join(';');