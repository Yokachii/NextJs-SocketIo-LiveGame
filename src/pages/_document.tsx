import { Html, Head, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;