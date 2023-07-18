
export interface HTMLElementModel extends Partial<Record<keyof HTMLElement, any>> {
    tag: string,
    ref?: string,
    childs?: HTMLElementModel[] | HTMLElementModel | any,
    [k: string]: any
}
