/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    env: {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
        S3_BUCKET_AWS: process.env.S3_BUCKET_AWS,
    },
};
