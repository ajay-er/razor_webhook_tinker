import SocketManager from "../config/socket";
import { INewSubscription } from "../interface";

export const emitSubscriptionSuccess = (userData: INewSubscription) => {
  const io = SocketManager.getSocketIO();
  io.emit("subscription_actived", userData);
};
