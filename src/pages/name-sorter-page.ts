import { applyCSSList } from "../cssjs";
import { genChild, genel, getSetter } from "../html-generator";
import { CSSInfo } from "../model/css-info";
import { HTMLElementModel } from "../model/html-element-model";
import { IPage } from "../model/ipage";

export class NameSorterPage implements IPage {
    public readonly mainPanel: HTMLElement = genel({tag: 'div'}).elm;
    private names: string[] = ['Fulano', 'Beltrano', 'Ciclano'];

    private root: any = {};
    private setSortedName = getSetter(this.root, 'sortedName', 'textContent', 'Nenhum nome sorteado');
    private setNameList = getSetter(this.root, 'nameList', 'childs', this.genListName());

    private model: HTMLElementModel = {tag: 'div', super: this.root, childs: [
        {tag: 'label', textContent: 'Digite um nome'},
        {tag: 'input', ref: 'iptName'},
        {tag: 'button', textContent: 'Adicionar à lista', onclick: (props: any) => this.listaAction(props, true)},
        {tag: 'button', textContent: 'Retirar da lista', onclick: (props: any) => this.listaAction(props, false)},
        {tag: 'div', ref: 'nameList'},
        {tag: 'button', textContent: 'Sortear um nome',
            onclick: () => this.setSortedName(`O nome sorteado é: ${this.sortearNome()}`)},
        {tag: 'p', ref: 'sortedName'}
    ]};

    init() {
        genChild(this.mainPanel, this.model);
        applyCSSList([this.mainPanel], css);
    }

    listaAction(props: any, add: boolean) {
        let name = props.refs.iptName.value;
        props.refs.iptName.value = '';
        if (add) this.names.push(name);
        if (!add) this.names = this.names.filter(n => n !== name);
        this.setNameList(this.genListName());
        applyCSSList([this.mainPanel], css);
    }

    genListName() {
        return this.names.map(n => {
            return {tag: 'p', textContent: n};
        });
    }

    sortearNome() {
        return this.names[this.random(1, this.names.length) - 1];
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
