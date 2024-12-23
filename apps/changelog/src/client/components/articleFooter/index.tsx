import {Button} from '../ui/Button';
import squiggleImage from './squiggle.png';

export default function ArticleFooter() {
  return (
    <div>
      <div
        className="mb-8 py-5 px-8 rounded-md flex flex-col md:flex-row items-center justify-center flex-wrap gap-2"
        style={{
          background: `url('${squiggleImage.src}') 0px 0px / 300px 300px, linear-gradient(315deg, rgb(24, 13, 28) 0.57%, rgb(69, 38, 80) 100%) 0% 0% / cover`,
        }}
      >
        <div className="flex-1 text-white uppercase text-base">
          Your code is broken. Let's Fix it.
        </div>
        <Button
          as="a"
          href="https://sentry.io/signup"
          className="w-full md:w-auto justify-center uppercase rounded-3xl !text-white"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
