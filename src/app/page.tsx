import { Card, Skeleton, Row, Col, Statistic, Divider, Typography, Alert, Space, Progress } from "antd";
import { securedApi } from "./ui/api/axios";

import { cookies } from 'next/headers';
import { 
  CopyOutlined, 
  UserOutlined, 
  FileOutlined, 
  CalendarOutlined, 
  InfoCircleOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Paragraph from "antd/es/typography/Paragraph";


export default async function Home() {
  const cookie = await cookies();
  const posts = await securedApi(cookie.get("token")?.value).get("documents").catch(() => {
    redirect("/login")
  })
  const users = await securedApi(cookie.get("token")?.value).get("users").then(res => res.data).catch(err => console.log(err));
  
  // Заглушки данных, которые будут заменены на реальные данные в будущем
  const recentActivity = [
    { id: 1, action: "Добавлен новый документ", time: "2 часа назад" },
    { id: 2, action: "Обновлен пользователь", time: "5 часов назад" },
    { id: 3, action: "Проверка документа завершена", time: "1 день назад" },
  ];
  
  const systemInfo = {
    version: "1.0.0",
    lastUpdate: "24.03.2025",
    status: "Активна"
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-center mb-6">Система управления документами</h2>
      
      <Alert 
        message="Добро пожаловать в систему управления документами!" 
        description="Здесь вы можете управлять документами, просматривать информацию о пользователях и мониторить активность в системе."
        type="info" 
        showIcon 
        icon={<InfoCircleOutlined />}
        className="mb-6"
      />
      
      <Divider orientation="left">Обзор системы</Divider>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Suspense fallback={<Skeleton />}>
            <Link href="/documents">
              <Card hoverable className="h-full">
                <Statistic 
                  title="Ваши документы" 
                  value={(posts.data as any[]).length} 
                  prefix={<FileOutlined />} 
                  valueStyle={{ color: '#3f8600' }}
                />
                <p className="mt-2">Перейти к управлению документами</p>
              </Card>
            </Link>
          </Suspense>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Suspense fallback={<Skeleton />}>
            <Link href="/users">
              <Card hoverable className="h-full">
                <Statistic 
                  title="Пользователи системы" 
                  value={users?.length || 0} 
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <p className="mt-2">Управление пользователями системы</p>
              </Card>
            </Link>
          </Suspense>
        </Col>
        
        {/* <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="h-full">
            <Statistic 
              title="Активные процессы" 
              value={5} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <p className="mt-2">Текущие активные процессы в системе</p>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="h-full">
            <Statistic 
              title="Выполненные задачи" 
              value={12} 
              prefix={<CheckCircleFilled />}
              valueStyle={{ color: '#52c41a' }}
            />
            <p className="mt-2">Задачи, выполненные за последнюю неделю</p>
          </Card>
        </Col> */}
      </Row>
      
      <Divider orientation="left">Активность</Divider>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={16}>
          <Card title={<><CalendarOutlined /> Последние действия</>} className="h-full">
            {recentActivity.map(activity => (
              <div key={activity.id} className="py-2 border-b last:border-b-0">
                <div className="flex justify-between">
                  <p>{activity.action}</p>
                  <p>{activity.time}</p>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <Link href="/activity">
                <p className="text-secondary">Посмотреть всю активность →</p>
              </Link>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title={<><DashboardOutlined /> Статистика</>} className="h-full">
            <Space direction="vertical" className="w-full">
              <div>
                <p>Загрузка системы</p>
                <Progress percent={65} status="active" />
              </div>
              <div>
                <p>Свободное место</p>
                <Progress percent={42} status="active" />
              </div>
              <div>
                <p>Использование API</p>
                <Progress percent={89} status="active" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Информация</Divider>
      
      <Card title={<><InfoCircleOutlined /> О системе</>}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic title="Версия" value={systemInfo.version} />
          </Col>
          <Col span={8}>
            <Statistic title="Последнее обновление" value={systemInfo.lastUpdate} />
          </Col>
          <Col span={8}>
            <Statistic title="Статус" value={systemInfo.status} valueStyle={{ color: '#52c41a' }} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
