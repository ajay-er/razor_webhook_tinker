import { razorpay } from "../config/razorpay";
import { ISubscription, SubscriptionModel } from "../db/Subscription";

export const getLatestSubscriptions = async (count: number = 10) => {
  const chunkSize = 100;
  const numberOfChunks = Math.ceil(count / chunkSize);

  let allSubscriptions: any[] = [];

  const promises = Array.from({ length: numberOfChunks }, (_, i) => {
    const skip = i * chunkSize;
    return fetchSubscriptions(chunkSize, skip);
  });

  try {
    const settledPromises = await Promise.allSettled(promises);

    settledPromises.forEach((result) => {
      if (result.status === "fulfilled") {
        allSubscriptions = allSubscriptions.concat(result.value);
      } else {
        console.error("Error in fetchSubscriptions:", result.reason);
      }
    });

    for (const sub of allSubscriptions) {
      let subId = sub.id;
      console.log(subId);

      const isSubPresent = await SubscriptionModel.findOne({
        subscriptionId: subId,
      });

      if (!isSubPresent) {
        try {
          const plan = await razorpay.plans.fetch(sub.plan_id);
          const amount = +plan.item.amount;
          const customer = await razorpay.customers.fetch(sub.customer_id);
          const email = customer.email;

          const subscriptionToInsert = {
            amount: amount,
            subscriptionId: subId,
            name: customer.name,
            email,
          };

          await SubscriptionModel.create(subscriptionToInsert);
        } catch (error) {
          console.error("Error processing subscription:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error in getLatestSubscriptions:", error);
  }
};

const fetchSubscriptions = async (
  count: number,
  skip: number
): Promise<any[]> => {
  const result = await razorpay.subscriptions.all({ count, skip });
  return result.items || [];
};
