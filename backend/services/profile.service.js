import Profile from "../models/Profile.js";
import { AppError } from "./auth.service.js";

const PROFILE_FIELDS = [
  "first_name",
  "last_name",
  "display_name",
  "profile_image",
  "language",
  "location",
  "bio",
];

function pickProfileFields(data = {}) {
  return Object.fromEntries(
    PROFILE_FIELDS.filter((field) => data[field] !== undefined).map((field) => [
      field,
      data[field],
    ]),
  );
}

function validateProfileFields(data) {
  if (data.first_name !== undefined && !String(data.first_name).trim()) {
    throw new AppError(400, "VALIDATION_ERROR", "first_name cannot be empty");
  }

  if (data.last_name !== undefined && !String(data.last_name).trim()) {
    throw new AppError(400, "VALIDATION_ERROR", "last_name cannot be empty");
  }

  if (data.bio !== undefined && String(data.bio).length > 500) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "bio must be 500 characters or less",
    );
  }
}

export const profileService = {
  /**
   * Get the authenticated user's profile.
   */
  async getMyProfile(userId) {
    const profile = await Profile.findOne({
      user_id: userId,
      deleted_at: null,
    });

    if (!profile) {
      throw new AppError(404, "PROFILE_NOT_FOUND", "Profile not found");
    }

    return profile;
  },

  /**
   * Create a profile for the authenticated user.
   */
  async createProfile(userId, data) {
    const existing = await Profile.findOne({
      user_id: userId,
    });

    if (existing && !existing.deleted_at) {
      throw new AppError(409, "PROFILE_EXISTS", "Profile already exists");
    }

    const fields = pickProfileFields(data);

    validateProfileFields(fields);

    if (!fields.first_name || !fields.last_name) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        "first_name and last_name are required",
      );
    }

    try {
      // Restore a previously soft-deleted profile.
      if (existing?.deleted_at) {
        Object.assign(existing, fields, {
          deleted_at: null,
        });

        return await existing.save();
      }

      return await Profile.create({
        user_id: userId,
        ...fields,
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError(409, "PROFILE_EXISTS", "Profile already exists");
      }

      throw err;
    }
  },

  /**
   * Update the authenticated user's profile.
   */
  async updateMyProfile(userId, data) {
    const fields = pickProfileFields(data);

    if (Object.keys(fields).length === 0) {
      throw new AppError(400, "VALIDATION_ERROR", "No profile fields provided");
    }

    validateProfileFields(fields);

    const profile = await Profile.findOneAndUpdate(
      {
        user_id: userId,
        deleted_at: null,
      },
      {
        $set: fields,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!profile) {
      throw new AppError(404, "PROFILE_NOT_FOUND", "Profile not found");
    }

    return profile;
  },

  /**
   * Soft-delete the authenticated user's profile.
   */
  async deleteMyProfile(userId) {
    const profile = await Profile.findOneAndUpdate(
      {
        user_id: userId,
        deleted_at: null,
      },
      {
        $set: {
          deleted_at: new Date(),
        },
      },
      {
        new: true,
      },
    );

    if (!profile) {
      throw new AppError(404, "PROFILE_NOT_FOUND", "Profile not found");
    }

    return {
      deleted: true,
    };
  },
};
