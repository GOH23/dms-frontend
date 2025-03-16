"use client"

import { Avatar, Badge, Button, Menu, Popover } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { UserOutlined, EditFilled, HomeOutlined } from "@ant-design/icons"
import { useAuth } from "./context/authContext";
import { useRouter, usePathname } from "next/navigation";
export function MenuLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { user,logOut,loading } = useAuth()
    const { push } = useRouter()
    const path = usePathname()
    const getKey = () => {
        switch (path) {
            case "/users":
                return "/users"
            case "/users/create":
                return "/users/create"
            case "/documents":
                return "/documents"
            case "/documents/create":
                return "/documents/create"
            case "/documents/user":
                return "/documents/user"
            default:
                return "/";
        }
    }
    if (!user ) {
        return
    }
    return (<Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        {user && <div className="text-white flex justify-center items-center flex-wrap gap-1.5 font-bold">
            <Popover placement="rightTop" title="Данные о пользователе" content={<div>
                <p>ник: {user.username}</p>
                <Button danger className="w-full" size="small" type="primary" onClick={()=>{
                    if(logOut) logOut();
                }}>
                    Выйти
                </Button>
                
            </div>}>
                <Avatar style={{ backgroundColor: "#f56a00" }} size="large">
                    {user.username[0].toUpperCase()}
                </Avatar>
            </Popover>
        </div>}
        <Menu theme="dark" onClick={(el) => {
            push(el.key)
        }} defaultSelectedKeys={[getKey()]} mode="inline" items={user.role == "admin" ? [
            { label: "Главная", icon: <HomeOutlined />, key: "/" },
            {
                label: "Meню документов", icon: <EditFilled />, key: "doc_menu", type: "submenu",
                children: [
                    { label: "Добавить документ", key: "/documents/create" },
                    {
                        label: "Документы", key: "", type: "submenu", children: [
                            { label: "Все документы", key: "/documents" },
                            { label: "Ваши документы", key: "/documents/user" }
                        ]
                    }
                ]
            },
            {
                label: "Меню пользователей", icon: <UserOutlined />, key: "user_menu", type: "submenu",
                children: [
                    { label: "Добавить пользователя", key: "/users/create" },
                    { label: "Все пользователи", key: "/users" }
                ]
            },
        ] : [
            { label: "Главная", icon: <HomeOutlined />, key: "/" },
            {
                label: "Meню документов", icon: <EditFilled />, key: "doc_menu", type: "submenu",
                children: [
                    { label: "Добавить документ", key: "/documents/create" },
                    {
                        label: "Документы", key: "", type: "submenu", children: [
                            { label: "Все документы", key: "/documents" },
                            { label: "Ваши документы", key: "/documents/user" }
                        ]
                    }
                ]
            }
        ]} />
    </Sider>)
}