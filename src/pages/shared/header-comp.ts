import { genel } from "../../html-generator";
import { IComponent } from "../../model/icomponent";
import { routes } from "../../routes";
import {  navToPage } from "../../navigator";
import { HTMLElementModel } from "../../model/html-element-model";

export class HeaderComp implements IComponent {

    model: HTMLElementModel = {
        tag: 'header', 
        mainClass: 'header-comp', 
        css: this.getCss(), 
        childs: [
            {
                tag: 'div',
                className: 'title',
                childs: [{tag: 'h2', textContent: 'Clean JS'}]
            },
            this.createNavigation()
    ]}

    mainPanel = genel(this.model).elm;

    init() {}

    createNavigation(): HTMLElementModel {
        let inactives = routes.filter(r => !r.isActive);
        return {
            tag: 'nav', 
            childs: inactives.map(r => {
                return {
                    tag: 'a', 
                    textContent: r.label, 
                    onclick: () => navToPage(r.path),
                    className: 'nav-item'
                }
            })
        };
    }

    getCss() {
        return `
            .header {
                display: flex;
            }
    
            .title {
                width: 50%;
            }
    
            nav {
                display: flex;
                align-items: center;
                width: 50%
            }
    
            .nav-item {
                display: block;
                font-weight: bolder;
                cursor: pointer;
                margin-left: 3px;
                margin-right: 3px;
                padding: 4px 3px 0 4px;
                border-right: 2px solid rgb(0, 101, 195);
                border-bottom: 2px solid rgb(0, 101, 195);
                background-color: #0084ff;
                color: white;
                border-radius: 3px;
            }
        `;
    }

}
