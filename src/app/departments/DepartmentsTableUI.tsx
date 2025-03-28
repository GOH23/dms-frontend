"use client"

import { Table, Button, Popconfirm, notification, Space, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { api } from "../ui/api/axios";
import { useRouter } from "next/navigation";

type DepartmentType = {
    id: string;
    name: string;
    description?: string;
};

export function DepartmentsTableUI({ departments }: { departments: DepartmentType[] }) {
    const { push } = useRouter();
    const [notifapi, contextHolder] = notification.useNotification();

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`departments/${id}`);
            notifapi.success({
                message: "Отдел успешно удален",
                description: "Отдел был успешно удален из системы."
            });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            notifapi.error({
                message: "Ошибка удаления",
                description: "Не удалось удалить отдел. Возможно, он используется в системе."
            });
        }
    };

    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text || '-'
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: DepartmentType) => (
                <Space>
                    {/* <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => push(`/departments/edit/${record.id}`)}
                    >
                        Редактировать
                    </Button> */}
                    <Popconfirm
                        title="Удалить отдел?"
                        description="Вы уверены, что хотите удалить этот отдел?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button danger icon={<DeleteOutlined />}>Удалить</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="flex justify-between mb-4">
                <Typography.Title level={4}>Список отделов</Typography.Title>
                <Button type="primary" onClick={() => push('/departments/create')}>
                    Добавить отдел
                </Button>
            </div>
            <Table 
                columns={columns} 
                dataSource={departments} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
            {contextHolder}
        </div>
    );
} 