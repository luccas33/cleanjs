import { CSSInfo } from "./model/css-info";

/**
 * element: HTMLElement,
 * 
 * css: object with css properties
 * css.selector: select childs with css selector
 * css.styles: css object list to apply on childs
 */
export function applyCSS(element: HTMLElement, css: CSSInfo) {
    if (!element || !css) {
        return;
    }
    element.style;
    css = { ...css };
    let selector = css.selector;
    delete css.selector;
    if (selector) {
        element.querySelectorAll(selector)
            .forEach((elmt) => applyCSS(elmt as HTMLElement, css));
        return;
    }
    let styles = css.styles;
    delete css.styles;
    Object.keys(css).forEach((prop) => {
        setValue(element.style, prop, css[prop as any]);
    });
    if (!styles) {
        return;
    }
    if (!Array.isArray(styles)) {
        styles = [styles];
    }
    styles.forEach((style: any) => {
        if (!style.selector) {
            return;
        }
        style = { ...style };
        let slct = style.selector;
        delete style.selector;
        element.querySelectorAll(slct).forEach((elmt) => applyCSS(elmt, style));
    });
}

function setValue(obj: any, param: string, value: any) {
    obj[param] = value;
}
