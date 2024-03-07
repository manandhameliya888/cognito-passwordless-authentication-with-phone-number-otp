const AWS = require("aws-sdk");

const sns = new AWS.SNS({
  accessKeyId: "<accessKeyId>",
  secretAccessKey: "<secretAccessKey>",
  region: "<region>"
});

const SMS = {
  send: async (phoneNumber, message) => {
    console.log("SMS Function Called =====>>>>> ", message, phoneNumber);
    try {
      let response = sns.publish(
        {
          Message: message,
          PhoneNumber: phoneNumber,
        },
        (err, data) => {
          if (err) {
            console.log("Failed to send SMS message:", err);
          } else {
            console.log("SMS message sent successfully:", {
              id: data.MessageId,
            });
          }
        }
      );
      console.log("Response ===>>>", response);
    } catch (error) {
      console.log("Error =====>>>>>", error);
      throw error;
    }
  },
};

module.exports = { SMS: SMS };
