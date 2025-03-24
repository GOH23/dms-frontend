// Статусы документа
export enum DocumentStatus {
  DRAFT = 'draft',
  ON_APPROVAL = 'on_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

// Модель документа с поддержкой жизненного цикла
export interface Document {
  id: number;
  filename: string;
  path: string;
  mimetype?: string;
  uploadedAt?: Date;
  docNumber?: string;
  description?: string;
  status: DocumentStatus;
  deadline?: Date;
  createdBy?: number;
}

// Модель для истории документа
export interface DocumentHistory {
  id: number;
  documentId: number;
  action: string;
  createdAt: Date;
  user: { username: string }
  comment?: string;
}

// Модель для процесса согласования
export interface DocumentApproval {
  id: number;
  documentId: number;
  approverId: number;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  createdAt: Date;
  updatedAt?: Date;
} 