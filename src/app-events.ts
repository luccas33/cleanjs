
const keys = {
}

const eventGroups: {name: string, events: Function[]}[] = []

/**
 * Adiciona uma function associada com o name para ser executada em exec()
 */
function add(name: string, func: Function) {
    if (!name || !func || !(func instanceof Function)) {
        return;
    }
    let group = eventGroups.find(g => g.name == name);
    if (!group) {
        group = {name, events: []};
        eventGroups.push(group);
    }
    group.events.push(func);
}

/**
 * Executa as functions adicionadas com o name
*/
function exec(name: string, evtData?: any) {
    if (!name) {
        return;
    }
    let group = eventGroups.find(g => g.name == name);
    if (!group) {
        return;
    }
    group.events.forEach(evt => {
        try {
            evt(evtData);
        } catch(e) {
            console.log(`Error on ${name} event: `, e);
        }
    });
}

/**
 * Eventos executados entre componentes
*/
export const appEvents = {keys, add, exec};
