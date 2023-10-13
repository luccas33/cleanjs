
type GridInfo = {prefix: string, columns: number}

const defaultGrid: GridInfo[] = [
    {prefix: 'xs-', columns: 6},
    {prefix: 's-', columns: 12},
    {prefix: 'm-', columns: 18},
    {prefix: 'l-', columns: 24},
    {prefix: 'xl-', columns: 24}
]

export function getGridStyle(grid = defaultGrid) {
    let style = '';
    let maxColumns = [...grid].sort((pc1, pc2) => pc2.columns - pc1.columns)[0].columns;
    console.log('maxColumns: ', maxColumns);
    grid.forEach(pc => {
        for(let i = 1; i <= maxColumns; i++) {
            let size = i > pc.columns ? pc.columns : i;
            style += `.${pc.prefix}col${i} {width: calc(${size}00% / ${pc.columns})} \n`;
        }
    });
    return style;
}
