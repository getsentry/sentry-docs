import {makeGenericRegistry} from './genericRegistry';

const appRegistry = makeGenericRegistry({name: 'app registry', path: 'apps'});

export default appRegistry;
