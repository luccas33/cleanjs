import { HTMLElementModel } from "./html-element-model";

export interface HTMLElementModelProcessed extends HTMLElementModel {
    elm: HTMLElement,
    super?: HTMLElement
    refs: {[key: string]: HTMLElement},
}
