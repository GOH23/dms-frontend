import { CreateDocumentForm } from "@/app/ui/forms/createDocumentForm";
import { cookies } from "next/headers";

export default async function CreateDocPage() {
    return (<main className="container mx-auto">
        <p className="text-xl text-center font-bold">Добавление документа</p>
        <div className="flex justify-center">
            <CreateDocumentForm />
        </div>
    </main>)
}