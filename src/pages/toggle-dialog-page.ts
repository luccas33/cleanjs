import { applyCSSList } from "../cssjs";
import { genChild, genel } from "../html-generator";
import { CSSInfo } from "../model/css-info";
import { IPage } from "../model/ipage";

export class ToggleDialogPage implements IPage {
    public readonly mainPanel = genel({tag: 'main'}).elm;
    showDialog = false;
    init() {
        genChild(this.mainPanel, {tag: 'div', childs: [
            {tag: 'button', textContent: 'Abrir Dialog', onclick: (props: any) => {
                this.showDialog = true;
                props.events.fire('ToggleDialog', 'Dialog Aberto!');
            }},
            {tag: 'div', className: 'dialog-container', childs: [
                {tag: 'div', className: 'dialog', hidden: !this.showDialog, ref: 'dialog', 
                    listenToggleDialog: (props: any) => {
                        props.refs.dialog.hidden = !this.showDialog;
                        props.refs.dialogTitle.textContent = props.evt;
                    },
                childs: [
                    {tag: 'h3', textContent: 'Dialog Title', ref: 'dialogTitle'},
                    {tag: 'button', textContent: 'Fechar Dialog', onclick: (props: any) => {
                        this.showDialog = false;
                        props.events.fire('ToggleDialog');
                    }}
                ]}
            ]}
        ]});
        applyCSSList([this.mainPanel], css);
    }

}

const css: CSSInfo[] = [
    {
        selector: '.dialog',
        position: 'absolute',
        left: '35%',
        top: '20%',
        width: '30%',
        height: '40%',
        backgroundColor: 'white',
        border: '2px solid gray',
        borderRadius: '5px',
        padding: '10px',
        styles: [
            {
                selector: 'h3',
                textAlign: 'center'
            },
            {
                selector: 'button',
                width: '110px',
                position: 'absolute',
                left: 'calc(50% - 55px)',
                bottom: '20px'
            }
        ]
    }
];
