import {makeRegistry} from './genericRegistry';

const getAppRegistry = makeRegistry({name: 'app registry', path: 'apps'});

export default getAppRegistry;
