
import { genChild, genChilds, genel } from "../html-generator";
import { HTMLElementModel } from "../model/html-element-model";
import { IPage } from "../model/ipage";
import { addComponentCSS } from "../navigator";

export class FlexCSSPage implements IPage {

    mainPanel = genel({tag: 'main'}).elm;

    model: HTMLElementModel = {
        tag: 'div', mainClass: 'flexcss', className: 'grid', childs: [
            {tag: 'div', className: 'panel panel1 xs-col6 m-col9', childs: [
                {tag: 'div', className: 'output', childs: [
                    {tag: 'p', className: 'xs-lbxs m-lbxs', textContent: 'xs-col6 (6/6)'},
                    {tag: 'p', className: 'm-lbm', textContent: 'm-col9 (9/18)'}
                ]}
            ]},
            {tag: 'div', className: 'panel panel2 xs-col6 m-col9 xl-col6', childs: [
                {tag: 'div', className: 'output', childs: [
                    {tag: 'p', className: 'xs-lbxs m-lbxs', textContent: 'xs-col6 (6/6)'},
                    {tag: 'p', className: 'm-lbm xl-lbm', textContent: 'm-col9 (9/18)'},
                    {tag: 'p', className: 'xl-lbxl', textContent: 'xl-col6 (6/24)'}
                ]}
            ]},
            {tag: 'div', className: 'panel panel3 xs-col6 xl-col6', childs: [
                {tag: 'div', className: 'output', childs: [
                    {tag: 'p', className: 'xs-lbxs xl-lbxs', textContent: 'xs-col6 (6/6)'},
                    {tag: 'p', className: 'xl-lbxl', textContent: 'xl-col6 (6/24)'}
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
