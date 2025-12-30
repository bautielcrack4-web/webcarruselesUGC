'use client';

import { useState } from 'react';
import { manageCredits } from '../../app/admin/actions';
import { Loader2, Plus, Minus } from 'lucide-react';

interface AddCreditsModalProps {
    userId: string;
    email: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddCreditsModal({ userId, email, onClose, onSuccess }: AddCreditsModalProps) {
    const [amount, setAmount] = useState<number>(10);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await manageCredits(userId, amount, reason);
        setLoading(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold mb-2">Gestionar Créditos</h3>
                <p className="text-gray-400 text-sm mb-6">Usuario: {email}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Cantidad (+/-)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Usa números negativos para restar.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Razón (Interna)</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ej: Compensación por error de red..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
                            required
                        />
                    </div>

                    <div className="flex gap-3 mt-6 pt-2 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
