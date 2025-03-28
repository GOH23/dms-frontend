import { CreateDepartmentForm } from "@/app/ui/forms/createDepartmentForm";

export default async function DepartmentCreatePage() {
    return (
        <main className="container mx-auto">
            <p className="text-xl text-left font-bold">Добавить новый отдел</p>
            <CreateDepartmentForm />
        </main>
    );
} 