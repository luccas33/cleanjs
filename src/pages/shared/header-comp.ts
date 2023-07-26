import { addChilds, genel } from "../../html-generator";
import { IComponent } from "../../model/icomponent";
import { applyCSS } from '../../cssjs';
import { routes } from "../../routes";
import { navToPage } from "../../navigator";
import { HTMLElementModel } from "../../model/html-element-model";

export class HeaderComp implements IComponent {

    public readonly mainPanel: HTMLElement;
    
    constructor() {
        this.mainPanel = genel({tag: 'header'}).elm;
    }

    public init() {
        let models: HTMLElementModel[] = [
            {
                tag: 'div',
                style: css.title,
                childs: [{tag: 'h2', textContent: 'Clean JS'}]
            },
            this.createNavigation()
        ];
        addChilds(this.mainPanel, models);
        applyCSS(this.mainPanel, css.main);
    }

    createNavigation(): HTMLElementModel {
        let inactives = routes.filter(r => !r.isActive);
        return {
            tag: 'nav',
            style: css.nav,
            childs: inactives.map(r => {
                return {
                    tag: 'a', 
                    textContent: r.label, 
                    onclick: () => navToPage(r.path),
                    style: css.navItem
                }
            })
        };
    }

}

const css = {
    main: {
        display: 'flex',
        width: '100%'
    },
    title: {
        width: '50%'
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        width: '50%'
    },
    navItem: {
        display: 'block',
        fontWeight: 'bolder',
        cursor: 'pointer',
        marginLeft: '3px',
        marginRight: '3px',
        padding: '4px 3px 0 4px',
        borderRight: '2px solid rgb(0, 101, 195)',
        borderBottom: '2px solid rgb(0, 101, 195)',
        backgroundColor: '#0084ff',
        color: 'white',
        borderRadius: '3px'
    }
}
