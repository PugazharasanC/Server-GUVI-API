import express from "express";
import {
  createMockApi,
  getMockApis,
  getMockApiById,
  accessMockApiData,
  updateMockApi,
  deleteMockApi,
} from "../controllers/mockApiController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes (protected)
router.post("/", protect, admin, createMockApi);
router.put("/:id", protect, admin, updateMockApi);
router.delete("/:id", protect, admin, deleteMockApi);

// Public and authenticated routes
router.get("/", protect, getMockApis);
router.get("/:id", protect, getMockApiById);
router.get("/data/:endpoint", accessMockApiData);

const mockApiRoutes = router;
export default mockApiRoutes;
