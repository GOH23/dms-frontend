"use client"

import { Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { securedApi } from "../api/axios";
import Cookies from "js-cookie";

interface User {
  id: number;
  username: string;
  role: string;
}

interface UserSelectorProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  maxCount?: number
}

export function UserSelector({ value, onChange, maxCount = Infinity}: UserSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');
        const response = await securedApi(token).get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Select
      mode="multiple"
      placeholder="Выберите пользователей"
      value={value}
      maxCount={maxCount}
      onChange={onChange}
      style={{ width: '100%' }}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : null}
      options={users.map(user => ({
        value: user.id,
        label: `${user.username} (${user.role})`
      }))}
    />
  );
} 