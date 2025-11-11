// File: `app/habit/[id].tsx`
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {useAuth} from '@/src/contexts/AuthContext';

export default function HabitDetail() {
    const {id} = useLocalSearchParams() as { id?: string };
    const {token} = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || !token) return;
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`api/dla/jednego/habita/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const json = await res.json();
                const payload = json.data;
                setData(payload ?? null);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, token]);

    return (
        <ScrollView>
            {loading && <ActivityIndicator size="large"/>}
            {error && <Text style={styles.error}>{error}</Text>}
            {!loading && data && (
                <View>
                    {/*<Text>Notification time: {data.notification_time ?? '—'}</Text>*/}
                    {/*<Text>Days: {Array.isArray(data.days_of_week) ? data.days_of_week.filter(Boolean).join(', ') || '—' : '—'}</Text>*/}
                    {/*<Text>Start: {data.start_date ?? '—'}</Text>*/}
                    {/*<Text>End: {data.end_date ?? '—'}</Text>*/}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    error: {color: 'red', marginTop: 8},
});