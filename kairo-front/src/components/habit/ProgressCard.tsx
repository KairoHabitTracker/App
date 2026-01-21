import {Text, View} from "react-native";
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

export default function ProgressCard({ habits, completedToday}: any) {
    const styles = useProgressCardStyles();

    const progress = habits.length > 0
        ? Math.round((completedToday.length / habits.length) * 100)
        : 0;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Daily Progress</Text>
                <Text style={styles.percent}>{progress}%</Text>
            </View>
            <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.subtitle}>
                {completedToday.length} of {habits.length} habits completed
            </Text>
        </View>
    )
}

const createProgressCardStyles = (colors: ThemeColors) => ({
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    percent: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.accent,
    },
    progressBackground: {
        height: 8,
        backgroundColor: colors.surface,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: 4,
    },
    subtitle: {
        fontSize: 13,
        color: colors.subtleText,
    },
});

function useProgressCardStyles() {
    return useThemedStyles(createProgressCardStyles);
}



