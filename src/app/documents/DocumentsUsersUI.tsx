"use client"

import { Button, message, Table } from "antd";
import { useAuth } from "../ui/pages/context/authContext";
import { api } from "../ui/api/axios";
import { useState } from "react";

export type DocumentsType = {
    id: number;
    filename: string;
    path: string;
    mimetype: string;
    uploadedAt: Date;
}
export function DocumentsUsersUI({ documents }: { documents: DocumentsType[] }) {
    const { user } = useAuth()
    const [documentsSta,setDocuments]= useState(documents);
    const reloadDocuments = async ()=>{
        const data = await api.get("documents/all");
        setDocuments(data.data)
    }
    return (<div>
        <Table columns={[
            { title: "Id", dataIndex: "id" },
            { title: "Имя файла", dataIndex: "filename" },
            { title: "Путь", dataIndex: "path" },
            { title: "Действия", dataIndex: "action" }
        ]} scroll={{ x: 'max-content' }} dataSource={[...documentsSta.map((el, ind) => {
            return {
                key: ind,
                id: el.id,
                filename: el.filename,
                path: el.path,
                action: <div className="flex gap-2">
                    {user?.role == "admin" && <Button danger type="primary" onClick={async() => {
                        api.delete(`documents/${el.id}`).then(async (res)=>{
                            message.success("Успешно удален документ пользователя");
                            await reloadDocuments();
                        }).catch((er)=>{
                            message.error("Ошибка удаления документа")
                        })
                    }}>
                        Удалить
                    </Button>}
                    <Button type="primary" onClick={() => {
                        api.get(`documents/${el.path}`, {
                            responseType: "blob"
                        }).then((responce) => {
                            console.log(responce.data)
                            const href = URL.createObjectURL(responce.data);
                            const link = document.createElement('a');
                            link.href = href;
                            link.setAttribute('download', el.filename);
                            document.body.appendChild(link);
                            link.click();

                            document.body.removeChild(link);
                            URL.revokeObjectURL(href);
                        })
                    }}>
                        Загрузить
                    </Button>

                </div>
            }
        })]}>

        </Table>
    </div>)
}