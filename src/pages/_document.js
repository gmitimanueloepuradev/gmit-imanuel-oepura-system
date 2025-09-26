import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta name="application-name" content="GMIT Imanuel Oepura" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GMIT JIO" />
        <meta name="description" content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://www.gmitjio-oepura.org" />
        <meta name="twitter:title" content="GMIT Imanuel Oepura" />
        <meta name="twitter:description" content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi." />
        <meta name="twitter:image" content="https://www.gmitjio-oepura.org/logo-GMIT.png" />
        <meta name="twitter:creator" content="@gmitjio" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GMIT Imanuel Oepura" />
        <meta property="og:description" content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi." />
        <meta property="og:site_name" content="GMIT Imanuel Oepura" />
        <meta property="og:url" content="https://www.gmitjio-oepura.org" />
        <meta property="og:image" content="https://www.gmitjio-oepura.org/logo-GMIT.png" />

        <link rel="canonical" href="https://www.gmitjio-oepura.org" />

        <script dangerouslySetInnerHTML={{
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
          `
        }} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
