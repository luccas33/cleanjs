
import { genChild, genChilds, genel } from "../html-generator";
import { HTMLElementModel } from "../model/html-element-model";
import { IPage } from "../model/ipage";
import { addComponentCSS } from "../navigator";

export class FlexCSSPage implements IPage {

    mainPanel = genel({tag: 'main'}).elm;

    model: HTMLElementModel = {
        tag: 'div', mainClass: 'flexcss', className: 'grid', childs: [
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
        ]
    };

    constructor() {
        addComponentCSS(this.getCss, this.model.mainClass!);
    }

    init() {
        genChild(this.mainPanel, this.model);
    }

    getCss() {
        return `
            .grid {
                display: flex;
                flex-wrap: wrap;
            }

            .panel {
                height: 150px;
                align-items: center;
                display: flex;
            }

            .output {
                margin-left: auto;
                margin-right: auto;
            }

            p {
                text-align: center;
                margin: 4px;
                font-size: 18px;
            }

            .xs-lbxs, .s-lbs, .m-lbm, .l-lbl, .xl-lbxl {font-weight: bolder;}

            .panel1 {background-color: #fcffb0;}

            .xs-panel1 {width: 100%;}
            .m-panel1 {width: 60%;}
            .l-panel1 {width: 50%;}


            .panel2 {background-color: #adff9c;}

            .xs-panel2 {width: 100%;}
            .s-panel2 {width: 60%;}
            .m-panel2 {width: 25%;}
            .l-panel2 {width: 30%;}
            .xl-panel2 {width: 25%;}

            .panel3 {background-color: #a3daff;}

            .xs-panel3 {width: 100%;}
            .s-panel3 {width: 40%;}
            .m-panel3 {width: 15%;}
            .l-panel3 {width: 20%;}
            .xl-panel3 {width: 25%;}

        `;
    }

}
