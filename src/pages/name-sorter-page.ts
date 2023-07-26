import { applyCSSList } from "../cssjs";
import { genChild, genChilds, genel } from "../html-generator";
import { CSSInfo } from "../model/css-info";
import { IPage } from "../model/ipage";

export class NameSorterPage implements IPage {
    public readonly mainPanel: HTMLElement;
    private names: string[] = [];

    constructor() {
        this.mainPanel = genel({tag: 'div'}).elm;
    }

    init() {
        genChild(this.mainPanel, {tag: 'div', childs: [
            {tag: 'label', textContent: 'Digite um nome'},
            {tag: 'input', ref: 'iptName'},
            {tag: 'button', textContent: 'Adicionar à lista', onclick: (props: any) => this.listaAction(props, true)},
            {tag: 'button', textContent: 'Retirar da lista', onclick: (props: any) => this.listaAction(props, false)},
            {tag: 'div', ref: 'nameList'},
            {tag: 'button', textContent: 'Sortear um nome',
                onclick: (props: any) => {
                    let name = this.names[this.random(1, this.names.length) - 1];
                    props.refs.sortedName.textContent = `O nome sorteado é: ${name}`;
                }},
            {tag: 'p', ref: 'sortedName', childs: (props: any) => this.genListName(props)}
        ]});
        applyCSSList([this.mainPanel], css);
    }

    listaAction(props: any, add: boolean) {
        let name = props.refs.iptName.value;
        props.refs.iptName.value = '';
        if (add) this.names.push(name);
        if (!add) this.names = this.names.filter(n => n !== name);
        this.genListName(props);
    }

    genListName(props: any) {
        genChilds(props.refs.nameList, this.names.map(n => {
            return {tag: 'p', textContent: n};
        }));
    }

    random(min: number, max: number) {
        max++;
        return Math.floor(Math.random() * (max - min)) + min;
    }

}

const css: CSSInfo[] = [
    {selector: '*', display: 'block'},
    {selector: 'button', width: '125px'},
    {selector: 'input', width: '117px'},
    {selector: 'input, button, p', margin: '7px 0'}
];
