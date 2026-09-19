import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const scriptSrc = ["'self'", "'unsafe-inline'"];
if (isDevelopment) {
  scriptSrc.push("'unsafe-eval'");
}

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  // 'self', not 'none': these headers also ride on /public assets, so
  // 'none' made the résumé PDF refuse to render inside the clause 5.2
  // viewer on its own origin (200, then ERR_BLOCKED_BY_RESPONSE).
  // Clickjacking needs a *foreign* ancestor, which this still forbids.
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src ${scriptSrc.join(" ")}`,
  "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*",
  "worker-src 'self' blob:",
];

const csp = cspDirectives.join("; ");

const nextConfig: NextConfig = {
  // The root layout lives in app/[locale], so unmatched routes have no
  // layout to render into; global-not-found.tsx supplies the document.
  experimental: {
    globalNotFound: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Matches frame-ancestors above; the legacy header has no
            // directive for "same origin only" other than SAMEORIGIN.
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
