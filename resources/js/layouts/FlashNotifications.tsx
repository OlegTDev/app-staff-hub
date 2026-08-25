import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';

interface PageProps {
  flash: {
    success: string | null;
    error: string | null;
  };
  [key: string]: any;
}

export function FlashNotifications() {
  const { flash } = usePage<PageProps>().props;

  useEffect(() => {
    if (flash.success) {
      notifications.show({
        title: 'Успешно',
        message: flash.success,
        color: 'green',
      });
    }

    if (flash.error) {
      notifications.show({
        title: 'Ошибка',
        message: flash.error,
        color: 'red',
      });
    }
  }, [flash]);

  return null;
}
