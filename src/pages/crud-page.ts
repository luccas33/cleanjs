import { addChild, genel } from "../html-generator";
import { IPage } from "../model/ipage";

export class CrudPage implements IPage {

    public readonly mainPanel: HTMLElement;

    constructor() {
        this.mainPanel = genel({tag: 'main'}).elm;
    }

    public init() {
        addChild(this.mainPanel, {tag: 'h1', textContent: 'This page is building!'})
    }

}
