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
let globalCSSGenerated = false;

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
    componentsCSS = [];

    pagePath = !pagePath || pagePath.trim() == '' ? 'home' : pagePath.trim();
    sessionStorage.setItem('path', pagePath);

    if (!header) {
        header = new HeaderComp();
        header.init();
    }
    let page = getPageByPath(pagePath);
    page.init();

    let pageCss = document.getElementById('page-css');
    if (pageCss) {
        document.head.removeChild(pageCss);
    }
    if (page.pageCss) {
        pageCss = genel({tag: 'link', id: 'page-css', href: page.pageCss, rel: 'stylesheet'}).elm;
        document.head.append(pageCss);
    }

    
    if (!globalCSSGenerated) {
        genGlobalCSS();
        globalCSSGenerated = true;
    }
    genComponentsCSS();

    document.body.innerHTML = '';
    document.body.append(header.mainPanel);
    document.body.append(page.mainPanel);

    resetFlexCSS();
}

export function addComponentCSS(getCss: Function, mainClass: string) {
    if (!getCss || !mainClass) return;
    if (componentsCSS.find(ccss => ccss.mainClass == mainClass)) return;
    componentsCSS.push({getCss, mainClass});
}

export function addGlobalCSS(css: Function) {
    if (!css) return;
    globalCSS.push(css);
}

export function genComponentsCSS(reset = false) {
    let pagePath = sessionStorage.getItem('path');
    let generatedPage = generatedPages.find(p => p.path === pagePath);
    if (!generatedPage) return;

    let currentStyles: string[] = [];
    document.head.querySelectorAll('style').forEach(style => currentStyles.push(style.id));
    currentStyles = currentStyles.filter(current => current !== 'global_style');
    let pageStyles = generatedPage.componentsCSS.map(cs => `comp_style_${cs.mainClass}`);
    let stylesToRemove = currentStyles.filter(cs => !pageStyles.find(ps => cs == ps));
    if (reset) {
        stylesToRemove = currentStyles;
        currentStyles = [];
    }
    let stylesToAdd = pageStyles.filter(ps => !currentStyles.find(cs => ps == cs));

    let tagStylesToAdd = generatedPage.componentsCSS.filter(cs => stylesToAdd.find(sta => sta == `comp_style_${cs.mainClass}`))
        .map(cs => { 
            return genel({tag: 'style', id: `comp_style_${cs.mainClass}`, textContent: processCss(cs.getCss(), cs.mainClass)}).elm;
        });
    
    stylesToRemove.forEach(str => document.head.removeChild(document.getElementById(str)!));
    tagStylesToAdd.forEach(style => document.head.append(style));
}

export function genComponentCSS(mainClass: string) {
    let pagePath = sessionStorage.getItem('path');
    let generatedPage = generatedPages.find(p => p.path === pagePath);
    if (!generatedPage) return;

    let compCss = generatedPage.componentsCSS.find(cs => cs.mainClass === mainClass);
    if (!compCss) return;

    let id = `comp_style_${mainClass}`;
    let style = genel({tag: 'style', id, textContent: processCss(compCss.getCss(), mainClass)}).elm;

    let current = document.getElementById(id);
    if (current) {
        document.head.removeChild(current);
    }
    document.head.append(style);
}

export function genGlobalCSS() {
    let css = globalCSS.map(gcss => gcss()).join('\n');
    let global = genel({tag: 'style', id: 'global_style', textContent: css}).elm;

    let current = document.getElementById('global_style');
    if (current) {
        document.head.removeChild(current);
    }

    document.head.appendChild(global);
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
    mainClass = '.' + mainClass;
    return css.split('}')
        .filter(block => block.trim().length > 0)
        .map(block => {
            let selector = block.split('{')[0];
            let body = block.split('{')[1];
            selector = selector.split(',')
                .filter(s => s.trim().length > 0)
                .map(s => {
                    if (s.trim() == mainClass) return s;
                    let sArr = s.split(' ').filter(se => se.trim().length > 0);
                    sArr[0] += mainClass;
                    return sArr.join(' ');
                }).join(', ');
            return ` ${selector} { ${body} } `;
        })
        .join('\n');
}
