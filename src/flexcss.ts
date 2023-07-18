
type FlexCSSType = {prefix: string, minSize: number};

const defaultSizes: FlexCSSType[] = [
    { prefix: 'xs-', minSize: 0 },
    { prefix: 's-', minSize: 433 },
    { prefix: 'm-', minSize: 733 },
    { prefix: 'l-', minSize: 1000 },
    { prefix: 'xl-', minSize: 1333 }
];

let lastSizePrefix = '';

export function resetFlexCSS() {
    lastSizePrefix = '';
}

export function processFlexCSS(sizes = defaultSizes) {
    if (!sizes || !Array.isArray(sizes)) {
        return;
    }
    sizes.sort((s1, s2) => s2.minSize - s1.minSize);
    let size = sizes.find(sz => sz.minSize <= window.innerWidth);
    if (!size) {
        return;
    }
    if (size.prefix === lastSizePrefix) {
        setTimeout(() => processFlexCSS(sizes), 50);
        return;
    }
    lastSizePrefix = size.prefix;
    applyFlexCSS(sizes, size.prefix, document.body);
    setTimeout(() => processFlexCSS(sizes), 500);
}

function applyFlexCSS(sizes: FlexCSSType[], prefix: string, element: HTMLElement) {
    if (!sizes || !prefix || !element) {
        return;
    }

    if (!element.classList) {
        if (element.childNodes) {
            element.childNodes.forEach(cn => applyFlexCSS(sizes, prefix, cn as HTMLElement));
        }
        return;
    }

    let classList: string[] = [];
    element.classList.forEach(c => classList.push(c));

    // Recupera as classes removidas
    let classesToAdd: string[] = [];
    let classesToRemove: string[] = [];
    classList.forEach(c => {
        if (c.startsWith('off-') && c.length > 8) {
            classesToAdd.push(c.substring(4));
            classesToRemove.push(c);
        }
    });
    classList = classList.filter(c => !classesToRemove.find(ctr => c === ctr));
    classList = [...classList, ...classesToAdd];

    // Remove as classes
    classesToRemove = getClassesToRemove(sizes, prefix, classList);
    classList = classList.filter(c => !classesToRemove.find(ctr => ctr === c));
    classesToRemove.forEach(c => classList.push('off-' + c));

    // Aplica as alterações ao elemento
    element.className = classList.join(' ');

    if (!element.childNodes) {
        return;
    }

    element.childNodes.forEach(cn => applyFlexCSS(sizes, prefix, cn as HTMLElement));
}

function getClassesToRemove(sizes: FlexCSSType[], prefix: string, classes: string[]) {
    sizes.sort((s1, s2) => s1.minSize - s2.minSize);
    let prefixes = sizes.map(sz => sz.prefix);

    // Map dos prefixos das classes
    let classesInfo: {className: string, prefixes: string[], prefix?: string}[] = [];
    classes.forEach(className => {
        let classPrefix = prefixes.find(p => className.startsWith(p));
        if (!classPrefix) {
            return;
        }
        let classLessPrefix = className.substring(classPrefix.length);

        let classInfo = classesInfo.find(cinfo => cinfo.className === classLessPrefix);
        if (!classInfo) {
            classInfo = {className: classLessPrefix, prefixes: []};
            classesInfo.push(classInfo);
        }
        classInfo.prefixes.push(classPrefix);
    });

    let idxPrefix = sizes.findIndex(sz => sz.prefix === prefix);

    // Definição de qual prefix usar em cada classe
    classesInfo.forEach(classInfo => {
        classInfo.prefix = '';
        let idx = idxPrefix;
        while (idx >= 0) {
            let prefixToPersist = sizes[idx].prefix;
            if (classInfo.prefixes.find(p => p === prefixToPersist)) {
                classInfo.prefix = prefixToPersist;
                break;
            }
            idx--;
        }
    });

    // Listagem das classes que não tem o prefixo a ser mantido
    let classesToRemove: string[] = [];
    classesInfo.forEach(classInfo => {
        let prefixesToRemove = classInfo.prefixes.filter(p => p !== classInfo.prefix);
        prefixesToRemove.forEach(p => classesToRemove.push(p + classInfo.className));
    });

    return classesToRemove;
}
