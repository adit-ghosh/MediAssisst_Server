const mongoose = require('mongoose');

const USER_ROLES = ['patient', 'doctor', 'chemist', 'admin'];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true }
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], 
        default: [0, 0]
      },
      address: {
        type: String
      }
    },
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = { User, USER_ROLES };
