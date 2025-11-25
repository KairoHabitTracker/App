import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from './AuthContext';
import {API_BASE} from '@/src/lib/api';
import {Habit} from '@/src/types/Habit';
import {HabitsContextType} from "@/src/types/habitContextType";


const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userHabits, setUserHabits] = useState(null);

        const fetchUser = async () => {
            if (!token) return;

            const res = await fetch(`${API_BASE}/api/habits/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const json = await res.json();
            setUserHabits(json.data);
        };



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

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

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

    useEffect(() => {
        if (token) {
            fetchHabits();
        }
    }, [token]);

useEffect(() => {
    if (token) {
        fetchUser();
    }
}, [token]);

    const refreshHabits = async () => {
        await fetchHabits();
    };

    const getHabitById = (id: string | number) => {
        return habits.find(h => h.id === Number(id));
    };

    return (
        <HabitsContext.Provider value={{ habits, loading, error, refreshHabits, getHabitById, userHabits }}>
            {children}
        </HabitsContext.Provider>
    );
}

export function useHabits() {
    const context = useContext(HabitsContext);
    if (context === undefined) {
        throw new Error('useHabits must be used within a HabitsProvider');
    }
    return context;
}