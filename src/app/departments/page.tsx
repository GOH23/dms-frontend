import { cookies } from "next/headers";
import { securedApi } from "../ui/api/axios";
import { redirect } from "next/navigation";
import { DepartmentsTableUI } from "./DepartmentsTableUI";

export default async function DepartmentsPage() {
    const cookie = await cookies();
    const departments = await securedApi(cookie.get("token")?.value).get("departments").catch((err) => {
        redirect('/login');
    });

    return (
        <main className="container mx-auto">
            <p className="text-xl text-center font-bold">Отделы</p>
            <DepartmentsTableUI departments={departments.data} />
        </main>
    );
} 