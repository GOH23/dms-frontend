"use client"
import { Button, Form, Input, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { api } from "../api/axios";

type FieldType = {
    name: string;
    description?: string;
};

export function CreateDepartmentForm() {
    const [form] = useForm();
    const [notifapi, contextHolder] = notification.useNotification();
    
    return (<>
        <Form
            form={form}
            onFinish={(el) => {
                api.post("departments", el).then((data) => {
                    if (data.status == 201) {
                        notifapi.success({
                            message: "Отдел успешно добавлен!"
                        });
                    } 
                }).catch((er) => {
                    notifapi.error({
                        message: "Ошибка добавления",
                        description: er.response?.data?.message || "Произошла ошибка при добавлении отдела"
                    });
                });
                form.resetFields();
            }}
            style={{ maxWidth: 600 }}
        >
            <Form.Item<FieldType>
                label="Название отдела"
                name="name"
                rules={[{ required: true, message: 'Пожалуйста, введите название отдела!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Описание отдела"
                name="description"
            >
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Добавить отдел
                </Button>
            </Form.Item>
            {contextHolder}
        </Form>
    </>);
} 