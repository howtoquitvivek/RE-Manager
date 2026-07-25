import React from "react";

/**
 * Normalizes the render prop for Base UI components to support both:
 * 1. render={() => <Element />} (Base UI standard)
 * 2. asChild + children (Radix standard)
 * 3. raw element passed to render (My previous normalization)
 */
export function normalizeRender(render: any, children: any, asChild?: boolean) {
  if (render) {
    if (typeof render === "function") {
      return (props: any) => {
        const element = render(props);
        if (React.isValidElement(element)) {
          const reactEl = element as React.ReactElement<any>;
          // If the element has no children and we have children to inject
          if (!reactEl.props.children && children) {
            return React.cloneElement(reactEl, {}, children);
          }
        }
        return element;
      };
    }
    return (props: any) => React.cloneElement(render as React.ReactElement, props);
  }
  
  if (asChild && children) {
    return (props: any) => React.cloneElement(children as React.ReactElement, props);
  }
  
  return undefined;
}
