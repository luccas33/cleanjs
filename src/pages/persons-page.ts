import { genChild, genel } from "../html-generator";
import { HTMLElementModel } from "../model/html-element-model";
import { IPage } from "../model/ipage";
import { IPerson } from "../model/iperson";
import { FormInputComp } from "./shared/form-input-comp";

export class PersonsPage implements IPage {

    public readonly mainPanel = genel({tag: 'main'}).elm;
    public readonly pageCss = '/styles/persons.css';
    private personId = 1;

    persons: IPerson[] = [
        {name: 'Jão', email: 'jao@tester.com', phone: '9484654986', id: this.personId++},
        {name: 'Mario', email: 'mario@encanador.com', phone: '56498435698', id: this.personId++},
        {name: 'Zé', email: 'zealberto@mail.com', phone: '3184654321', id: this.personId++}
    ];

    public init() {
        genChild(this.mainPanel, { tag: 'div', childs: [
            {tag: 'h1', textContent: 'Persons'},
            {tag: 'div', ref: 'formContainer', childs: (root: any) => this.getForm(root)},
            {tag: 'div', ref: 'tableContainer', childs: (root: any) => this.genTable(root)}
        ]});
    }

    getForm(root: any, person: IPerson = {name: '', email: '', phone: ''}): HTMLElementModel {
        let newRegister = person.id ? false : true;
        person.id = person.id || this.personId++;
        return {
            tag: 'div', className: 'form', childs: [
                new FormInputComp('Name', () => person.name, (value: string) => person.name = value),
                new FormInputComp('Phone', () => person.phone, (value: string) => person.phone = value),
                new FormInputComp('Email', () => person.email, (value: string) => person.email = value),
                {tag: 'div', className: 'save', childs: [
                    {tag: 'button', textContent: 'Save', onclick: () => {
                        if (person.name.trim() === '') return;
                        if (newRegister) this.persons.push(person);
                        genChild(root.refs.tableContainer, this.genTable(root));
                        genChild(root.refs.formContainer, this.getForm(root));
                    }}
                ]}
            ]
        };
    }

    genTable(root: any): HTMLElementModel {
        return {
            tag: 'table',
            childs: [
                {tag: 'thead', childs: [
                    {tag: 'tr', childs: [
                        {tag: 'th', textContent: 'Name'},
                        {tag: 'th', textContent: 'Phone'},
                        {tag: 'th', textContent: 'Email'},
                        {tag: 'th', textContent: 'Actions'}]}
                    ]},
                {tag: 'tbody', childs: this.persons.map(person => this.genTableItem(root, person))}
            ]
        };
    }

    genTableItem(root: any, person: IPerson): HTMLElementModel {
        return {
            tag: 'tr',
            childs: [
                {tag: 'td', textContent: person.name},
                {tag: 'td', textContent: person.phone},
                {tag: 'td', textContent: person.email},
                {tag: 'td', className: 'table-actions', childs: [
                    {tag: 'button', textContent: 'Edit', style: {marginLeft: 'auto'}, onclick: () => {
                        genChild(root.refs.formContainer, this.getForm(root, person));
                    }},
                    {tag: 'button', textContent: 'Remove', style: {marginLeft: '5%', marginRight: 'auto'}, onclick: () => {
                        this.persons = this.persons.filter(p => p.id !== person.id);
                        genChild(root.refs.tableContainer, this.genTable(root));
                    }}
                ]}
            ]
        }
    }

}
