import mongoose from "mongoose";

const mockApiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    endpoint: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    responseData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for efficient lookups
mockApiSchema.index({ endpoint: 1 });

const MockApi = mongoose.model("MockApi", mockApiSchema);

export default MockApi;
