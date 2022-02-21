/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    env: {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    },
};
