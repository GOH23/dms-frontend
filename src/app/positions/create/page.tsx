import { CreatePositionForm } from "@/app/ui/forms/createPositionForm";

export default async function PositionCreatePage() {
    return (
        <main className="container mx-auto">
            <p className="text-xl text-left font-bold">Добавить новую должность</p>
            <CreatePositionForm />
        </main>
    );
} 