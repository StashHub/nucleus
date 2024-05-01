import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from "next/document";
import { Children } from "react";
import { siteConfig } from "@/config/site";

export default class MyDocument extends Document {
  static async getInitialProps(
    context: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(context);

    return {
      ...initialProps,
      styles: Children.toArray([initialProps.styles]),
    };
  }

  render() {
    return (
      <Html lang="en" className="antialiased">
        <Head>
          <meta name="description" content={siteConfig.description} />
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="robots"
            content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
          <meta property="og:locale" content={siteConfig.og.locale} />
          <meta property="og:type" content={siteConfig.og.type} />
          <meta property="og:image" content={siteConfig.og.image} />
          <meta property="og:title" content={siteConfig.name} />
          <meta property="og:description" content={siteConfig.description} />
          <meta property="og:url" content={siteConfig.url} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
