import mongoose from "mongoose";

const jenkinsClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      trim: true,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const JenkinsClient = mongoose.model(
  "JenkinsClient",
  jenkinsClientSchema,
);
