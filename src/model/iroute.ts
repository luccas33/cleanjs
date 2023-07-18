export interface IRote {
    path: string,
    label: string,
    createComponent: Function,
    isActive?: boolean
}