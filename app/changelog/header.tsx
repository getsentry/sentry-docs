import Image from 'next/image';

export default function Header({loading}) {
  return (
    <div className="w-full mx-auto h-96 relative bg-darkPurple">
      <div className="relative w-full lg:max-w-7xl mx-auto px-4 lg:px-8 pt-8 grid grid-cols-12 items-center">
        <Image
          className={`justify-self-center col-span-10 hidden lg:block ${loading ? 'animate-fade-in-left' : ''}`}
          src="https://docs.sentry.io/changelog/assets/hero.png"
          alt="Sentry Changelog"
          priority
          height={273}
          width={450}
        />
        <div
          className={`relative col-span-12 mt-32 lg:absolute lg:w-96 lg:right-1/4 lg:-bottom-2 ${loading ? 'animate-fade-in-right' : ''}`}
        >
          <h1 className="justify-self-center text-white font-bold text-4xl text-center lg:text-left mb-2">
            Sentry Changelog
          </h1>
          <h2 className="justify-self-center text-gold text-1xl text-center lg:text-left">
            Follow&nbsp;
            <a
              href="https://twitter.com/SentryChangelog"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              @SentryChangelog
            </a>
            &nbsp;to stay up to date on everything from product updates to SDK changes.
          </h2>
        </div>
      </div>
      <div className="hero-bottom-left-down-slope absolute -bottom-0.5 w-full h-10 bg-gray-200 border-none" />
    </div>
  );
}
