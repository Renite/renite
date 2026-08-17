import { profileService } from "../services/profile.service.js";
import { logAudit } from "../utils/audit.js";

export async function getMyProfile(req, res, next) {
  try {
    const profile = await profileService.getMyProfile(req.user.sub);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

export async function createProfile(req, res, next) {
  try {
    const profile = await profileService.createProfile(req.user.sub, req.body);

    logAudit(req, {
      action: "PROFILE_CREATED",
      entityType: "Profile",
      entityId: profile._id.toString(),
      userId: req.user.sub,
    });

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req, res, next) {
  try {
    const profile = await profileService.updateMyProfile(
      req.user.sub,
      req.body,
    );

    logAudit(req, {
      action: "PROFILE_UPDATED",
      entityType: "Profile",
      entityId: profile._id.toString(),
      userId: req.user.sub,
    });

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteMyProfile(req, res, next) {
  try {
    await profileService.deleteMyProfile(req.user.sub);

    logAudit(req, {
      action: "PROFILE_DELETED",
      entityType: "Profile",
      userId: req.user.sub,
    });

    res.status(200).json({
      success: true,
      data: {
        deleted: true,
      },
    });
  } catch (err) {
    next(err);
  }
}
