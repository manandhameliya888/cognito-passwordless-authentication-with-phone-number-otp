const AWS = require('aws-sdk');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  console.log("SIGN Up Function Called ====>>>>>", event.body);
  const { phone_number, password } = JSON.parse(event.body); //password should be string

  try {
    const params = {
      ClientId: '<Congito App Client ID>',
      Username: phone_number,
      Password: password,
      UserAttributes: [
        { Name: 'phone_number', Value: phone_number }
      ]
    };
    await cognitoidentityserviceprovider.signUp(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User successfully registered' })
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || 'An error occurred' })
    };
  }
};
