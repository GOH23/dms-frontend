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
  DashboardOutlined,
  TeamOutlined,
  ApartmentOutlined
} from "@ant-design/icons";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Paragraph from "antd/es/typography/Paragraph";


export default async function Home() {
  const cookie = await cookies();
  const posts = await securedApi(cookie.get("token")?.value).get("documents").catch(() => {
    redirect("/login")
  });
  const users = await securedApi(cookie.get("token")?.value).get("users").then(res => res.data).catch(err => console.log(err));
  const departments = await securedApi(cookie.get("token")?.value).get("departments").then(res => res.data).catch(err => console.log(err)) || [];
  const positions = await securedApi(cookie.get("token")?.value).get("positions").then(res => res.data).catch(err => console.log(err)) || [];

  const systemInfo = {
    version: "1.0.1",
    lastUpdate: "27.04.2025",
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

        <Col xs={24} sm={12} md={8} lg={6}>
          <Suspense fallback={<Skeleton />}>
            <Link href="/departments">
              <Card hoverable className="h-full">
                <Statistic
                  title="Отделы"
                  value={departments?.length || 0}
                  prefix={<ApartmentOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
                <p className="mt-2">Управление отделами организации</p>
              </Card>
            </Link>
          </Suspense>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Suspense fallback={<Skeleton />}>
            <Link href="/positions">
              <Card hoverable className="h-full">
                <Statistic
                  title="Должности"
                  value={positions?.length || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#eb2f96' }}
                />
                <p className="mt-2">Управление должностями сотрудников</p>
              </Card>
            </Link>
          </Suspense>
        </Col>
      </Row>
      <Divider orientation="left">Отчеты</Divider>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Suspense fallback={<Skeleton />}>
            <Link href={{
              pathname: '/reports',
              query: { status: ["Accepted", "Rejected"], type: "All" },
            }}>
              <Card title="Общий по всем: исполненные и не исполненные" hoverable className="h-full">
                <p className="mt-2">Перейти к отчету</p>
              </Card>
            </Link>
          </Suspense>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Suspense fallback={<Skeleton />}>
            <Link href={{
              pathname: '/reports',
              query: { status: ["Accepted", "Rejected"], type: "User" },
            }}>
              <Card title="Персональный: исполненные и не исполненные" hoverable className="h-full">
                <p className="mt-2">Перейти к отчету</p>
              </Card>
            </Link>
          </Suspense>
        </Col>

      </Row>

      <Divider orientation="left">Организационная структура</Divider>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title={<><ApartmentOutlined /> Отделы</>} className="h-full">
            {departments && departments.length > 0 ? (
              <div>
                {departments.slice(0, 5).map((dept: any, index: number) => (
                  <div key={index} className="py-2 border-b last:border-b-0">
                    <div className="flex justify-between">
                      <p className="font-semibold">{dept.name}</p>
                      {dept.description && <p className="text-gray-500">{dept.description}</p>}
                    </div>
                  </div>
                ))}
                {departments.length > 5 && (
                  <div className="mt-4">
                    <Link href="/departments">
                      <p className="text-secondary">Просмотреть все отделы →</p>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <p>Отделы пока не добавлены</p>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={<><TeamOutlined /> Должности</>} className="h-full">
            {positions && positions.length > 0 ? (
              <div>
                {positions.slice(0, 5).map((pos: any, index: number) => (
                  <div key={index} className="py-2 border-b last:border-b-0">
                    <div className="flex justify-between">
                      <p className="font-semibold">{pos.name}</p>
                      {pos.description && <p className="text-gray-500">{pos.description}</p>}
                    </div>
                  </div>
                ))}
                {positions.length > 5 && (
                  <div className="mt-4">
                    <Link href="/positions">
                      <p className="text-secondary">Просмотреть все должности →</p>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <p>Должности пока не добавлены</p>
            )}
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
