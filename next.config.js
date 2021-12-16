/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    target: "serverless",
    async rewrites() {
        return [
            // Rewrite everything to `pages/index`
            {
                source: "/:any*",
                destination: "/",
            },
        ];
    },
    env: {
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
};
