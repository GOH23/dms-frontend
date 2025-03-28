"use client"
import { Button, Form, Input, notification, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { api } from "../api/axios";
import { useEffect, useState } from "react";

type FieldType = {
    username?: string;
    email?: string;
    password?: string;
    departmentName?: string;
    positionName?: string;
};

type Department = {
    id: string;
    name: string;
    description?: string;
}

type Position = {
    id: string;
    name: string;
    description?: string;
}

export function CreateUserForm() {
    const [form] = useForm();
    const [notifapi, contextHolder] = notification.useNotification();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загружаем список отделов и должностей при монтировании компонента
        const fetchData = async () => {
            setLoading(true);
            try {
                const [departmentsRes, positionsRes] = await Promise.all([
                    api.get("departments"),
                    api.get("positions")
                ]);
                
                setDepartments(departmentsRes.data || []);
                setPositions(positionsRes.data || []);
            } catch (error) {
                notifapi.error({
                    message: "Ошибка загрузки данных",
                    description: "Не удалось загрузить список отделов и должностей"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [notifapi]);

    return (<>
        <Form
            form={form}
            onFinish={(el) => {
                api.post("users", el).then((data) => {
                    if (data.status == 201) {
                        notifapi.success({
                            message: "Пользователь успешно добавлен!"
                        });
                    } 
                }).catch((er) => {
                    notifapi.error({
                        message: "Ошибка добавления",
                        description: er.response?.data?.message || "Произошла ошибка при добавлении пользователя"
                    });
                });
                form.resetFields();
            }}
            style={{ maxWidth: 600 }}
            disabled={loading}
        >
            <Form.Item<FieldType>
                label="ФИО пользователя"
                name="username"
                rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Почта пользователя"
                name="email"
                rules={[{ required: true, type: "email", message: 'Пожалуйста, введите корректный email!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
                label="Отдел"
                name="departmentName"
                rules={[{ required: true, message: 'Пожалуйста, выберите отдел!' }]}
            >
                <Select
                    placeholder="Выберите отдел"
                    loading={loading}
                    options={departments.map((dept,ind) => ({
                        key: ind,
                        value: dept.name,
                        label: dept.name
                    }))}
                />
            </Form.Item>
            <Form.Item<FieldType>
                label="Должность"
                name="positionName"
                rules={[{ required: true, message: 'Пожалуйста, выберите должность!' }]}
            >
                <Select
                    placeholder="Выберите должность"
                    loading={loading}
                    options={positions.map((pos,ind) => ({
                        key: ind,
                        value: pos.name,
                        label: pos.name
                    }))}
                />
            </Form.Item>
            <Form.Item label={null}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Добавить пользователя
                </Button>
            </Form.Item>
            {contextHolder}
        </Form>
    </>);
}