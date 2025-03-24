"use client"
import Cookies from 'js-cookie'
import { InboxOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, Input, message, Upload } from "antd"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DocumentsService } from '../services/documentsService'

const { Dragger } = Upload
const { TextArea } = Input

export function CreateDocumentForm() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [file, setFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        if (!file) {
            message.error('Пожалуйста, загрузите файл');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('docNumber', values.docNumber || '');
            formData.append('description', values.description || '');
            
            if (values.deadline) {
                formData.append('deadline', values.deadline.toISOString());
            }

            await DocumentsService.createDocument(formData);
            
            message.success('Документ успешно создан');
            form.resetFields();
            setFile(null);
            router.push('/documents');
        } catch (error) {
            console.error('Ошибка при создании документа:', error);
            message.error('Ошибка при создании документа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Номер документа"
                    name="docNumber"
                >
                    <Input placeholder="Введите номер документа" />
                </Form.Item>

                <Form.Item
                    label="Описание"
                    name="description"
                >
                    <TextArea 
                        rows={4} 
                        placeholder="Введите описание документа" 
                    />
                </Form.Item>

                <Form.Item
                    label="Срок исполнения"
                    name="deadline"
                >
                    <DatePicker 
                        className="w-full" 
                        placeholder="Выберите дату" 
                    />
                </Form.Item>

                <Form.Item
                    label="Файл документа"
                    required
                >
                    <Dragger
                        height={200}
                        name="file"
                        multiple={false}
                        beforeUpload={(file) => {
                            setFile(file);
                            return false;
                        }}
                        onRemove={() => {
                            setFile(null);
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Нажмите или перетащите файл для загрузки</p>
                        <p className="ant-upload-hint">
                            Поддерживается загрузка одного файла. Запрещено загружать конфиденциальные данные компании.
                        </p>
                    </Dragger>
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        className="w-full"
                    >
                        Создать документ
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}