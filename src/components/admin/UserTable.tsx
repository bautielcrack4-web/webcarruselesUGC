'use client';

import { useState } from 'react';
import { Search, MoreHorizontal, BatteryCharging } from 'lucide-react';
import { AddCreditsModal } from './AddCreditsModal';

interface User {
    id: string;
    email: string;
    created_at: string;
    subscription?: {
        plan_id: string;
        credits_remaining: number;
        credits_total: number;
        status: string;
    };
}

export function UserTable({ users }: { users: User[] }) {
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filtered = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.id.includes(search)
    );

    return (
        <div>
            {/* Filters */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por email o ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Usuario</th>
                            <th className="p-4 text-xs uppercase tracking-wider text-gray-400 font-medium">Plan</th>
                            <th className="p-4 text-xs uppercase tracking-wider text-gray-400 font-medium text-right">Créditos</th>
                            <th className="p-4 text-xs uppercase tracking-wider text-gray-400 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.slice(0, 50).map(user => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-white">{user.email ?? 'No Email'}</div>
                                    <div className="text-xs text-gray-500 font-mono mt-1">{user.id}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${user.subscription?.plan_id === 'pro' || user.subscription?.plan_id === 'agency'
                                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                                            : 'bg-gray-800 border-gray-700 text-gray-400'
                                        }`}>
                                        {user.subscription?.plan_id || 'free'}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-mono">
                                    <div className="text-white font-bold text-lg">
                                        {user.subscription?.credits_remaining || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        de {user.subscription?.credits_total || 0} total
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <BatteryCharging size={14} />
                                        Gestionar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No se encontraron usuarios.
                    </div>
                )}
            </div>

            {selectedUser && (
                <AddCreditsModal
                    userId={selectedUser.id}
                    email={selectedUser.email}
                    onClose={() => setSelectedUser(null)}
                    onSuccess={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}
