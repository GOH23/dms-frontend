import { cookies } from "next/headers";
import { securedApi } from "../../ui/api/axios";
import { redirect } from "next/navigation";
import { DocumentDetail } from "./DocumentDetail";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookie = await cookies();

    try {
        // Получаем информацию о документе
        const document = await securedApi(cookie.get("token")?.value).get(`/documents/${id}`);

        // Получаем историю документа
        const history = await securedApi(cookie.get("token")?.value).get(`/documents/${id}/history`).catch(() => ({ data: [] }));

        return (
            <main className="container mx-auto">
                <p className="text-xl text-center font-bold">Детали документа</p>
                <DocumentDetail document={document.data} history={history.data} />
            </main>
        );
    } catch (error) {
        console.error("Ошибка загрузки документа:", error);
        redirect('/documents');
    }
} 