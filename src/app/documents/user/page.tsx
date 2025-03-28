import { cookies } from "next/headers";
import { securedApi } from "../../ui/api/axios";
import { DocumentsUsersUI } from "./../DocumentsUsersUI";
import { redirect } from "next/navigation";
export default async function UsersPage() {
    const cookie = await cookies();
    const documents = await securedApi(cookie.get("token")?.value).get("documents").catch((err) => {
        redirect('/login')
    })
    return (<main className="container mx-auto">
        <p className="text-xl text-center font-bold">Документы пользователей</p>
        <DocumentsUsersUI documents={documents.data} />
    </main>)
}