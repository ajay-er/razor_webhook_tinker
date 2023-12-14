import razorpay from "razorpay";
import { Request, Response } from "express";
import { EventModel } from "../db/event";
import { SubscriptionModel } from "../db/Subscription";
import { emitSubscriptionSuccess } from "../events/subscription.charged";

export const webHookCharged = async (req: Request, res: Response) => {
  const { payload } = req.body;

  if (!payload || !payload.payment || !payload.payment.entity) {
    return res.status(400).json({
      status: "Invalid webhook request body structure.",
    });
  }

  const receivedEventId = req.headers["x-razorpay-event-id"];

  const event = await EventModel.findOne({ eventId: receivedEventId });

  if (event) return res.status(200).json({ status: "Event already processed" });

  const requestedBody = JSON.stringify(req.body);

  const receivedSignature = req.headers["x-razorpay-signature"];

  const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

  const isVerified = razorpay.validateWebhookSignature(
    requestedBody,
    receivedSignature as string,
    WEBHOOK_SECRET!
  );

  if (!isVerified)
    return res.status(400).json({
      status: "Signature not valid.",
    });
  
  const subscription = payload.payment.entity;
  const amount = payload.payment.entity.amount;
  const subscriptionId = payload?.subscription?.entity?.id;
  const nameArray = subscription.notes || []
  const eventName = req.body['event'];
  let name = "no-name";

  for (const note of nameArray) {
    if (note?.name) {
      name = note.name;
      break;
    }
  }
  emitSubscriptionSuccess({ amountDonated: amount, subscriberName: name });
  // db operations
  await SubscriptionModel.create({
    amount,
    subscriptionId,
    name,
  });

  await EventModel.create({eventId:receivedEventId , name:eventName})
  res.json({ ok: "OK" });
};