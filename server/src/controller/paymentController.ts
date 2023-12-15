import { Request, Response } from "express";
import { SubscriptionModel } from "../db/Subscription";

export const getTotalPayment = async (req: Request, res: Response) => {
  const result = await SubscriptionModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  if (result.length > 0) {
    return res.json({ totalDonation: result[0].totalAmount });
  } else {
    return res.json({ totalDonation: 0 });
  }
};
