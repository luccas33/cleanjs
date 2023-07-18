export interface IRote {
    path: string,
    label: string,
    createPage: Function,
    isActive?: boolean
}