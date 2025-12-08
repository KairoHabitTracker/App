import React, {createContext, useContext, useEffect, useState} from 'react';
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
    const fetchUserHabits = async () => {
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE}/api/habits/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const json = await res.json();
            setUserHabits(Array.isArray(json.data) ? json.data : []);
        } catch (err) {
            console.error('Error fetching user habits list:', err);
            setUserHabits([]);
        }
    };

    // --- POBIERANIE predefined NAWYKÓW ---
    const fetchHabits = async () => {
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

            const json = await response.json();
            const data = json.data;
            setHabits(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error fetching habits:', err);
            setError(err.message || 'Failed to load habits');
            setHabits([]);
        } finally {
            setLoading(false);
        }
    };


    // --- ŁADUJĄCE DANE ---
    useEffect(() => {
        if (token) {
            fetchHabits();
            fetchUserHabits();
        }
    }, [token]);

    const refreshHabits = async () => {
        await fetchHabits();
        await fetchUserHabits();
    };

    const getHabitById = (id: string | number) => {
        return habits.find(h => h.id === Number(id));
    };

    const getUserHabitById = (userHabitId: string | number) => {
        return userHabits.find(uh => uh.id === Number(userHabitId));
    };

    return (
        <HabitsContext.Provider
            value={{
                habits,
                loading,
                error,
                refreshHabits,
                getHabitById,
                userHabits,
                fetchUserHabits,
                getUserHabitById
            }}
        >
            {children}
        </HabitsContext.Provider>
    );
}

export function useHabits() {
    return useContext(HabitsContext);
}