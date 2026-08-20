import { Link, router, usePage } from "@inertiajs/react";
import { AppShell, Avatar, Burger, Button, Group, MantineProvider, Menu, NavLink, Title, useMantineColorScheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { IconArmchair, IconBuildingSkyscraper, IconFileInvoice, IconMoon, IconSun, IconUsers } from "@tabler/icons-react";
import { useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const [opened, setOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const currentUrl = usePage().url;

  return (
    <MantineProvider>
      <ModalsProvider>
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
          padding="md"
          styles={(theme) => ({
            main: {
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
            navbar: {
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
            }
          })}
        >
          <AppShell.Header>
            <Group h="100%" px="lg" justify="space-between">
              <Group>
                <Burger opened={opened} onClick={() => setOpened(!opened)} hiddenFrom="sm" size="sm">
                  <Title order={4} fw={600}>HubControl</Title>
                </Burger>
                <Title order={4}>УФНС России по Ханты-Мансийскому автономному округу - Югре</Title>
              </Group>
              <Group>
                <Button onClick={() => toggleColorScheme()} variant="default" size="xs">
                  {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
                </Button>
                <Menu shadow="md">
                  <Menu.Target>
                    <Avatar color="cyan" radius="xl">MK</Avatar>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => router.delete('/logout')}>
                      Выход
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </AppShell.Header>

          <AppShell.Navbar>
            <NavLink
              component={Link}
              href="/users"
              label="Пользователи и роли"
              leftSection={<IconUsers />}
              active={currentUrl.startsWith('/users')}
              color="gray"
            />

            <NavLink
              component={Link}
              href="/"
              label="Санаторно-курортное лечение"
              leftSection={<IconBuildingSkyscraper />}
              active={currentUrl === '/'}
              color="gray"
            >
              <NavLink
                component={Link}
                href="/new"
                label="Санатории"
                leftSection={<IconArmchair />}
                active={currentUrl.startsWith('/new')}
                color="gray"
              />
              <NavLink
                component={Link}
                href="/test"
                label="Заявления"
                leftSection={<IconFileInvoice />}
                active={currentUrl.startsWith('/test')}
                color="gray"
              />
            </NavLink>

          </AppShell.Navbar>

          <AppShell.Main>
            {children}
          </AppShell.Main>

        </AppShell>
      </ModalsProvider>
    </MantineProvider>

  );
}
