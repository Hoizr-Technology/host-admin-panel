import useGlobalStore from "@/store/global";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { Roboto_Flex } from "next/font/google";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { ReactNode } from "react";
import "../styles/globals.css";
import Toast from "@/components/common/toast/toast";

const seo = {
  title: "Choose - Best Online Ordering for Restaurants in the USA",
  description:
    "An all-inclusive Restaurant Online Ordering offering Website Builder, Online Ordering, Commission Free Delivery, Loyalty Program and Automated Marketing",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://restaurant.choosepos.com",
    site_name: "Choose - Best Online Ordering for Restaurants in the USA",
    images: [
      {
        url: "https://restaurant.choosepos.com/opengraph-image.webp",
        width: 1200,
        height: 630,
        alt: "Choose - Best Online Ordering for Restaurants in the USA",
      },
    ],
    canonical: "./",
  },
};

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const font = Roboto_Flex({
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);
  const { toastData } = useGlobalStore();

  return (
    <div className={font.className}>
      <NextNProgress color="#dfdf1e" />
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no"
        />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <DefaultSeo {...seo} />
      {getLayout(<Component {...pageProps} />)}
      {toastData && <Toast message={toastData.message} type={toastData.type} />}
    </div>
  );
}

export default MyApp;
