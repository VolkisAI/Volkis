const config = {
  // REQUIRED
  appName: "ShipFast",
  appDescription:
    "The NextJS boilerplate with all you need to build your SaaS, AI tool, or any other web app.",
  domainName: "shipfa.st",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_456",
        name: "Starter",
        description: "Perfect for small projects",
        price: 79,
        priceAnchor: 99,
        features: [
          {
            name: "NextJS boilerplate",
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ],
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_456",
        name: "Advanced",
        description: "You need more power",
        price: 99,
        priceAnchor: 149,
        features: [
          {
            name: "NextJS boilerplate",
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
          { name: "24/7 support" },
        ],
      },
    ],
  },
  aws: {
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    subdomain: "mg",
    fromNoReply: `Boilerplate <sebastian@volkis.co.uk>`,
    fromAdmin: `Test <sebastian@volkis.co.uk>`,
    supportEmail: "sebastian@volkis.co.uk",
    forwardRepliesTo: "sebastian@volkis.co.uk",
  },
  colors: {
    main: "#0099ff",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;
