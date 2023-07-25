# Clean JS

O framework JS mais limpo e leve de todos

## HTML em JS

- Escreva HTML totalmente em Javascript.
- Atualize o HTML quando quiser e sem hooks.
- Separe a view da lógica ou misture tudo. Você quem decide.

Exemplo de input de formulário:

```Javascript

{
    tag: 'div', className: 'form-input', childs: [
        {tag: 'label', textContent: 'Email'},
        {tag: 'input', value: person.email, onchange: (props: any) => person.name = props.elm.value}
    ]
}

```

### Tutorial

Tutorial do gerador de HTML (arquivo html-generator)

#### Propriedades do Modelo:

- tag: nome da tag HTML.
- childs: tags filhas.
- elm: o elemento HTML gerado.
- ref: referência do elemento.
- refs: objeto com os elementos referenciados (independente da hierarquia).
- Demais propriedades são atribuídas ao elemento HTML (incluindo o style).

#### Functions no Modelo :

- Functions recebem o objeto modelo no parâmetro.
- Functions com nome iniciando com 'on' são eventListeners, com o evento na propriedade evt do modelo.
- Demais functions são executadas e o retorno é atribuído à propriedade em questão.

#### Functions do Gerador:

- genel: gera um elemento.
- addChild: adiciona um filho ao elemento.
- addChilds: adiciona uma lista de filhos ao elemento.
- genChild: retira os filhos do elemento e adiciona um novo.
- genChilds: retira os filhos do elemento e adiciona uma lista de filhos.
- removeChilds: retira os filhos do elemento

#### Componentes

Um componente é uma classe que deve conter a Function init e a propriedade mainPanel:

```Javascript
export class MyComponent implements IComponent {
    public readonly mainPanel = genel({tag: 'div'}).elm;
    constructor(private props: HTMLElementModel){}
    init() {}
}
```

Páginas devem implementar a interface IPage. É quase idêntica à IComponent, com uma propriedade a mais (pageCss), que é opcional.

```Javascript
export class MyPage implements IPage {
    public readonly mainPanel = genel({tag: 'div'}).elm;
    public readonly pageCss = '/styles/my-page.css';
    init() {
        genChild(this.mainPanel, { tag: 'div', childs: [
            {tag: 'h2', textContent: 'Hello World!'},
            new MyComponent()
        ]});
    }
}
```

Fim!
Sim, o tutorial é só isso!

### Vamos a um código um pouco mais complexo

Trecho de código de um sorteador de nomes.
Adicione e remova nomes da lista e, por fim, sorteie um nome.

Arquivo pages/name-sorter-page

```Javascript

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

```

Quer um exemplo mais completo?
Confira o CRUD na página Persons (arquivo pages/persons-page).

## Muito mais que um gerador de HTML

### Em breve neste tuturial:

- Navegação entre páginas (arquivos routes e pages/shared/header-comp).
- Escreva CSS em JS (arquivo cssjs).
- FlexCSS: Adeus mediaquery (arquivo flexcss).
- Eventos: arquivo app-events.
