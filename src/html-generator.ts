import { ElementChildModel, HTMLElementModel } from "./model/html-element-model";
import { HTMLElementModelProcessed } from "./model/html-element-model-processed";

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
- Demais functions são executadas e o retorno é atribuído ao elemento HTML
*/
export function genel(model: HTMLElementModel): HTMLElementModelProcessed {
    if (!model.tag) {
        let nullElm = document.createElement('div');
        nullElm.style.display = 'none';
        return {...model, elm: nullElm, refs: {}};
    }
    let elm = document.createElement(model.tag);
    model.elm = elm;
    model.ref = model.ref || model.id;
    let root = model.super || {};
    while (root.super) root = root.super;
    root.refs = root.refs || {};
    if (model.ref) {
        root.refs[model.ref] = elm;
    }
    model.refs = root.refs;
    Object.keys(model).forEach(key => {
        if (!key.startsWith('on')) {
            return;
        }
        let value = model[key];
        if (!value || typeof value !== 'function') {
            return;
        }
        let evtName = key.substring(2);
        elm.addEventListener(evtName, evt => value({...model, evt}));
    });
    Object.keys(model).forEach(k => {
        if (k.startsWith('on')) return;
        let v = model[k];
        if (v && typeof v === 'function') {
            v = v(model);
            model[k] = v;
        };
    });
    let elmValues = {};
    Object.keys(model).forEach(k => {
        if (k.startsWith('on')
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
    model.childs = model.childs || [];
    model.childs = Array.isArray(model.childs) ? model.childs : [model.childs];
    model.childs.forEach((c: any) => {
        if (typeof c === 'function') {
            c = c(model);
        }
        if ('tagName' in c) {
            elm.append(c);
            return;
        }
        if ('mainPanel' in c && 'init' in c && typeof c.init === 'function') {
            elm.append(c.mainPanel);
            c.init();
            return;
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

export function addChild(elm: HTMLElement, model: ElementChildModel) {
    if (!elm || !model) return;
    elm.append(genel(model).elm);
}

export function genChild(elm: HTMLElement, model: ElementChildModel) {
    if (!elm || !model) return;
    removeChilds(elm);
    addChilds(elm, [model]);
}

export function addChilds(elm: HTMLElement, models: ElementChildModel[]) {
    if (!elm || !models) return;
    models.forEach(model => elm.append(genel(model).elm));
}

export function genChilds(elm: HTMLElement, models: ElementChildModel[]) {
    if (!elm || !models) return;
    removeChilds(elm);
    addChilds(elm, models);
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
