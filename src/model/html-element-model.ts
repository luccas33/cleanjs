
export interface HTMLElementModel extends Partial<Record<keyof HTMLElement, any>> {
    tag: string,
    ref?: string,
    childs?: HTMLElementModel[],
    [k: string]: any
}
