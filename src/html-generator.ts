import { ElementChildModel, HTMLElementModel } from "./model/html-element-model";
import { HTMLElementModelProcessed } from "./model/html-element-model-processed";
import { IComponent } from "./model/icomponent";

export function genels(models: HTMLElementModel[]): HTMLElementModelProcessed[] {
    return models.map(model => genel(model));
}

/**
> Propriedades:

- tag: nome da tag HTML
- childs: tags filhas
- elm: o elemento HTML gerado
- ref: referência do elemento
- refs: objeto com os elementos referenciados (independente da hierarquia)
- Demais propriedades são atribuídas ao elemento HTML

> Functions:

- Functions recebem o objeto modelo no parâmetro
- Functions com nome iniciando com 'on' são eventListeners, com o evento na propriedade evt do modelo
- Functions com nome iniciando com 'listen' são eventListeners controlados pelo código. São executados com model.events.fire('NomeEvento').
- Demais functions são executadas e o retorno é atribuído ao elemento HTML
*/
export function genel(model: HTMLElementModel): HTMLElementModelProcessed {
    if (!model.tag) {
        let nullElm = document.createElement('div');
        nullElm.style.display = 'none';
        return {...model, elm: nullElm, refs: {}, events: {fire: () => {}}};
    }
    let elm = document.createElement(model.tag);
    model.elm = elm;
    model.ref = model.ref || model.id;
    let cssTxt = model.css && model.css.trim().length > 0 ? model.css : null;
    if (cssTxt) {
        let style = document.createElement('style');
        let mainClass = model.mainClass && model.mainClass.trim().length > 0 ? model.mainClass.trim() : null;
        style.innerHTML = mainClass ? processCss(cssTxt, mainClass) : cssTxt;
        elm.append(style);
    }
    let root = model.super || {};
    while (root.super) root = root.super;
    root.refs = root.refs || {};
    root.listeners = root.listeners || [];
    let fire = (name: string, evt?: any) => {fireListener(root.listeners, name, {...model, evt})};
    model.events = {fire};
    if (model.ref) {
        root.refs[model.ref] = elm;
    }
    model.refs = root.refs;
    Object.keys(model).forEach(key => {
        if (!key.startsWith('on')) {
            return;
        }
        let value = model[key];
        if (!value || typeof value !== 'function') return;
        let evtName = key.substring(2);
        elm.addEventListener(evtName, (evt: any) => value({...model, evt}));
    });
    Object.keys(model).forEach(k => {
        if (!k.startsWith('listen')) return;
        let value = model[k];
        if (!value || typeof value !== 'function') return;
        let name = k.substring(6);
        root.listeners.push({name, callback: value});
    });
    Object.keys(model).forEach(k => {
        if (k.startsWith('on') || k.startsWith('listen')) return;
        let v = model[k];
        if (v && typeof v === 'function') {
            v = v(model);
            model[k] = v;
        };
    });
    let elmValues = {};
    Object.keys(model).forEach(k => {
        if (k.startsWith('on')
            || k.startsWith('listen')
            || k === 'tag' 
            || k === 'refs'
            || k === 'ref'
            || k === 'super'
            || k === 'childs'
            || k === 'elm')
            return;
        setValue(elmValues, k, model[k])
    });
    applyValues(elmValues, elm);
    if (model.mainClass) {
        elm.classList.add(model.mainClass);
    }
    if (root.runOnInit && Array.isArray(root.runOnInit)) {
        root.runOnInit.forEach((run: any) => run());
    }
    model.childs = model.childs || [];
    model.childs = Array.isArray(model.childs) ? model.childs : [model.childs];
    model.childs.forEach((c: any) => {
        if (typeof c === 'function') {
            c = c(model);
        }
        if (!c) {
            return;
        }
        if ('tagName' in c) {
            elm.append(c);
            return;
        }
        if (c.mainPanel) {
            elm.append(c.mainPanel);
            if (typeof c.init == 'function')
                c.init();
            return;
        }
        if (model.mainClass) {
            c.mainClass = model.mainClass;
        }
        c.super = model;
        genel(c);
        elm.append(c.elm);
    });
    return model as HTMLElementModelProcessed;
}

export function removeChilds(elm: HTMLElement) {
    if (elm)
        while (elm.firstChild) elm.removeChild(elm.firstChild);
}

export function addChild(elm: HTMLElement, model: ElementChildModel | IComponent) {
    if (!elm || !model) return;
    if ('mainPanel' in model && 'init' in model && typeof model.init === 'function') {
        elm.append(model.mainPanel);
        model.init();
        return;
    }
    elm.append(genel(model).elm);
}

export function genChild(elm: HTMLElement, model: ElementChildModel) {
    if (!elm || !model) return;
    removeChilds(elm);
    addChilds(elm, [model]);
}

export function addChilds(elm: HTMLElement, models: (ElementChildModel | IComponent)[]) {
    if (!elm || !models) return;
    models.forEach(model => addChild(elm, model));
}

export function genChilds(elm: HTMLElement, models: ElementChildModel[]) {
    if (!elm || !models) return;
    removeChilds(elm);
    addChilds(elm, models);
}

export function getSetter(model: HTMLElementModel, ref: string, key: string, initVal?: any) {
    let setter = (val: any) => {
        try {
            let root = model;
            while(root.super) root = root.super;
            let elm = root.refs[ref];
            if (!elm) return;
            if ('childs' === key) {
                val = Array.isArray(val) ? val : [val];
                genChilds(elm, val);
                return;
            }
            elm[key] = val;
        } catch(ignore){}
    };
    if (initVal) {
        model.super = model.super || {};
        let root = model.super;
        while (root.super) root = root.super;
        root.runOnInit = root.runOnInit || [];
        root.runOnInit.push(() => setter(initVal));
    }
    return setter;
}

export function refreshCss(mainPanel: HTMLElement, css: string, mainClass?: string) {
    css = mainClass && mainClass.trim().length > 0 ? processCss(css, mainClass.trim()) : css;
    let style = mainPanel.querySelector('style');
    while (style) {
        mainPanel.removeChild(style);
        style = mainPanel.querySelector('style');
    }
    style = document.createElement('style');
    style.innerHTML = css;
    mainPanel.append(style);
}

function fireListener(listeners: {name: string, callback: Function}[], name: string, props: any) {
    listeners.filter(listener => listener.name === name)
        .forEach(listener => {
            try {
                listener.callback(props);
            } catch (e) {
                console.log(`Error firing listener "${name}": `, e);
            }
        });
}

function applyValues(from: any, to: any) {
    if (!from || !to) {
        return;
    }
    Object.keys(from).forEach((prop) => {
        let value = from[prop];
        if (!value) {
            to[prop] = value;
            return;
        }
        if (typeof value === "object" && !Array.isArray(value)) {
            let toValue = to[prop];
            if (toValue &&
                typeof toValue === "object" &&
                !Array.isArray(toValue)) {
                applyValues(value, toValue);
                return;
            }
        }
        to[prop] = value;
    });
}

function setValue(obj: any, param: string, value: any) {
    obj[param] = value;
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
                    let sArr = s.split(' ').filter(se => se.trim().length > 0);
                    if (sArr[0] == mainClass) return s;
                    sArr[0] += mainClass;
                    return sArr.join(' ');
                }).join(', ');
            return ` ${selector} { ${body} } `;
        })
        .join('\n');
}
