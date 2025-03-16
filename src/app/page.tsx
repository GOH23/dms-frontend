import { Card, Skeleton } from "antd";
import { securedApi } from "./ui/api/axios";

import { cookies } from 'next/headers';
import { CopyOutlined } from "@ant-design/icons";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function Home() {

  const cookie = await cookies();
  const posts = await securedApi(cookie.get("token")?.value).get("documents").catch(() => {
    redirect("/login")
  })
  const users = await securedApi(cookie.get("token")?.value).get("users").then(res => res.data).catch(err => console.log(err));
  return (<div className="container mx-auto">
    <p className="text-xl text-center font-bold">Главная</p>
    <div className="flex flex-wrap gap-2 justify-around">
      <Suspense fallback={<Skeleton />}>
        <Card className="min-w-[300px]" title="Документы" hoverable variant="borderless">
          <CopyOutlined /> Кол-во ваших документов: {(posts.data as any[]).length}
        </Card>
      </Suspense>
      {/* {users.data && <Suspense fallback={<Skeleton />}>
        <Link href={"/users"} >
          <Card className="min-w-[300px]" title="Пользователи" hoverable variant="borderless">
            <UserOutlined /> Кол-во пользователей: {(users.data as any[]).length}
          </Card>
        </Link>
      </Suspense>} */}
    </div>
  </div>);


}
