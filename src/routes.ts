
import { IRote } from './model/iroute';
import { PersonsPage } from './pages/persons-page';
import { HomePage } from './pages/home-page';

export const routes: IRote[] = [
    {path: 'home', label: 'Home', createPage: () => new HomePage()},
    {path: 'persons', label: 'Persons', createPage: () => new PersonsPage()}
];
