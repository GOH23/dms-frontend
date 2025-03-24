"use client"

import { Button, Modal, Tag, message, Tooltip, Table, Input } from "antd";
import { useAuth } from "../ui/pages/context/authContext";
import { useState } from "react";
import { Document, DocumentStatus } from "../ui/types/documents";
import { DocumentsService } from "../ui/services/documentsService";
import { api } from "../ui/api/axios";
import { UserSelector } from "../ui/components/UserSelector";

const { TextArea } = Input;

export function DocumentsUsersUI({ documents }: { documents: Document[] }) {
    const { user } = useAuth();
    const [documentsSta, setDocuments] = useState(documents);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [commentText, setCommentText] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [actionType, setActionType] = useState<string>("");
    
    const reloadDocuments = async () => {
        try {
            const data = await DocumentsService.getUserDocuments();
            setDocuments(data);
        } catch (error) {
            message.error("Ошибка при загрузке документов");
        }
    };

    // Функция для получения цвета тега в зависимости от статуса
    const getStatusTagColor = (status: DocumentStatus) => {
        const statusColors = {
            [DocumentStatus.DRAFT]: 'default',
            [DocumentStatus.ON_APPROVAL]: 'processing',
            [DocumentStatus.APPROVED]: 'success',
            [DocumentStatus.REJECTED]: 'error',
            [DocumentStatus.IN_PROGRESS]: 'warning',
            [DocumentStatus.COMPLETED]: 'success',
            [DocumentStatus.ARCHIVED]: 'default',
        };
        return statusColors[status];
    };
    
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
    const handleDocumentAction = async (doc: Document, action: string) => {
        setSelectedDocument(doc);
        setActionType(action);
        setIsModalVisible(true);
    };

    // Выполнение действия
    const executeAction = async () => {
        if (!selectedDocument) return;
        
        try {
            switch (actionType) {
                case 'approve':
                    await DocumentsService.approveDocument(selectedDocument.id, commentText);
                    message.success("Документ успешно согласован");
                    break;
                case 'reject':
                    await DocumentsService.rejectDocument(selectedDocument.id, commentText);
                    message.success("Документ отклонен");
                    break;
                case 'sendForApproval':
                    await DocumentsService.sendForApproval(selectedDocument.id, selectedUserIds, commentText);
                    message.success("Документ отправлен на согласование");
                    break;
                case 'sendForExecution':
                    await DocumentsService.sendForExecution(selectedDocument.id, selectedUserIds, commentText);
                    message.success("Документ отправлен на исполнение");
                    break;
                case 'complete':
                    await DocumentsService.completeDocument(selectedDocument.id, commentText);
                    message.success("Исполнение документа завершено");
                    break;
                case 'archive':
                    await DocumentsService.archiveDocument(selectedDocument.id, commentText);
                    message.success("Документ отправлен в архив");
                    break;
                default:
                    break;
            }
            
            setIsModalVisible(false);
            await reloadDocuments();
            
        } catch (error) {
            console.error("Ошибка при выполнении действия:", error);
            message.error("Произошла ошибка при выполнении действия");
        }
    };

    return (
        <div>
            <Table 
                columns={[
                    { title: "Id", dataIndex: "id" },
                    { title: "Номер документа", dataIndex: "docNumber" },
                    { title: "Имя файла", dataIndex: "filename" },
                    { 
                        title: "Статус", 
                        dataIndex: "status",
                        render: (status) => (
                            <Tag color={getStatusTagColor(status)}>
                                {getStatusText(status)}
                            </Tag>
                        )
                    },
                    { 
                        title: "Срок", 
                        dataIndex: "deadline",
                        render: (deadline) => deadline ? new Date(deadline).toLocaleDateString() : '-'
                    },
                    { title: "Действия", dataIndex: "action" }
                ]} 
                scroll={{ x: 'max-content' }} 
                dataSource={documentsSta.map((doc, index) => ({
                    key: index,
                    id: doc.id,
                    docNumber: doc.docNumber || '-',
                    filename: doc.filename,
                    status: doc.status,
                    deadline: doc.deadline,
                    action: (
                        <div className="flex gap-2 flex-wrap">
                            {user?.role === "admin" && (
                                <Button 
                                    danger 
                                    type="primary" 
                                    onClick={async() => {
                                        try {
                                            await api.delete(`documents/${doc.id}`);
                                            message.success("Успешно удален документ");
                                            await reloadDocuments();
                                        } catch (err) {
                                            message.error("Ошибка удаления документа");
                                        }
                                    }}
                                >
                                    Удалить
                                </Button>
                            )}

                            <Tooltip title="Скачать документ">
                                <Button 
                                    type="primary"
                                    onClick={() => DocumentsService.downloadDocument(doc.path, doc.filename)}
                                >
                                    Загрузить
                                </Button>
                            </Tooltip>

                            {doc.status === DocumentStatus.DRAFT && (
                                <Button 
                                    type="default"
                                    onClick={() => handleDocumentAction(doc, 'sendForApproval')}
                                >
                                    На согласование
                                </Button>
                            )}

                            {doc.status === DocumentStatus.ON_APPROVAL && (
                                <>
                                    <Button 
                                        type="primary"
                                        onClick={() => handleDocumentAction(doc, 'approve')}
                                    >
                                        Согласовать
                                    </Button>
                                    <Button 
                                        danger
                                        onClick={() => handleDocumentAction(doc, 'reject')}
                                    >
                                        Отклонить
                                    </Button>
                                </>
                            )}

                            {doc.status === DocumentStatus.APPROVED && (
                                <Button 
                                    type="default"
                                    onClick={() => handleDocumentAction(doc, 'sendForExecution')}
                                >
                                    На исполнение
                                </Button>
                            )}

                            {doc.status === DocumentStatus.IN_PROGRESS && (
                                <Button 
                                    type="primary"
                                    onClick={() => handleDocumentAction(doc, 'complete')}
                                >
                                    Завершить
                                </Button>
                            )}

                            {doc.status === DocumentStatus.COMPLETED && (
                                <Button 
                                    type="default"
                                    onClick={() => handleDocumentAction(doc, 'archive')}
                                >
                                    В архив
                                </Button>
                            )}

                            <Button 
                                type="link" 
                                href={`/documents/${doc.id}`}
                            >
                                Подробнее
                            </Button>
                        </div>
                    )
                }))}
            />

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