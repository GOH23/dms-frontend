import { cookies } from "next/headers";
import { securedApi } from "../ui/api/axios";
import { redirect } from "next/navigation";
import { PositionsTableUI } from "./PositionsTableUI";

export default async function PositionsPage() {
    const cookie = await cookies();
    const positions = await securedApi(cookie.get("token")?.value).get("positions").catch((err) => {
        redirect('/login');
    });

    return (
        <main className="container mx-auto">
            <p className="text-xl text-center font-bold">Должности</p>
            <PositionsTableUI positions={positions.data} />
        </main>
    );
} 