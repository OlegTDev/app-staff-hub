import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';
import { PageProps } from '@/types';

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
