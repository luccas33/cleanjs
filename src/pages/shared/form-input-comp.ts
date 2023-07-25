import { addChilds, genel } from "../../html-generator";
import { IComponent } from "../../model/icomponent";

export class FormInputComp implements IComponent {
    public readonly mainPanel = genel({tag: 'div', className: 'input'}).elm;
    constructor(
        private label: String,
        private getter: Function,
        private setter: Function) {}
    init() {
        addChilds(this.mainPanel, [
            {tag: 'label', textContent: this.label},
            {tag: 'input', value: this.getter(), onchange: (p: any) => this.setter(p.elm.value)}
        ]);
    }
}