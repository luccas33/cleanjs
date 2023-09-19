
import { genChilds, genel } from "../html-generator";
import { IPage } from "../model/ipage";

export class FlexCSSPage implements IPage {
    public readonly mainPanel = genel({tag: 'main', className: 'grid'}).elm;
    public readonly pageCss = '/styles/flex-css.css';
    init() {
        genChilds(this.mainPanel, [
            {tag: 'div', className: 'panel fx-xs-m-l-panel1', childs: [
                {tag: 'div', className: 'output', childs: [
                    {tag: 'p', className: 'xs-lbxs m-lbxs', textContent: 'xs: 100%'},
                    {tag: 'p', className: 'xs-lbm m-lbm l-lbm', textContent: 'm: 60%'},
                    {tag: 'p', className: 'xs-lbl l-lbl', textContent: 'l: 50%'}
                ]}
            ]},
            {tag: 'div', className: 'panel fx-xs-s-m-l-xl-panel2', childs: [
                {tag: 'div', className: 'output', childs: [
                    {tag: 'p', className: 'xs-lbxs s-lbxs', textContent: 'xs: 100%'},
                    {tag: 'p', className: 's-lbs m-lbs', textContent: 's: 60%'},
                    {tag: 'p', className: 'm-lbm l-lbm', textContent: 'm: 25%'},
                    {tag: 'p', className: 'l-lbl xl-lbl', textContent: 'l: 30%'},
                    {tag: 'p', className: 'xl-lbxl', textContent: 'xl: 25%'}
                ]}
            ]},
            {tag: 'div', className: 'panel fx-xs-s-m-l-xl-panel3', childs: [
                {tag: 'div', className: 'output', childs: [
                    {tag: 'p', className: 'xs-lbxs s-lbxs', textContent: 'xs: 100%'},
                    {tag: 'p', className: 's-lbs m-lbs', textContent: 's: 40%'},
                    {tag: 'p', className: 'm-lbm l-lbm', textContent: 'm: 15%'},
                    {tag: 'p', className: 'l-lbl xl-lbl', textContent: 'l: 20%'},
                    {tag: 'p', className: 'xl-lbxl', textContent: 'xl: 25%'}
                ]}
            ]}
        ]);
    }
}
