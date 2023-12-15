import { Request, Response } from "express";
import { SubscriptionModel } from "../db/Subscription";

const CURRENT_AMOUNT =+ process.env.CURRENT_AMOUNT!;

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
    const total = CURRENT_AMOUNT / 100 + result[0].totalAmount / 100;
    return res.json({ totalDonation: total });
  } else {
    return res.json({ totalDonation: CURRENT_AMOUNT + 0 });
  }
};
