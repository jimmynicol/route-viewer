#!/usr/bin/env node

const { readFileSync } = require("fs");
const { resolve } = require("path");
const { S3 } = require("aws-sdk");
require("dotenv").config({
    path: resolve(process.cwd(), ".env.local"),
});

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

if (!accessKeyId || !secretAccessKey) {
    throw new Error(
        "Please specify AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_BUCKET_NAME by adding them as environment variables."
    );
}

const filepath = process.argv[2];

if (!filepath) {
    throw new Error("Please specify a file to upload.");
}

const filename = filepath.split("/").slice(-1)[0];
const fileContent = readFileSync(resolve(filepath));

const s3 = new S3({ accessKeyId, secretAccessKey });

s3.upload(
    {
        Bucket: bucketName,
        Key: `rides/${filename}`,
        Body: fileContent,
    },
    (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`File uploaded sucessfully: ${data.Location}`);
        }
    }
);
