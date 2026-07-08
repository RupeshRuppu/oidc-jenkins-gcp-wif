import mongoose from "mongoose";

// Mirrors the Django `JenkinsClient` model:
//   name (unique), api_key (unique), is_active (default true)
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
  { timestamps: true }
);

export const JenkinsClient = mongoose.model("JenkinsClient", jenkinsClientSchema);
