"use client"

import { Button, Modal, Table } from "antd";
import { useState } from "react";
import { api } from "../api/axios";
export type UsersType = {
    id: string,
    username: string,
    role: string,
    documents?: {
        filename: string,
        id: number,
        mimetype: string,
        path: string,
    }[]
}
export function UsersTableUi({ users }: { users: UsersType[] }) {
    const [OnModalOpened, SetOnModalOpened] = useState<{
        documents?: {
            filename: string,
            id: number,
            mimetype: string,
            path: string,
        }[],
        state: boolean
    }>({
        documents: [],
        state: false
    })
    return (<div>
        <Table columns={[
            { title: "Id", dataIndex: "id" },
            { title: "ФИО", dataIndex: "name" },
            { title: "Роль", dataIndex: "role" },
            { title: "Действия", dataIndex: "action" }
        ]} scroll={{ x: 'max-content' }} dataSource={[...users.map((el, ind) => {
            return {
                key: ind,
                id: el.id,
                name: el.username,
                role: el.role,
                action: <div className="flex gap-2">
                    <Button danger type="primary" onClick={() => {

                    }}>
                        Удалить
                    </Button>
                    <Button type="primary" onClick={() => {
                        SetOnModalOpened({
                            documents: el.documents,
                            state: true
                        })
                    }}>
                        Посмотреть
                    </Button>
                </div>
            }
        })]}>
        </Table>
        <Modal title="Документы" open={OnModalOpened.state} onCancel={() => {
            SetOnModalOpened({
                documents: [],
                state: false
            })
        }}>
            {OnModalOpened.documents && OnModalOpened.documents.map((el, ind) => <div
                className="min-h-[40px] my-1 border items-center p-1 border-[#d9d9d9] rounded flex justify-between"
                key={ind}
            >
                <p className="font-bold">
                    {el.filename}
                </p>
                {/* <Button disabled>
                    Просмотреть
                </Button> */}
                <Button onClick={() => {
                    api.get(`documents/${el.path}`,{
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
            </div>)}
        </Modal>
    </div>)
}