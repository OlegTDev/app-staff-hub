import { Space, Table, Tag, TableProps, Button, Input, Drawer, Tooltip, Flex, Modal } from "antd";
import { Role, User, UserLabels } from "./types";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { BaseFilters, PaginatedData } from "@/types/pagination";
import { useDataTable } from "@/hooks/useDataTable";
import { formatDate } from "@/utils/dateHelpers";
import Title from "@/Shared/Title";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import FormGeneral from "./Forms/General";
import FormRoles from "./Forms/Roles";


interface PageProps {
  items: PaginatedData<User>;
  query: BaseFilters;
  labels: UserLabels;
  roles: Role[];
};

interface TableHeaderProps {
  table: ReturnType<typeof useDataTable<User>>;
  handleCreateClick: () => void;
}
const TableHeader = ({ table, handleCreateClick }: TableHeaderProps) => {
  return (
    <Flex justify="space-between">
      <Button onClick={handleCreateClick} type="primary">Добавить</Button>
      <Input.Search
        placeholder="Поиск..."
        allowClear
        style={{ maxWidth: 400 }}
        enterButton={<Button type="default">Найти</Button>}
        loading={table.loading}
        defaultValue={table.search}
        onSearch={(value) => table.handleSearchChange(value)}
        onChange={(e) => {
          if (!e.target.value) {
            table.handleSearchChange('');
          }
        }}
      />
    </Flex>
  );
};

export default function Index({ items, query, labels, roles }: PageProps): React.JSX.Element {
  const title = 'Пользователи';
  const [selectedUser, setSelectedUser] = useState<User|undefined>();
  const [openGeneral, setOpenGeneral] = useState(false);
  const [openRoles, setOpenRoles] = useState(false);
  const { confirm } = Modal;

  const table = useDataTable<User>({
    routeName: route('users.index'),
    items,
    query,
  });

  const handleDeleteUser = (user: User) => {
    confirm({
      title: 'Удаление пользователя',
      icon: <DeleteOutlined />,
      content: 'Вы уверены, что хотите удалить пользователя?',
      onOk() {
        router.delete(route('users.destroy', { id: user.id }));
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: labels.id,
      dataIndex: 'id',
    },
    {
      title: labels.login,
      dataIndex: 'login',
      sorter: true,
    },
    {
      title: labels.name,
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: labels.department,
      dataIndex: 'department',
      sorter: true,
    },
    {
      title: labels.position,
      dataIndex: 'position',
      sorter: true,
    },
    {
      title: labels.roles,
      key: 'roles',
      render: (record: User) => (
        <Space orientation="vertical">
          { record.roles.map((role: Role) => (<Tag color="blue" key={role.id}>{role.name}</Tag>)) }
        </Space>
      ),
    },
    {
      title: labels.email,
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: labels.created_at,
      dataIndex: 'created_at',
      sorter: true,
      render: (value: string) => {
        return formatDate(value);
      },
    },
    {
      title: 'Управление',
      render: (record: User) => (
        <Space>
          <Tooltip title="Редактирование основной информации пользователя">
            <Button icon={<EditOutlined />} onClick={() => { setSelectedUser(record); setOpenGeneral(true); }} />
          </Tooltip>
          <Tooltip title="Редактирование ролей пользователя">
            <Button icon={<UsergroupAddOutlined />} onClick={() => { setSelectedUser(record); setOpenRoles(true); }} />
          </Tooltip>
          <Tooltip title="Удалить пользователя" color="red">
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteUser(record)} />
          </Tooltip>
        </Space>
      ),
      width: 85,
    },
  ];

  const handleTableChange: TableProps<User>['onChange'] = (pagination, _, sorter, extra) => {
    if (extra.action === 'paginate') {
      if (pagination.current !== undefined) {
        table.setPage(pagination.current);
      }
    }

    if (extra.action === 'sort') {
      if (!Array.isArray(sorter)) {
        table.setSortStatus({
          column: sorter.field?.toString(),
          direction: sorter.order !== undefined ? (sorter.order === 'ascend' ? 'asc' : 'desc') : undefined,
        });
      }
    }
  };

  const handleCreateClick = () => {
    setSelectedUser(undefined);
    setOpenGeneral(true);
  };

  const onSuccessGeneral = () => {
    setOpenGeneral(false);
  };

  const onSuccessRoles = () => {
    setOpenRoles(false);
  };

  return (
    <>
      <Drawer
        title={selectedUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
        open={openGeneral}
        onClose={() => { setOpenGeneral(false); setSelectedUser(undefined); }}
        destroyOnHidden
      >
        <FormGeneral labels={labels} user={selectedUser} roles={roles} onSuccess={onSuccessGeneral} />
      </Drawer>
      <Drawer
        title="Роли"
        open={openRoles}
        onClose={() => { setOpenRoles(false); setSelectedUser(undefined); }}
        destroyOnHidden
      >
        {selectedUser && (
          <FormRoles idUser={selectedUser.id} roles={roles} userRoles={selectedUser?.roles ? selectedUser.roles : []} onSuccess={onSuccessRoles} />
        )}
      </Drawer>

      <Head title={title} />
      <Title level={2} text={title} />
      <Table<User>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={items.data}
        pagination={{
          current: items.current_page,
          pageSize: items.per_page,
          total: items.total,
        }}
        loading={table.loading}
        onChange={handleTableChange}
        bordered
        title={() => <TableHeader handleCreateClick={handleCreateClick} table={table} />}
      />
    </>
  );
}
