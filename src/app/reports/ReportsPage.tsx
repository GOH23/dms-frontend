"use client"

import { useState } from "react";
import { Document, DocumentStatus } from "../ui/types/documents";
import { Table } from "antd";
export function ReportsPage({ documents }: { documents: Document[] }) {
    const [documentsSta, setDocuments] = useState(documents);
    return (<div>
        <Table
            columns={[
                { title: "Id", dataIndex: "id" },
                { title: "Номер документа", dataIndex: "docNumber" },
                { title: "Имя файла", dataIndex: "filename" },
                
            ]}
            scroll={{ x: 'max-content' }}
            dataSource={documentsSta.map((doc, index) => ({
                key: index,
                id: doc.id,
                docNumber: doc.docNumber || '-',
                filename: doc.filename,
                status: doc.status,
                deadline: doc.deadline,

            }))}
        />
    </div>)
}

