import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta content="GMIT Imanuel Oepura" name="application-name" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content="GMIT JIO" name="apple-mobile-web-app-title" />
        <meta
          content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi di Kupang, Nusa Tenggara Timur."
          name="description"
        />
        <meta content="telephone=no" name="format-detection" />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta content="/browserconfig.xml" name="msapplication-config" />
        <meta content="#2B5797" name="msapplication-TileColor" />
        <meta content="no" name="msapplication-tap-highlight" />
        <meta content="#2B5797" name="theme-color" />

        {/* Additional SEO meta tags */}
        <meta
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          name="robots"
        />
        <meta
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          name="googlebot"
        />
        <meta
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          name="bingbot"
        />
        <meta content="GMIT Jemaat Imanuel Oepura" name="author" />
        <meta content="GMIT Jemaat Imanuel Oepura" name="publisher" />
        <meta content="id" name="language" />
        <meta content="ID-NT" name="geo.region" />
        <meta content="Kupang" name="geo.placename" />
        <meta content="-10.1718;123.6044" name="geo.position" />
        <meta content="-10.1718, 123.6044" name="ICBM" />

        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/site.webmanifest" rel="manifest" />
        <link color="#5bbad5" href="/safari-pinned-tab.svg" rel="mask-icon" />
        <link href="/favicon.ico" rel="shortcut icon" />

        {/* Preload critical resources for better LCP */}
        <link rel="preload" href="/header/f92411b3.webp" as="image" type="image/webp" />
        <link rel="preload" href="/logo-GMIT.png" as="image" type="image/png" />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//beta.ourmanna.com" />

        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://beta.ourmanna.com" />

        <meta content="summary" name="twitter:card" />
        <meta content="https://www.gmitjio-oepura.org" name="twitter:url" />
        <meta content="GMIT Imanuel Oepura" name="twitter:title" />
        <meta
          content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi."
          name="twitter:description"
        />
        <meta
          content="https://www.gmitjio-oepura.org/logo-GMIT.png"
          name="twitter:image"
        />
        <meta content="@gmitjio" name="twitter:creator" />
        <meta content="website" property="og:type" />
        <meta content="GMIT Imanuel Oepura" property="og:title" />
        <meta
          content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi."
          property="og:description"
        />
        <meta content="GMIT Imanuel Oepura" property="og:site_name" />
        <meta content="https://www.gmitjio-oepura.org" property="og:url" />
        <meta
          content="https://www.gmitjio-oepura.org/logo-GMIT.png"
          property="og:image"
        />

        <link href="https://www.gmitjio-oepura.org" rel="canonical" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  }, function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `,
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
