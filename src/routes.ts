
import { IRote } from './model/iroute';
import { PersonsPage } from './pages/persons-page';
import { HomePage } from './pages/home-page';
import { NameSorterPage } from './pages/name-sorter-page';
import { FlexCSSPage } from './pages/flex-css-page';
import { ToggleDialogPage } from './pages/toggle-dialog-page';

export const routes: IRote[] = [
    {path: 'home', label: 'Home', createPage: () => new HomePage()},
    {path: 'persons', label: 'Persons', createPage: () => new PersonsPage()},
    {path: 'name-sorter', label: 'Sortear Nome', createPage: () => new NameSorterPage()},
    {path: 'flex-css', label: 'Flex CSS', createPage: () => new FlexCSSPage()},
    {path: 'toggle-dialog', label: 'Toggle Dialog', createPage: () => new ToggleDialogPage()}
];
