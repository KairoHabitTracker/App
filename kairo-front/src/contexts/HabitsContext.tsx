import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {useAuth} from './AuthContext';
import {API_BASE} from '@/src/lib/api';
import {Habit} from '@/src/types/Habit';
import {UserHabit} from '@/src/types/UserHabit';
import {HabitsContextType} from "@/src/types/habitContextType";


const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({children}: { children: React.ReactNode }) {
    const {token} = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]); // Katalog
    const [userHabits, setUserHabits] = useState<UserHabit[]>([]); // Lista nawyków użytkownika
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // --- POBIERANIE LISTY NAWYKÓW UŻYTKOWNIKA (Dla HabitList) ---
    // zmiana na usecallback aby zapobiec niepotrzebnemu tworzeniu funkcji w każdym renderze
    const fetchUserHabits = useCallback(async () => {
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE}/api/habits/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`Błąd API: ${res.status}`);

            const json = await res.json();
            setUserHabits(Array.isArray(json.data) ? json.data : []);
        } catch (err: any) {
            console.error('Error fetching user habits list:', err);
            setError(err.message || 'Nie udało się załadować nawyków użytkownika');
            setUserHabits([]);
        }
    }, [token]);

    // --- POBIERANIE predefined NAWYKÓW ---
    const fetchHabits = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/habits`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`Błąd API: ${response.status}`);

            const json = await response.json();
            const data = json.data;
            setHabits(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error fetching habits:', err);
            setError(err.message || 'Failed to load habits catalog');
            setHabits([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const completeHabit = useCallback(async (habitId: number) => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE}/api/habits/user/${habitId}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                await fetchUserHabits();
            } else {
                console.error(`Error completing habit: ${response.status}`);
            }
        } catch (error) {
            console.error('error while marking as completed:', error);
        }
    }, [token, fetchUserHabits]);


    const uncompleteHabit = useCallback(async (habitId: number) => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE}/api/habits/user/${habitId}/uncomplete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                await fetchUserHabits();
            } else {
                console.error(`Error uncompleting habit: ${response.status}`);
            }
        } catch (error) {
            console.error('Error while uncompleting habit:', error);
        }
    }, [token, fetchUserHabits]);


    const refreshHabits = useCallback(async () => {
        await Promise.all([fetchHabits(), fetchUserHabits()]);
    }, [fetchHabits, fetchUserHabits]);

    const addHabit = useCallback(async (payload: any) => {
        if (!token) throw new Error('User not authenticated.');

        const response = await fetch(`${API_BASE}/api/habits/user`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({message: `Server error: ${response.status}`}));
            throw new Error(errorData.message || `API error with status: ${response.status}`);
        }
        await refreshHabits();
    }, [token, refreshHabits]);


    const editHabit = useCallback(async (userHabitId: string, payload: any) => {
        if (!token) throw new Error('User not authenticated.');

        const response = await fetch(`${API_BASE}/api/habits/user/${userHabitId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({message: `Server error: ${response.status}`}));
            throw new Error(errorData.message || `API error with status: ${response.status}`);
        }
        await refreshHabits();
    }, [token, refreshHabits]);

    // --- ŁADOWANIE POCZĄTKOWE ---
    useEffect(() => {
        if (token) {
            refreshHabits();
        }
    }, [token, refreshHabits]);


    const getHabitById = useCallback((id: string | number) => {
        return habits.find(h => h.id === Number(id));
    }, [habits]);

    const getUserHabitById = useCallback((userHabitId: string | number) => {
        return userHabits.find(uh => uh.id === Number(userHabitId));
    }, [userHabits]);


    const contextValue: HabitsContextType = {
        habits,
        loading,
        error,
        refreshHabits,
        getHabitById,
        userHabits,
        fetchUserHabits,
        getUserHabitById,
        completeHabit,
        uncompleteHabit,
        addHabit,
        editHabit
        // isRefreshing: false,
    };

    return (
        <HabitsContext.Provider value={contextValue}>
            {children}
        </HabitsContext.Provider>
    );
}

export function useHabits() {
    const context = useContext(HabitsContext);
    if (context === undefined) {
        throw new Error('useHabits musi być użyte wewnątrz HabitsProvider');
    }
    return context;
}