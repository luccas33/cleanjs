
export interface CSSInfo extends Partial<Record<keyof CSSStyleDeclaration, any>> {
    selector?: string,
    styles?: CSSInfo[]
}
