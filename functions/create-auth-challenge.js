const _ = require('lodash')
const Chance = require('chance')
const chance = new Chance()


const { MAX_ATTEMPTS } = require('../lib/constants')

const { SMS } = require('../lib/sms')

module.exports.handler = async (event) => {
  console.log("Create Auth Event ===>>> ", event);

  if (!event.request.userAttributes.phone_number) {
    throw new Error("Phone Number Not Found!")
  }

  let otpCode
  if (!event.request.session || !event.request.session.length) {

    // new auth session & sending otp to the user's phone number
    otpCode = chance.string({ length: 6, alpha: false, symbols: false, numeric: true })

    console.log("OTP SENT TO PHONE NUMBER ====>>>> ", otpCode);
    await SMS.send(event.request.userAttributes.phone_number, otpCode);

  } else {
    // existing session, user has provided a wrong answer, so we need to
    // give them another chance
    const previousChallenge = _.last(event.request.session)
    const challengeMetadata = previousChallenge?.challengeMetadata

    if (challengeMetadata) {
      // challengeMetadata should start with "CODE-", hence index of 5
      otpCode = challengeMetadata.substring(5)
    }
  }

  const attempts = _.size(event.request.session)
  const attemptsLeft = MAX_ATTEMPTS - attempts
  event.response.publicChallengeParameters = {
    phone_number: event.request.userAttributes.phone_number,
    maxAttempts: MAX_ATTEMPTS,
    attempts,
    attemptsLeft
  }

  // NOTE: the private challenge parameters are passed along to the 
  // verify step and is not exposed to the caller
  // need to pass the secret code along so we can verify the user's answer
  event.response.privateChallengeParameters = {
    secretLoginCode: otpCode
  }

  event.response.challengeMetadata = `CODE-${otpCode}`

  return event
}


