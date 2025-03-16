import { cookies } from "next/headers";
import { securedApi } from "../ui/api/axios";
import { UsersTableUi } from "../ui/pages/UsersTableUi";
import { redirect } from "next/navigation";


export default async function UsersPage() {
    const cookie = await cookies();
    const users = await securedApi(cookie.get("token")?.value).get("users").catch((err) => {
        redirect('/')
    })
    return (<main className="container mx-auto">
        <p className="text-xl text-center font-bold">Пользователи</p>
        <UsersTableUi users={users.data} />
    </main>)
}