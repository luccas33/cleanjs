import { genChild, genel, refreshCss } from "../html-generator";
import { HTMLElementModel } from "../model/html-element-model";
import { IPage } from "../model/ipage";

export class ToggleDialogPage implements IPage {
    public readonly mainPanel = genel({tag: 'main'}).elm;
    showDialog = false;
    model: HTMLElementModel = {tag: 'div', ref: 'mainModel', css: this.getCss(), childs: [
        {tag: 'button', className: 'open-btn', textContent: 'Abrir Dialog', onclick: (props: any) => {
            this.showDialog = true;
            props.events.fire('ToggleDialog', 'Dialog Aberto!');
        }},
        {tag: 'div', className: 'dialog-container', childs: [
            {tag: 'div', className: 'dialog', hidden: !this.showDialog, ref: 'dialog', 
                listenToggleDialog: (props: any) => {
                    props.refs.dialog.hidden = !this.showDialog;
                    props.refs.dialogTitle.textContent = props.evt;
                    refreshCss(this.model.refs.mainModel, this.getCss());
                },
            childs: [
                {tag: 'h3', textContent: 'Dialog Title', ref: 'dialogTitle'},
                {tag: 'button', textContent: 'Fechar Dialog', onclick: (props: any) => {
                    this.showDialog = false;
                    props.events.fire('ToggleDialog');
                }}
            ]}
        ]}
    ]}

    init() {
        genChild(this.mainPanel, this.model);
    }

    getCss() {
        return `
            .open-btn {
                margin-top: 20px;
                ${this.showDialog ? 'display: none' : ''}
            }

            .dialog {
                position: absolute;
                left: 35%;
                top: 20%;
                width: 30%;
                height: 40%;
                background-color: white;
                border: 2px solid gray;
                border-radius: 5px;
                padding: 10px;
            }

            .dialog > h3 { text-align: center }

            .dialog > button {
                width: 110px;
                position: absolute;
                left: calc(50% - 55px);
                bottom: 20px;
            }
        `;
    }

}
