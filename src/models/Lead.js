import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    propertyInterest: {
      type: String,
      required: [true, "Property interest is required"],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
    },
    status: {
      type: String,
      enum: ["New", "Assigned", "Contacted", "In Progress", "Closed", "Lost"],
      default: "New",
    },
    notes: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    score: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    source: {
      type: String,
      enum: ["Facebook Ads", "Walk-in Client", "Website Inquiry", "Referral", "Other"],
      default: "Other",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

leadSchema.pre("save", function (next) {
  if (this.budget > 20000000) {
    this.score = "High";
  } else if (this.budget >= 10000000 && this.budget <= 20000000) {
    this.score = "Medium";
  } else {
    this.score = "Low";
  }

  next();
});

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);