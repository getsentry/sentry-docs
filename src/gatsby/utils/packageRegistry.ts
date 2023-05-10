import {makeGenericRegistry} from './genericRegistry';

const packageRegistry = makeGenericRegistry({name: 'package registry', path: 'sdks'});

export default packageRegistry;
