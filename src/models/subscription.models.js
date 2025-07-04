import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //one who is Subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // one to whom "subscriber" is subscribing (owner of channel)
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
