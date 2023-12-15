import { Request, Response } from "express";
import { SubscriptionModel } from "../db/Subscription";

export const getAllSubscriptions = async (req: Request, res: Response) => {
  const result = await SubscriptionModel.find({});
  res.json({result});
};
