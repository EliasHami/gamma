import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (<ClerkProvider {...pageProps} >
    <Head>
      <title>Gamma</title>
      <meta name="description" content="😀" />
      <link rel="icon" href="/gamma-ray.png" />
    </Head>
    <Component {...pageProps} />
  </ClerkProvider>)
};

export default api.withTRPC(MyApp);
