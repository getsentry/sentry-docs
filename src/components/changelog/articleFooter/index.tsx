import {Button} from '../ui/Button';

import styles from './styles.module.css';

export default function ArticleFooter() {
  return (
    <div>
      <div
        className={`${styles['footer-wrapper']} mb-8 py-5 px-8 rounded-md flex flex-col md:flex-row items-center justify-center flex-wrap gap-2`}
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
