import Image from 'next/image';

import {ExternalLink} from '../externalLink';

import clojure from './icons/clojure.png';
import cloudflare from './icons/cloudflare.png';
import coldfusion from './icons/coldfusion.png';
import crystal from './icons/crystal.png';
import defold from './icons/defold.png';
import grails from './icons/grails.png';
import hono from './icons/hono.png';
import kubernetes from './icons/kubernetes.png';
import lua from './icons/lua.png';
import nuxt from './icons/nuxt.png';
import ocaml from './icons/ocaml.png';
import quarkus from './icons/quarkus.png';
import scrapy from './icons/scrapy.png';
import serverless from './icons/serverless.png';
import strapi from './icons/strapi.png';
import terraform from './icons/terraform.png';
import wordpress from './icons/wordpress.png';

const CommunityPlatforms = [
  {
    name: 'Clojure (Sentry Clj)',
    url: 'https://github.com/getsentry/sentry-clj',
    icon: clojure,
  },
  {
    name: 'Clojure (Raven Clj)',
    url: 'https://github.com/sethtrain/raven-clj#alternatives',
    icon: clojure,
  },
  {
    name: 'Cloudflare Workers',
    url: 'https://github.com/robertcepa/toucan-js',
    icon: cloudflare,
  },
  {
    name: 'ColdFusion',
    url: 'https://github.com/coldbox-modules/sentry',
    icon: coldfusion,
  },
  {
    name: 'Crystal',
    url: 'https://github.com/Sija/raven.cr',
    icon: crystal,
  },
  {
    name: 'Defold',
    url: 'https://github.com/indiesoftby/defold-sentinel',
    icon: defold,
  },
  {
    name: 'Grails',
    url: 'https://github.com/agorapulse/grails-sentry',
    icon: grails,
  },
  {
    name: 'Hono',
    url: 'https://github.com/honojs/middleware/tree/main/packages/sentry',
    icon: hono,
  },
  {
    name: 'Kubernetes',
    url: 'https://github.com/alekitto/sentry-kubernetes',
    icon: kubernetes,
  },
  {
    name: 'Lua',
    url: 'https://github.com/cloudflare/raven-lua',
    icon: lua,
  },
  {
    name: 'Nuxt 2',
    url: 'https://github.com/nuxt-community/sentry-module',
    icon: nuxt,
  },
  {
    name: 'OCaml',
    url: 'https://github.com/brendanlong/sentry-ocaml',
    icon: ocaml,
  },
  {
    name: 'Quarkus',
    url: 'https://github.com/quarkiverse/quarkus-logging-sentry',
    icon: quarkus,
  },
  {
    name: 'Scrapy',
    url: 'https://github.com/llonchj/scrapy-sentry',
    icon: scrapy,
  },
  {
    name: 'Serverless Framework',
    url: 'https://github.com/arabold/serverless-sentry-plugin',
    icon: serverless,
  },
  {
    name: 'Strapi',
    url: 'https://github.com/strapi/strapi/tree/master/packages/plugins/sentry',
    icon: strapi,
  },
  {
    name: 'Terraform',
    url: 'https://github.com/jianyuan/terraform-provider-sentry',
    icon: terraform,
  },
  {
    name: 'WordPress',
    url: 'https://github.com/stayallive/wp-sentry',
    icon: wordpress,
  },
];

export function CommunitySupportedPlatforms() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {CommunityPlatforms.map(platform => (
        <li key={platform.name} style={{listStyle: 'none', padding: '0', margin: '0'}}>
          <ExternalLink
            href={platform.url}
            className="flex gap-2 items-center !no-underline"
          >
            <Image
              src={platform.icon.src}
              width={20}
              height={20}
              alt={platform.name}
              className="!border-none !shadow-none"
            />
            <span className="text-[var(--accent)]">{platform.name}</span>
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}
