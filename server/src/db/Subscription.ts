import mongoose, { Schema, Document } from "mongoose";

interface ISubscription extends Document {
  subscriptionId: string;
  amount: number;
  name: string;
}

const subscriptionSchema = new Schema<ISubscription>({
  subscriptionId: { type: String},
  amount: { type: Number, required: true },
  name: { type: String, required: true , default: 'no-name' },
});

const SubscriptionModel = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

export { SubscriptionModel, ISubscription };
