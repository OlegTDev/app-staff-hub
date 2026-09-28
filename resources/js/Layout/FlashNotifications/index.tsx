import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { message } from "antd";
import { useEffect } from "react";

export function FlashNotifications() {
  const { flash } = usePage<PageProps>().props;
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (flash.success) {
      messageApi.open({
        type: 'success',
        content:flash.success,
      });
    }

    if (flash.error) {
      messageApi.open({
        type: 'error',
        content: flash.error,
      });
    }

    if (flash.warning) {
      messageApi.warning({
        type: 'warning',
        content: flash.warning,
      });
    }
  }, [flash, messageApi]);

  return contextHolder;
}
