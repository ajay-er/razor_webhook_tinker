import mongoose, { Schema, Document } from "mongoose";

interface ISubscription extends Document {
  subscriptionId: string;
  amount: number;
  name: string;
  email:string;
}

const subscriptionSchema = new Schema<ISubscription>({
  subscriptionId: { type: String , unique:true},
  amount: { type: Number, required: true },
  name: { type: String, required: true , default: 'no-name' },
  email: { type: String, required: true },
});

const SubscriptionModel = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

export { SubscriptionModel, ISubscription };
