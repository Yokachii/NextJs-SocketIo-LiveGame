import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../../theme";
import "../styles/globals.scss";
import { Navbar } from "@/components/core/Navbar";
import { Footer } from "@/components/core/Footer";

import { SessionProvider } from "next-auth/react"

const App = ({ Component, pageProps: { session, ...pageProps }, }: any) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme}>
        <Head>
          <title>Oxie</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.svg" />
        </Head>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </MantineProvider>
    </SessionProvider>
  );
}

export default App;