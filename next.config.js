module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qabrvftyvxzxtpaovrgc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "relate-api.totalfamily.io",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/family/connect-results",
        destination: "/vision",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.totalfamilymgmt.com",
          },
        ],
        destination: "https://www.totalfamily.io/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "relate.totalfamily.io",
          },
        ],
        destination: "https://www.totalfamily.io/:path*",
        permanent: true,
      },
      {
        source: "/video/:path*",
        destination: "/v/:path*",
        permanent: true,
      },
      {
        source: "/schedule/:path*",
        destination: "/sessions/:path*/schedule",
        permanent: true,
      },
      {
        source: "/workshops/:path*",
        destination: "/sessions/:path*",
        permanent: true,
      },
    ];
  },
};
