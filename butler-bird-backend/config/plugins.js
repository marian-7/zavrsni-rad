module.exports = ({ env }) => {
  return {
    email: {
      provider: "mailjet",
      providerOptions: {
        publicApiKey: env("MAILJET_KEY"),
        secretApiKey: env("MAILJET_SECRET"),
      },
      settings: {
        defaultFrom: env("MAILJET_DEFAULT_EMAIL"),
        defaultFromName: "ButlerBird",
      },
    },
    upload: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION"),
        params: {
          Bucket: env("AWS_BUCKET_NAME"),
        },
      },
    },
  };
};
