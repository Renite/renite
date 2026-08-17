import mongoose from "mongoose";

function generateReferralCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ1234567890";

  let code = "RENITE-";

  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}

const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password_hash: {
      type: String,
      required: true,
    },

    // Fayda verification: bypassed for now, wired in later
    fayda_id: {
      type: String,
      unique: true,
      sparse: true,
    },

    fayda_verified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin", "police"],
      default: "user",
    },

    // Automatically generated for every user
    referral_code: {
      type: String,
      unique: true,
      required: true,
    },

    referred_by: {
      type: String,
      default: null,
    },

    loyalty_points: {
      type: Number,
      default: 0,
    },

    preferred_language: {
      type: String,
      default: "en",
    },

    refresh_token: {
      type: String,
      default: null,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Generate referral code automatically
UserSchema.pre('validate', function () {
  if (!this.referral_code) {
    this.referral_code = generateReferralCode();
  }
});

UserSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    full_name: this.full_name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    fayda_verified: this.fayda_verified,
    loyalty_points: this.loyalty_points,
    preferred_language: this.preferred_language,
    referral_code: this.referral_code,
  };
};

export default mongoose.model("User", UserSchema);
