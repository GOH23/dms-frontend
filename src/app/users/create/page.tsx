import { CreateUserForm } from "@/app/ui/forms/createUserForm";

export default async function UsersСreatePage() {

    return (<main className="container mx-auto">
        <p className="text-xl text-left font-bold">Добавить нового пользователя</p>
        <CreateUserForm/>
    </main>)
}