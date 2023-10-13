
import { processFlexCSS } from "./flexcss";
import { getGridStyle } from "./grid-style";
import { addGlobalCSS, restorePage } from './navigator';

addGlobalCSS(getGridStyle);

restorePage();

processFlexCSS();
