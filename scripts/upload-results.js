#!/usr/bin/env node

const { readFileSync } = require("fs");
const { resolve } = require("path");
const { S3 } = require("aws-sdk");
require("dotenv").config({
    path: resolve(process.cwd(), ".env.local"),
});

const accessKeyId = process.env.ACCESS_KEY_ID_AWS;
const secretAccessKey = process.env.SECRET_ACCESS_KEY_AWS;
const bucketName = process.env.BUCKET_NAME_AWS;

if (!accessKeyId || !secretAccessKey) {
    throw new Error(
        "Please specify ACCESS_KEY_ID_AWS, SECRET_ACCESS_KEY_AWS, and BUCKET_NAME_AWS by adding them as environment variables."
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
