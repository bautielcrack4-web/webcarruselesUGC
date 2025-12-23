import { supabase } from './supabase';

export const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = '/';
    }
    return { error };
};

export const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};
