import { cookies } from "next/headers";
import { securedApi } from "../ui/api/axios";
import { redirect } from "next/navigation";
import { ReportsPage } from "./ReportsPage";

export default async function PositionsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const cookie = await cookies();
    const params = (await searchParams)

    const documents = await securedApi(cookie.get("token")?.value).get(`documents/rep?type=${params.type}${(params.status as any[]).map(el=>`&status=${el}`)}`).catch((err) => {

        redirect('/login');
    });

    return (
        <main className="container mx-auto">
            <p className="text-xl text-center font-bold">Отчет</p>
            <ReportsPage documents={documents.data}/>
        </main>
    );
} 