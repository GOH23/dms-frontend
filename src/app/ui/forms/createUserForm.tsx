"use client"
import { Alert, Button, Form, FormProps, Input, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { api } from "../api/axios";
import { useState } from "react";
type FieldType = {
    username?: string;
    email?: string
    password?: string;
};

export function CreateUserForm() {
    const [form] = useForm()
    const [notifapi, contextHolder] = notification.useNotification();
    return (<>

        <Form
            form={form}
            onFinish={(el) => {
                api.post("users", el).then((data) => {
                    if (data.status == 201) {
                        notifapi.success({
                            message: "Пользователь успешно добавлен!"
                        })
                    } 
                }).catch((er) => {
                    notifapi.error({
                        message: "Ошибка добавления"
                    })
                })
                form.resetFields();
            }}
            style={{ maxWidth: 600 }}
        >
            <Form.Item<FieldType>
                label="Имя пользователя"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Почта пользователя"
                name="email"
                rules={[{ required: true, type: "email", message: 'Please input your email!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Добавить пользователя
                </Button>
            </Form.Item>
            {contextHolder}
        </Form>
    </>)
}