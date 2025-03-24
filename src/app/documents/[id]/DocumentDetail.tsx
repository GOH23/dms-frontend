"use client"

import { Card, Descriptions, Timeline, Button, Tabs, Modal, Input, message } from "antd";
import { useState } from "react";
import { Document, DocumentHistory, DocumentStatus } from "../../ui/types/documents";
import { DocumentsService } from "../../ui/services/documentsService";
import { useRouter } from "next/navigation";
import { useAuth } from "../../ui/pages/context/authContext";
import { UserSelector } from "../../ui/components/UserSelector";
import { AxiosError } from "axios";

const { TextArea } = Input;
const { TabPane } = Tabs;

interface DocumentDetailProps {
    document: Document;
    history: DocumentHistory[];
}

export function DocumentDetail({ document, history }: DocumentDetailProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [actionType, setActionType] = useState("");
    const [commentText, setCommentText] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    // Функция для получения текста статуса
    const getStatusText = (status: DocumentStatus) => {
        const statusText = {
            [DocumentStatus.DRAFT]: 'Черновик',
            [DocumentStatus.ON_APPROVAL]: 'На согласовании',
            [DocumentStatus.APPROVED]: 'Согласован',
            [DocumentStatus.REJECTED]: 'Отклонен',
            [DocumentStatus.IN_PROGRESS]: 'В работе',
            [DocumentStatus.COMPLETED]: 'Исполнен',
            [DocumentStatus.ARCHIVED]: 'В архиве',
        };
        return statusText[status];
    };

    // Обработчик для действий над документом
    const handleDocumentAction = (action: string) => {
        setActionType(action);
        setIsModalVisible(true);
    };

    // Выполнение действия
    const executeAction = async () => {
        try {
            switch (actionType) {
                case 'approve':
                    await DocumentsService.approveDocument(document.id, commentText);
                    message.success("Документ успешно согласован");
                    break;
                case 'reject':
                    await DocumentsService.rejectDocument(document.id, commentText);
                    message.success("Документ отклонен");
                    break;
                case 'sendForApproval':
                    await DocumentsService.sendForApproval(document.id, selectedUserIds, commentText);
                    message.success("Документ отправлен на согласование");
                    break;
                case 'sendForExecution':
                    await DocumentsService.sendForExecution(document.id, selectedUserIds, commentText);
                    message.success("Документ отправлен на исполнение");
                    break;
                case 'complete':
                    await DocumentsService.completeDocument(document.id, commentText);
                    message.success("Исполнение документа завершено");
                    break;
                case 'archive':
                    await DocumentsService.archiveDocument(document.id, commentText);
                    message.success("Документ отправлен в архив");
                    break;
                default:
                    break;
            }

            setIsModalVisible(false);
            // Обновление страницы для отображения изменений
            router.refresh();

        } catch (error: any) {

            console.error("Ошибка при выполнении действия:", error.response?.data);
            message.error(`Произошла ошибка при выполнении действия: ${error.response?.data.message}`);

        }
    };
    console.log(history)
    return (
        <div className="mt-8">
            <Card title="Информация о документе" className="mb-6">
                <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="ID">{document.id}</Descriptions.Item>
                    <Descriptions.Item label="Номер документа">{document.docNumber || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Имя файла">{document.filename}</Descriptions.Item>
                    <Descriptions.Item label="Статус">{getStatusText(document.status)}</Descriptions.Item>
                    {document.deadline && (
                        <Descriptions.Item label="Срок">
                            {new Date(document.deadline).toLocaleDateString()}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Описание">{document.description || '-'}</Descriptions.Item>
                </Descriptions>

                <div className="mt-4 flex gap-3 flex-wrap">
                    <Button
                        type="primary"
                        onClick={() => DocumentsService.downloadDocument(document.path, document.filename)}
                    >
                        Скачать документ
                    </Button>

                    {document.status === DocumentStatus.DRAFT && (
                        <Button
                            type="default"
                            onClick={() => handleDocumentAction('sendForApproval')}
                        >
                            Отправить на согласование
                        </Button>
                    )}

                    {document.status === DocumentStatus.ON_APPROVAL && (
                        <>
                            <Button
                                type="primary"
                                onClick={() => handleDocumentAction('approve')}
                            >
                                Согласовать
                            </Button>
                            <Button
                                danger
                                onClick={() => handleDocumentAction('reject')}
                            >
                                Отклонить
                            </Button>
                        </>
                    )}

                    {document.status === DocumentStatus.APPROVED && (
                        <Button
                            type="default"
                            onClick={() => handleDocumentAction('sendForExecution')}
                        >
                            Отправить на исполнение
                        </Button>
                    )}

                    {document.status === DocumentStatus.IN_PROGRESS && (
                        <Button
                            type="primary"
                            onClick={() => handleDocumentAction('complete')}
                        >
                            Завершить исполнение
                        </Button>
                    )}

                    {document.status === DocumentStatus.COMPLETED && (
                        <Button
                            type="default"
                            onClick={() => handleDocumentAction('archive')}
                        >
                            Отправить в архив
                        </Button>
                    )}
                </div>
            </Card>

            <Tabs defaultActiveKey="history" items={[{
                key: "history",
                label: "История документа",
                children: <Timeline
                    items={history.map((item, index) => ({
                        children: (
                            <div key={index}>
                                <p><strong>Действие:</strong> {item.action}</p>
                                <p><strong>Пользователь:</strong> {item.user.username}</p>
                                <p><strong>Дата:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                                {item.comment && (
                                    <p><strong>Комментарий:</strong> {item.comment}</p>
                                )}
                            </div>
                        )
                    }))}
                />
            }]} type="card">
            </Tabs>

            <Modal
                title={(() => {
                    switch (actionType) {
                        case 'approve': return "Согласование документа";
                        case 'reject': return "Отклонение документа";
                        case 'sendForApproval': return "Отправка на согласование";
                        case 'sendForExecution': return "Отправка на исполнение";
                        case 'complete': return "Завершение исполнения";
                        case 'archive': return "Отправка в архив";
                        default: return "Действие";
                    }
                })()}
                open={isModalVisible}
                onOk={executeAction}
                onCancel={() => setIsModalVisible(false)}
            >
                {(actionType === 'sendForApproval' || actionType === 'sendForExecution') && (
                    <div className="mb-4">
                        <p className="mb-2">Выберите пользователей:</p>
                        <UserSelector
                            value={selectedUserIds}
                            onChange={(value) => setSelectedUserIds(value)}
                        />
                    </div>
                )}

                <div className="mt-4">
                    <TextArea
                        rows={4}
                        placeholder="Введите комментарий"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
} 