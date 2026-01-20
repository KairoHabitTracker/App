import {StyleSheet, Text, View} from "react-native";
import HabitList from "@/src/components/habit/HabitList";
import {useRouter} from 'expo-router';
import {sharedFonts, sharedStyles} from "@/global";
import {useAuth} from "@/src/contexts/AuthContext";
import {Flame} from "@tamagui/lucide-icons";

export default function Home() {
    const router = useRouter();
    const {user, refreshProfile} = useAuth();

    return (
        <View style={[sharedStyles.basicContainer, {paddingTop: 64}]}>
            <View style={localStyles.headerRow}>
                <View>
                    <Text style={[sharedFonts.headerText, {marginBottom: 4}]}>Today</Text>
                    <Text style={sharedFonts.mediumSubtleText}>
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                </View>

                <View style={localStyles.streakBadge}>
                    <Flame size={18} color="#F59E0B" fill="#F59E0B"/>
                    <Text style={localStyles.streakText}>
                        {user?.streak ?? 0}
                    </Text>
                </View>
            </View>
            <HabitList onAdd={() => router.push('/habit/add')}
                       onEditHabit={(userHabitId: number) => {
                           console.log(userHabitId);
                           router.push(`/habit/edit/${userHabitId}`)
                       }
                       }/>
        </View>
    );
}

const localStyles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFEDD5',
        gap: 4,
    },
    streakText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#B45309',
    }
});
