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
          content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi di Kupang, Nusa Tenggara Timur. Ibadah Minggu, Cell Group, Sidi, Pernikahan, Baptis, Pelayanan Jemaat, dan kegiatan gereja lainnya di Kupang NTT."
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
        
        {/* Enhanced SEO Keywords */}
        <meta 
          content="GMIT, GMIT Imanuel Oepura, GMIT Jemaat Imanuel Oepura, JIO, Gereja Imanuel Oepura Kupang, Gereja Kristen Kupang, Gereja Protestan Kupang, Gereja di Kupang, Ibadah Minggu Kupang, Ibadah Gereja Kupang, Pelayanan Gereja, Jemaat GMIT, Sidi GMIT, Baptis GMIT, Pernikahan Gereja, Kegiatan Gereja Kupang, NTT, Nusa Tenggara Timur, GMIT Kupang, GMIT JIO" 
          name="keywords" 
        />

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

        {/* Preload critical resources moved to specific pages where they are actually used */}

        {/* DNS prefetch for external domains */}
        <link href="//beta.ourmanna.com" rel="dns-prefetch" />

        {/* Preconnect to external origins */}
        <link href="https://beta.ourmanna.com" rel="preconnect" />

        <meta content="summary_large_image" name="twitter:card" />
        <meta content="https://www.gmitjio-oepura.org" name="twitter:url" />
        <meta content="GMIT Imanuel Oepura - Gereja Masehi Injili di Timor" name="twitter:title" />
        <meta
          content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi di Kupang, Nusa Tenggara Timur. Ibadah, Pelayanan, dan Persekutuan Jemaat."
          name="twitter:description"
        />
        <meta
          content="https://www.gmitjio-oepura.org/logo-GMIT.png"
          name="twitter:image"
        />
        <meta content="@gmitjio" name="twitter:site" />
        <meta content="@gmitjio" name="twitter:creator" />
        
        {/* Enhanced Open Graph Tags */}
        <meta content="website" property="og:type" />
        <meta content="GMIT Imanuel Oepura - Gereja Masehi Injili di Timor" property="og:title" />
        <meta
          content="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi di Kupang, Nusa Tenggara Timur. Ibadah, Pelayanan, dan Persekutuan Jemaat."
          property="og:description"
        />
        <meta content="GMIT Jemaat Imanuel Oepura" property="og:site_name" />
        <meta content="https://www.gmitjio-oepura.org" property="og:url" />
        <meta
          content="https://www.gmitjio-oepura.org/logo-GMIT.png"
          property="og:image"
        />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta content="image/png" property="og:image:type" />
        <meta content="id_ID" property="og:locale" />
        <meta content="GMIT Jemaat Imanuel Oepura" property="og:locality" />
        <meta content="Kupang" property="og:region" />
        <meta content="ID" property="og:country-name" />

        <link href="https://www.gmitjio-oepura.org" rel="canonical" />

        {/* Enhanced Schema.org Structured Data */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://www.gmitjio-oepura.org",
              "name": "GMIT Jemaat Imanuel Oepura",
              "alternateName": ["GMIT Imanuel Oepura", "JIO", "GMIT JIO"],
              "url": "https://www.gmitjio-oepura.org",
              "logo": "https://www.gmitjio-oepura.org/logo-GMIT.png",
              "image": "https://www.gmitjio-oepura.org/logo-GMIT.png",
              "description": "GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi di Kupang, Nusa Tenggara Timur.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kupang",
                "addressRegion": "Nusa Tenggara Timur",
                "addressCountry": "ID",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -10.1718,
                "longitude": 123.6044,
              },
              "telephone": "", // Add phone number when available
              "email": "", // Add email when available
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Sunday"],
                "opens": "07:00",
                "closes": "11:00",
              },
              "publicAccess": true,
              "category": [
                "Religious Organization",
                "Christian Church",
                "Protestant Church",
                "Gereja Masehi Injili",
                "Church in Kupang"
              ],
              "areaServed": {
                "@type": "City",
                "name": "Kupang",
                "containedInPlace": {
                  "@type": "AdministrativeArea",
                  "name": "Nusa Tenggara Timur",
                  "containedInPlace": {
                    "@type": "Country",
                    "name": "Indonesia"
                  }
                }
              },
              "foundingDate": "", // Add founding date if available
              "founder": {
                "@type": "Organization",
                "name": "Gereja Masehi Injili di Timor"
              },
              "sameAs": [
                // Add social media URLs when available
              ],
              "potentialAction": {
                "@type": "Action",
                "name": "Join Service",
                "description": "Ibadah Minggu dan Kegiatan Gereja"
              },
              "branchOf": {
                "@type": "Organization",
                "name": "Gereja Masehi Injili di Timor (GMIT)"
              }
            }),
          }}
          type="application/ld+json"
        />

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
