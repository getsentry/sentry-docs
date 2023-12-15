import { serverContext } from "sentry-docs/serverContext";

type Props = {
    nextPages: boolean;
    /**
     * A list of pages to exclude from the grid.
     * Specify the file name of the page, for example, "index" for "index.mdx"
     */
    exclude?: string[];
    header?: string;
  };

export function PageGrid({nextPages = false, header, exclude}: Props) {
    return <p>{serverContext().path}</p>;
}
