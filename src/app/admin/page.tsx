import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { UserTable } from '@/components/admin/UserTable';

// Admin Page (Server Component)
export default async function AdminPage() {
    // Service Role Client for Admin access
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch Users from Auth
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
        return (
            <div className="p-4 text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                Error fetching users: {usersError.message}
            </div>
        );
    }

    // 2. Fetch Subscriptions
    const { data: subscriptions, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*');

    // 3. Merge Data
    const usersWithSubs = users.map(u => {
        const sub = subscriptions?.find(s => s.user_id === u.id);
        return {
            id: u.id,
            email: u.email || 'No email',
            created_at: u.created_at,
            subscription: sub ? {
                plan_id: sub.plan_id,
                credits_remaining: sub.credits_remaining,
                credits_total: sub.credits_total,
                status: sub.status
            } : undefined
        };
    });

    // Sort by created most recent
    usersWithSubs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard de Usuarios</h1>
                <p className="text-gray-400">Total Usuarios: <span className="text-white font-mono font-bold">{users.length}</span></p>
            </div>

            <UserTable users={usersWithSubs} />
        </div>
    );
}
