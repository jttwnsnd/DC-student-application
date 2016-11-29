var mongoose = require('mongoose');

var User = mongoose.model('User', {
  administrator: { type: Boolean, default: false },
  resume: { type: Buffer, default: null },
  resumeName: String,
  authenticationTokens: [{ token: String, expiration: Date }],
  email: { type: String, unique: true },
  password: String,
  firstname: String,
  lastname: String,
  phone: String,
  birthday: Date,
  howDidYouHear: [String],
  address: String,
  city: String,
  cohort: String,
  relocating: String,
  education: String,
  employment: String,
  loan: String,
  programming: String,
  interest: String,
  plan: String,
  why: String,
  github: String,
  linkedin: String,
  portfolio: String,
  understand: String,
  effortagree: String,
  forcePasswordReset: { type: Boolean, default: false },
  applicationCompleted: { type: Boolean, default: false },
  applicationCompletedDate: { type: Date, default: null },
  codeChallengeCompleted: { type: Boolean, default: false },
  codeChallengeCompletedDate: { type: Date, default: null },
  codeChallengeAnswers: {
    /*
    reset these values to false and 0 for prod
    */
    '1': { type: Boolean, default: false },
    '2': { type: Boolean, default: false },
    '3': { type: Boolean, default: false },
    '4': { type: Boolean, default: false },
    '5': { type: Boolean, default: false },
    '6': { type: Boolean, default: false },
    '7': { type: Boolean, default: false },
    'numCorrect': { type: Number, default: 0 }
  },
  interviewScheduled: { type: Boolean, default: false },
  interviewScheduledDate: { type: Date, default: null },
  pageLastCompleted: { type: Number, default: 0 }
});

module.exports = User;
