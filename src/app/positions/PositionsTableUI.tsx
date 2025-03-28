"use client"

import { Table, Button, Popconfirm, notification, Space, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { api } from "../ui/api/axios";
import { useRouter } from "next/navigation";

type PositionType = {
    id: string;
    name: string;
    description?: string;
};

export function PositionsTableUI({ positions }: { positions: PositionType[] }) {
    const { push } = useRouter();
    const [notifapi, contextHolder] = notification.useNotification();

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`positions/${id}`);
            notifapi.success({
                message: "Должность успешно удалена",
                description: "Должность была успешно удалена из системы."
            });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            notifapi.error({
                message: "Ошибка удаления",
                description: "Не удалось удалить должность. Возможно, она используется в системе."
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
            render: (_: any, record: PositionType) => (
                <Space>
                    {/* <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => push(`/positions/edit/${record.id}`)}
                    >
                        Редактировать
                    </Button> */}
                    <Popconfirm
                        title="Удалить должность?"
                        description="Вы уверены, что хотите удалить эту должность?"
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
                <Typography.Title level={4}>Список должностей</Typography.Title>
                <Button type="primary" onClick={() => push('/positions/create')}>
                    Добавить должность
                </Button>
            </div>
            <Table 
                columns={columns} 
                dataSource={positions} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
            {contextHolder}
        </div>
    );
} 