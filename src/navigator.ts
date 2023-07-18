import { resetFlexCSS } from "./flexcss";
import { genel } from "./html-generator";
import { HTMLElementModel } from "./model/html-element-model";
import { IPage } from "./model/ipage";
import { HeaderComp } from "./pages/shared/header-comp";
import { routes } from "./routes";

const notFoundPage: HTMLElementModel = {
    tag: 'main',
    childs: [{tag: 'h1', textContent: 'Page not found!'}]
};

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
    pagePath = pagePath ? pagePath.trim() : '';
    sessionStorage.setItem('path', pagePath);

    let page = getPageByPath(pagePath);
    let header = new HeaderComp();

    let pageCss = document.getElementById('page-css');
    if (pageCss) {
        document.head.removeChild(pageCss);
    }
    if (page.pageCss) {
        pageCss = genel({tag: 'link', id: 'page-css', href: page.pageCss, rel: 'stylesheet'}).elm;
        document.head.append(pageCss);
    }

    document.body.innerHTML = '';
    
    document.body.append(header.mainPanel);
    header.init();
 
    document.body.append(page.mainPanel);
    page.init();

    resetFlexCSS();
}

function getPageByPath(path: string): IPage {
    routes.forEach(r => r.isActive = false);
    let rote = routes.find(pg => pg.path == path);
    if (!rote) {
        rote = routes.find(r => r.path === 'home');
    }
    if (rote) {
        rote.isActive = true;
        return rote.createComponent();
    }
    return {
        mainPanel: genel(notFoundPage).elm,
        init: () => null
    };
}
