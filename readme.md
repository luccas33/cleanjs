# Clean JS

O framework JS mais limpo e leve de todos

## HTML em JS

- Escreva HTML totalmente em Javascript.
- Atualize o HTML facilmente quando quiser e sem hooks.
- Separe a view da lógica ou misture tudo. Você quem decide.
- Apenas Javascript. Qualquer desenvolvedor JS pode utilizar prontamente.

### Exemplo de input de formulário:

O HTML é gerado a partir de um objeto modelo, como no exemplo a seguir.

```Javascript

{
    tag: 'div', className: 'form-input', childs: [
        {tag: 'label', textContent: 'Email'},
        {tag: 'input', value: person.email, onchange: (props: any) => person.name = props.elm.value}
    ]
}

```

### Tutorial do Gerador de HTML

As Functions do gerador estão no arquivo html-generator.

#### Componentes

Um componente é uma classe que deve conter a Function init e a propriedade mainPanel:

```Javascript
export class MyComponent implements IComponent {
    constructor() {
        /* 
         * Registre o CSS do componente
         * A mainClass é responsável por isolar o CSS do componente
         */
        addComponentCSS(this.getCss, this.model.mainClass);
    }

    /*
     * genel(): gera um elemento HTML a partir de um objeto modelo.
     * tag: nome da tag.
     * elm: elemento HTML gerado.
     */
    mainPanel = genel({tag: 'div'}).elm;

    /** 
     * Crie seu modelo como propriedade da class.
     * Assim, as functions podem acessá-lo diretamente.
     * Isto facilita a modificação do HTML a partir de eventos.
     */
    model: HTMLElementModel = {
        tag: 'div',
        mainClass: 'my-component',
        childs: [{tag: 'p', textContent: 'MyComponent works!'}]
    }

    init() {
        /* 
         * genChild(): gera um elemento HTML filho.
         * textContent: uma propriedade qualquer de um elemento HTML.
         */
        genChild(this.mainPanel, this.model);
    }

    getCss() { 
        return `
            p {
                color: ${getTheme().fontColor};
                font-size: 20px;
            }
        `;
    }

    onCSSChange() {
        // Chame essa função para atualizar o CSS do componente caso seja alterado dinamicamente
        genComponentCSS(this.model.mainClass);
    }

}
```

Não é necessário criar uma classe para gerar um subcomponente. Simplesmente crie uma função que retorne um objeto modelo:

```Javascript

getInput(label: string, value: string, setter: Function) {
    // childs: tags filhas de um elemento.
    return {tag: 'div', className: 'form-input', childs: [
        {tag: 'label', textContent: label},
        {
            tag: 'input', 
            value: value, 
            // Functions recebem o próprio objeto modelo em que estão inseridos e 'elm' é o elemento criado pelo modelo.
            onchange: (p: any) => setter(p.elm.value),
            // O evento é acessado pela propriedade 'evt' do modelo.
            onkeyup: (p: any) => {if (p.evt.keyCode === 13) this.save()}
        }
    ]};
}

```

Páginas devem implementar a interface IPage. É quase idêntica à IComponent, com uma propriedade a mais (pageCss), que é opcional.

```Javascript
export class MyPage implements IPage {
    mainPanel = genel({tag: 'div'}).elm;
    // Este arquivo CSS só estará ativo quando esta página estiver em exibição.
    pageCss = '/styles/my-page.css';

    model: HTMLElementModel = {tag: 'div', childs: [
        // A propriedade 'ref' define uma variável para o elemento
        {tag: 'h2', textContent: 'Hello World! Click me.', ref: 'title', onclick: () => this.click()},
        // Um componente pode ser adicionado como filho de um objeto modelo.
        new MyComponent()
    ]}

    init() {
        genChild(this.mainPanel, model);
    }

    click() {
        // Os elementos são acessados pelo objeto 'refs' do modelo
        this.model.refs.title.textContent = 'Hello dev!';
    }
}
```

### CSS global em template string:

```Javascript
getGlobalCss() {
    return `
        body {
            background: ${getTheme().backgroundColor}
        }
    `;
}

// Registre a função de CSS global
addGlobalCSS(getGlobalCss);

// Gere novamente o CSS (em caso de mudança de tema, por exemplo)
genGlobalCSS();
genComponentsCSS(true);
```

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
- Functions com nome iniciando com 'listen' são eventListeners controlados pelo código. São executados com modelo.events.fire('NomeEvento').
- Demais functions são executadas e o retorno é atribuído à propriedade em questão.

#### Functions do Gerador:

- genel: gera um elemento.
- addChild: adiciona um filho ao elemento.
- addChilds: adiciona uma lista de filhos ao elemento.
- genChild: retira os filhos do elemento e adiciona um novo.
- genChilds: retira os filhos do elemento e adiciona uma lista de filhos.
- removeChilds: retira os filhos do elemento

### Functions Listen:

