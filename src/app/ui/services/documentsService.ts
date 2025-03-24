import { api, securedApi } from "../api/axios";
import { Document, DocumentApproval, DocumentHistory } from "../types/documents";
import Cookies from 'js-cookie';

export const DocumentsService = {
  // Получение всех документов
  getAllDocuments: async (): Promise<Document[]> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).get('/documents/all');
    return response.data;
  },

  // Получение документов пользователя
  getUserDocuments: async (): Promise<Document[]> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).get('/documents');
    return response.data;
  },

  // Получение документа по id
  getDocumentById: async (id: number): Promise<Document> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).get(`/documents/${id}`);
    return response.data;
  },

  // Получение истории документа
  getDocumentHistory: async (id: number): Promise<DocumentHistory[]> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).get(`/documents/${id}/history`);
    return response.data;
  },

  // Создание документа
  createDocument: async (formData: FormData): Promise<Document> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Отправка на согласование
  sendForApproval: async (docId: number, approverIds: number[], comment?: string): Promise<Document> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).post(`/documents/${docId}/approval-request`, { 
      approverIds,
      comment 
    });
    return response.data;
  },

  // Согласование документа
  approveDocument: async (docId: number, comment?: string): Promise<Document> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).post(`/documents/${docId}/approve`, { comment });
    return response.data;
  },

  // Отклонение документа
  rejectDocument: async (docId: number, comment?: string): Promise<Document> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).post(`/documents/${docId}/reject`, { comment });
    return response.data;
  },

  // Отправка на исполнение
  sendForExecution: async (docId: number, executorIds: number[], comment?: string): Promise<Document> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).post(`/documents/${docId}/execution-request`, { 
      executorIds,
      comment 
    });
    return response.data;
  },

  // Завершение исполнения
  completeDocument: async (docId: number, comment?: string): Promise<Document> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).post(`/documents/${docId}/complete`, { comment });
    return response.data;
  },

  // Архивация документа
  archiveDocument: async (docId: number, comment?: string): Promise<Document> => {
    const token = Cookies.get('token');
    const response = await securedApi(token).post(`/documents/${docId}/archive`, { comment });
    return response.data;
  },

  // Скачивание документа
  downloadDocument: async (path: string, filename: string): Promise<void> => {
    const token = Cookies.get('token');
    const response = await securedApi(token, "blob").get(`documents/${path}`);
    
    const href = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }
}; 