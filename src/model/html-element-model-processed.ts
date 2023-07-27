import { HTMLElementModel } from "./html-element-model";

export interface HTMLElementModelProcessed extends HTMLElementModel {
    elm: HTMLElement,
    events: {fire: Function},
    super?: HTMLElement
    refs: {[key: string]: HTMLElement},
}
