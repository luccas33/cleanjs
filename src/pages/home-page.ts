
import { genChilds, genel } from '../html-generator';
import { IPage } from '../model/ipage';
export class HomePage implements IPage {

    public readonly mainPanel: HTMLElement;

    constructor() {
        this.mainPanel = genel({tag: 'main'}).elm;
    }

    public init() {
        let models = [
            {tag: 'h2', textContent: 'Clean JS Framework'},
            {tag: 'h1', textContent: 'Hello World!'}
        ];
        genChilds(this.mainPanel, models); 
    }

}
