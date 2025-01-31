import BackendImg from 'sentry-docs/imgs/back-end.png';
import InfraImg from 'sentry-docs/imgs/dev-infra.png';
import FrontendImg from 'sentry-docs/imgs/front-end.png';
import IngestImg from 'sentry-docs/imgs/ingest.png';
import IntegrationsImg from 'sentry-docs/imgs/integrate.png';
import SkdsImg from 'sentry-docs/imgs/sdks.png';
import ServicesImg from 'sentry-docs/imgs/services.png';
import SelfHostedImg from 'sentry-docs/imgs/support.png';

import {Card} from './card';

export function DevDocsCardGrid() {
  return (
    <div className="flex flex-wrap gap-6 not-prose">
      <Card
        className="w-full"
        href="/development-infrastructure/"
        title="Development Infrastructure"
        description="How to get your local dev environment up and running."
        image={InfraImg}
        imageAlt="Development Infrastructure"
      />

      <Card
        className="w-full md:w-[calc(50%-12px)]"
        href="/backend/"
        title="Backend"
        description="The monolith that is powering Sentry."
        image={BackendImg}
        imageAlt="Backend"
      />
      <Card
        className="w-full md:w-[calc(50%-12px)]"
        href="/frontend/"
        title="Frontend"
        description="How we write frontend code."
        image={FrontendImg}
        imageAlt="Frontend"
      />
      <Card
        className="w-full md:w-[calc(50%-12px)]"
        href="/services/"
        title="Services"
        description="Running alongside the monolith."
        image={ServicesImg}
        imageAlt="Services"
      />
      <Card
        className="w-full md:w-[calc(50%-12px)]"
        href="/integrations/"
        title="Integrations"
        imageAlt="Integrations"
        description="Connecting Sentry to other products."
        image={IntegrationsImg}
      />
      <Card
        className="w-full md:w-[calc(50%-12px)]"
        href="/ingestion/"
        title="Ingestion"
        imageAlt="Ingestion"
        description="Receiving and processing data."
        image={IngestImg}
      />
      <Card
        className="w-full md:w-[calc(50%-12px)]"
        href="/sdk/"
        title="SDKs"
        imageAlt="SDKs"
        description="Instrumenting user code."
        image={SkdsImg}
      />
      <Card
        className="w-full"
        href="/self-hosted/"
        title="Self-Hosted Sentry"
        imageAlt="Self-Hosted Sentry"
        description="How you can run all of Sentry on your own server, without paying anything."
        image={SelfHostedImg}
      />
    </div>
  );
}
