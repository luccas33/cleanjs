import { IComponent } from "./icomponent";

export type ElementChildModel = HTMLElementModel | HTMLElement | IComponent | Function | any;
export interface HTMLElementModel extends Partial<Record<keyof HTMLElement, any>> {
    tag: string,
    ref?: string,
    mainClass?: string,
    childs?: ElementChildModel | ElementChildModel[],
    [k: string]: any
}