```Javascript

showDialog = false;

model = {tag: 'div', childs: [
        {tag: 'button', textContent: 'Show Dialog', onclick: (p: any) => {
                showDialog = true; 
                // O primeiro parâmetro é o nome do evento.
                // O segundo parâmetro é opcional e de qualquer tipo.
                p.events.fire('ToggleDialog', 'Hello Dialog!');
            }},
        // Este elemento escutará eventos com nome 'ToggleDialog'
        {tag: 'div', ref: 'dialog', listenToggleDialog: (p: any) => {
                p.refs.dialog.hidden = !showDialog;
                // O segundo parâmetro de fire() é acessado na propriedade 'evt':
                p.refs.dialogTitle.innerText = p.evt;
            }, childs: [
                {tag: 'h3', innerText: 'Dialog Title', ref: 'dialogTitle'}
            ]}
        ]}

```

Confira este exemplo de forma completa no arquivo pages/toggle-dialog-page.ts

#### Element Setters

```Javascript

names = ['Name 1', 'Mame 2', 'Name 3'];

/** 
 * Objeto de contexto
 * 
 * Serve para compartilhar o acesso a refs e eventos listen
*/ 
context = {};

// Parâmetros: contexto, ref do elemento, propriedade do elemento, valor inicial (opcional)
setName = getSetter(this.context, 'name', 'textContent', 'Initial Value');

// Propriedade childs gera o HTML novamente (equivalente a chamar genChilds())
setNameList = getSetter(this.context, 'nameList', 'childs', this.getNameListModel());

// Atribua o objeto de contexto à propriedade super
model = {tag: 'div', super: this.context, childs: [
    {tag: 'input', ref: 'name'},
    {tag: 'div', ref: 'listName'}
]}

addName(name) {
    this.names.push(name);

    // Atualize o valor do elemento passando apenas o valor da propriedade
    this.setNameList(this.getNameListModel());
}

```

### Fim!

Sim, o tutorial é só isso!

> Quer um exemplo completo?

Confira o CRUD na página Persons (arquivo pages/persons-page).

# CSS em JS

Escreva CSS em Javascript

```Javascript
const css: CSSInfo[] = [
    {
        // Seletor CSS
        selector: '.form-input',
        marginTop: '10px',
        width: '100%',
        // Estilos a serem aplicados às tags fihas de .form-input
        styles: [
            {selector: 'input', width: '100%'},
            {selector: 'label, span', display: 'block'}
        ]
    }
];

applyCSSList([this.mainPanel], css);
```

# Rotas

```Javascript

// Arquivo routes.ts
export const routes: IRote[] = [
    {path: 'home', label: 'Home', createPage: () => new HomePage()},
    {path: 'persons', label: 'Persons', createPage: () => new PersonsPage()},
    {path: 'name-sorter', label: 'Sortear Nome', createPage: () => new NameSorterPage()},
    {path: 'flex-css', label: 'Flex CSS', createPage: () => new FlexCSSPage()}
];

// Ir para a página:
navToPage(rote.path);

```

Confira um exemplo de uso no arquivo pages/shared/header-comp.ts

# Flex CSS

Responsividade para todo o CSS, não apenas para a grid.

Esqueça media query.

### Defina seus prefixos e tamanhos

```Javascript

const sizes1 = [
    { prefix: 's-', minSize: 0 },
    { prefix: 'm-', minSize: 500 },
    { prefix: 'l-', minSize: 1000 }
];

const sizes2 = [
    { prefix: 'xs-', minSize: 0 },
    { prefix: 's-', minSize: 433 },
    { prefix: 'm-', minSize: 733 },
    { prefix: 'l-', minSize: 1000 },
    { prefix: 'xl-', minSize: 1333 }
];

```

### Controle a aplicação de suas classes CSS por prefixos

```CSS

.xs-panel {width: 100%}
.m-panel {width: 50%}
.l-panel {width: 33%}

.xs-span {
    text-align: left;
    color: black;
}
.m-span {
    text-align: center;
    color: blue;
}

```

### Como usar

```Javascript

// Chame esta função no seu main passando sua lista de tamanhos no parâmetro, ou não, para usar os tamanhos default (sizes2).
processFlexCSS(sizes);

/**
 * O FlexCSS executa automaticamente apenas quando detecta uma alteração na largura da tela.
 * Caso tenha alguma alteração no HTML que seja necessario executar o FlexCSS, chame esta Function.
 * Casos de uso comuns: troca de página e abertura de dialog.
*/
resetFlexCSS();

```

### Auto Complete de Prefixo

```Javascript
{tag: 'div', className: 'fx-xs-m-xl-classname'}

// É o mesmo que:

{tag: 'div', className: 'classname xs-classname m-classname xl-classname'}
```

### Quer um Exemplo?

Confira um exemplo de responsividade no arquivo pages/flex-css-page.ts

# Eventos JS

Controle o fluxo entre os componentes diretamente, sem se preocupar com a hierarquia da tela.

```Javascript

// Function adicionada para ser executada pelo nome.
appEvents.add('eventName', (evt: string) => alert(evt));


/** 
 * Function executada a partir de outro local no código.
 * Primeiro parâmetro: nome do evento a ser executado.
 * Segundo parâmetro: um dado qualquer (opcional) que é passado como parâmetro à Function a ser executada.
 */
appEvents.exec('eventName', 'Executando o evento');

```

# Como Rodar o Projeto

- Para instalar: npm install.
- Para rodar: npm run dev + Go Live no arquivo index.html (Live Server).
