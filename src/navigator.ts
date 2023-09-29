import { resetFlexCSS } from "./flexcss";
import { genel } from "./html-generator";
import { HTMLElementModel } from "./model/html-element-model";
import { IPage } from "./model/ipage";
import { IRote } from "./model/iroute";
import { HeaderComp } from "./pages/shared/header-comp";
import { routes } from "./routes";

const notFoundPage: HTMLElementModel = {
    tag: 'main',
    childs: [{tag: 'h1', textContent: 'Page not found!'}]
};

type ComponentCss = {mainClass: string, getCss: Function};

const generatedPages: {path: string, page: IPage, componentsCSS: ComponentCss[]}[] = [];
let header: HeaderComp | undefined;

let componentsCSS: ComponentCss[] = [];
let globalCSS: Function[] = [];

export function restorePage() {
    let params = (new URL(document.location.href)).searchParams;
    let path = params.get("page");
    path = path ? path.trim() : '';
    if (path == '' || path == '/') {
        path = sessionStorage.getItem('path') || '';
    }
    navToPage(path);
}

export function navToPage(pagePath: string) {
    pagePath = !pagePath || pagePath.trim() == '' ? 'home' : pagePath.trim();
    sessionStorage.setItem('path', pagePath);

    header = header || new HeaderComp();
    let page = getPageByPath(pagePath);

    let pageCss = document.getElementById('page-css');
    if (pageCss) {
        document.head.removeChild(pageCss);
    }
    if (page.pageCss) {
        pageCss = genel({tag: 'link', id: 'page-css', href: page.pageCss, rel: 'stylesheet'}).elm;
        document.head.append(pageCss);
    }

    document.body.innerHTML = '';
    
    genComponentsCSS();
    
    document.body.append(header.mainPanel);
    header.init();
 
    document.body.append(page.mainPanel);
    page.init();

    resetFlexCSS();

    componentsCSS = [];
}

export function addComponentCSS(getCss: Function, mainClass = '') {
    if (!getCss) return;
    componentsCSS.push({getCss, mainClass});
}

export function addGlobalCSS(css: Function) {
    if (!css) return;
    globalCSS.push(css);
}

export function genComponentsCSS() {
    let compStyles = document.getElementById('compStyles');
    if (compStyles) {
        document.head.removeChild(compStyles);
    }

    let pagePath = sessionStorage.getItem('path');
    let generatedPage = generatedPages.find(p => p.path === pagePath);
    if (!generatedPage) return;
    let cssList = generatedPage.componentsCSS.map(cs => processCss(cs.getCss(), cs.mainClass));
    cssList = [...globalCSS.map(gcss => gcss()), ...cssList];
    compStyles = genel({tag: 'style', id: 'compStyles', textContent: cssList.join('\n\n')}).elm;
    document.head.append(compStyles);
}

function getPageByPath(path: string): IPage {
    routes.forEach(r => r.isActive = false);
    let rote = routes.find(pg => pg.path == path);
    if (!rote) {
        rote = routes.find(r => r.path === 'home');
    }
    if (rote) {
        rote.isActive = true;
        return generatePage(rote);
    }
    return {
        mainPanel: genel(notFoundPage).elm,
        init: () => null
    };
}

function generatePage(rote: IRote) {
    let generatedPage = generatedPages.find(p => p.path === rote.path);
    if (generatedPage) {
        componentsCSS = generatedPage.componentsCSS;    
        return generatedPage.page
    }
    let page = rote.createPage();
    generatedPages.push({path: rote.path, page, componentsCSS});
    return page;
}

function processCss(css: string, mainClass: string) {
    return css.split('}')
        .filter(e => e.trim().length > 0)
        .map(e => `.${mainClass} ${(e + '}').trim()}`)
        .join('\n');
}
