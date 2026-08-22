import { Router } from "express";

import {
  getMyProfile,
  createProfile,
  updateMyProfile,
  deleteMyProfile,
} from "../controllers/profile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Get authenticated user's profile
 *
 * GET /api/v1/profile/me
 */
router.get("/me", authenticate, getMyProfile);

/**
 * Create authenticated user's profile
 *
 * POST /api/v1/profile
 */
router.post("/", authenticate, createProfile);

/**
 * Update authenticated user's profile
 *
 * PATCH /api/v1/profile/me
 */
router.patch("/me", authenticate, updateMyProfile);

/**
 * Soft-delete authenticated user's profile
 *
 * DELETE /api/v1/profile/me
 */
router.delete("/me", authenticate, deleteMyProfile);

export default router;
