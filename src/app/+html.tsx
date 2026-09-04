import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

const customStyles = `
/* CSS Reset & PWA Optimizations */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #0E1211;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Prevent native selection & callouts for app-like touch feel */
* {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

/* Desktop framing: center inside iPhone frame on screens wider than 500px */
@media (min-width: 501px) {
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at top, #1A2220 0%, #0B0E0D 100%);
  }

  #root {
    width: 100% !important;
    max-width: 430px !important;
    height: 94vh !important;
    max-height: 932px !important;
    border-radius: 46px !important;
    overflow: hidden !important;
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 10px #1E2523, 0 0 0 12px #2E3835 !important;
    position: relative !important;
  }
}

/* Mobile: full edge-to-edge native display */
@media (max-width: 500px) {
  #root {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
  }
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1.00001, viewport-fit=cover, user-scalable=no"
        />
        <title>OwnCura — Independence OS</title>

        {/* PWA Settings */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#11655B" />

        {/* Apple Touch & PWA Standalone Mode */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="OwnCura" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
