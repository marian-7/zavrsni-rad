import Push from "push.js";
import notificationSound from "assets/sounds/notification.mp3";
import { i18n } from "assets/strings/i18n";

function createPush(onClick?: () => void) {
  new Audio(notificationSound).play();
  return Push.create(i18n.t("pages.orders.orderReceived"), {
    onClick,
  });
}

export function showNotification(onClick?: () => void) {
  if (Push.Permission.has()) {
    createPush(onClick);
  } else {
    Push.Permission.request(() => {
      createPush(onClick);
    });
  }
}
