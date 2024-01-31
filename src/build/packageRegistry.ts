import {makeRegistry} from './genericRegistry';

const getPackageRegistry = makeRegistry({name: 'package registry', path: 'sdks'});

export default getPackageRegistry;
