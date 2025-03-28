"use client"
import { Button, Form, Input, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { api } from "../api/axios";

type FieldType = {
    name: string;
    description?: string;
};

export function CreatePositionForm() {
    const [form] = useForm();
    const [notifapi, contextHolder] = notification.useNotification();
    
    return (<>
        <Form
            form={form}
            onFinish={(el) => {
                api.post("positions", el).then((data) => {
                    if (data.status == 201) {
                        notifapi.success({
                            message: "Должность успешно добавлена!"
                        });
                    } 
                }).catch((er) => {
                    notifapi.error({
                        message: "Ошибка добавления",
                        description: er.response?.data?.message || "Произошла ошибка при добавлении должности"
                    });
                });
                form.resetFields();
            }}
            style={{ maxWidth: 600 }}
        >
            <Form.Item<FieldType>
                label="Название должности"
                name="name"
                rules={[{ required: true, message: 'Пожалуйста, введите название должности!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Описание должности"
                name="description"
            >
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Добавить должность
                </Button>
            </Form.Item>
            {contextHolder}
        </Form>
    </>);
} 