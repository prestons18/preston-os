export {};

declare global {
  namespace JSX {
    // FG reactivity primative
    type MaybeFn<T> = T | (() => T);

    // Base element model
    type DOMElement = HTMLElement | SVGElement;

    // HTML + SVG events
    type EventHandlers<T extends Element> = {
      [K in keyof GlobalEventHandlersEventMap as `on${Capitalize<
        string & K
      >}`]?: (event: GlobalEventHandlersEventMap[K]) => void;
    };

    // Shared attributes

    type BaseAttributes<T extends Element> = {
      id?: MaybeFn<string>;
      title?: MaybeFn<string>;

      class?: MaybeFn<string>;
      className?: MaybeFn<string>;

      style?: MaybeFn<string | Partial<CSSStyleDeclaration>>;

      ref?: (el: T | null) => void;

      // Arbitary attributes (data-*, aria-*, etc.)
      // Can also be reactive
      [attr: string]: any;
    };

    type Props<T extends Element> = BaseAttributes<T> & EventHandlers<T>;

    // Html Elements
    type HTMLTags = keyof HTMLElementTagNameMap;
    type HTMLElementProps = {
      [K in HTMLTags]: Props<HTMLElementTagNameMap[K]>;
    };

    // SVG Elements
    type SVGTags = keyof SVGElementTagNameMap;
    type SVGElementProps = {
      [K in SVGTags]: Props<SVGElementTagNameMap[K]>;
    };

    // JSX Instrict
    interface IntrinsicElements extends HTMLElementProps, SVGElementProps {}
  }
}
