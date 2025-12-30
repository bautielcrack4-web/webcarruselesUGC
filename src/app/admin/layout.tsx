import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const ADMIN_EMAILS = [
    "support@adfork.app",
    "bautimoran86@gmail.com"
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        console.log(`Unauthorized admin access attempt by: ${user?.email}`);
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Admin Nav */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl tracking-tight">
                        Adfork <span className="text-purple-400">Admin</span>
                    </div>
                    <div className="text-sm text-gray-400">
                        {user.email}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
