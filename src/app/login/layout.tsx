export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen">
            {children}
        </main>
    );
}