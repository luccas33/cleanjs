
import { IRote } from './model/iroute';
import { CrudPage } from './pages/crud-page';
import { HomePage } from './pages/home-page';

export const routes: IRote[] = [
    {path: 'home', label: 'Home', createComponent: () => new HomePage()},
    {path: 'crud', label: 'CRUD', createComponent: () => new CrudPage()}
];
