import {Text, View} from "react-native";
import HabitList from "@/src/components/habit/HabitList";
import {useRouter} from 'expo-router';
import {homeScreenStyles, sharedFonts, sharedStyles} from "@/global";
import {useAuth} from "@/src/contexts/AuthContext";
import {Flame} from "@tamagui/lucide-icons";

export default function Home() {
    const router = useRouter();
    const {user, refreshProfile} = useAuth();

    return (
        <View style={[sharedStyles.basicContainer, {marginTop: 64}]}>
            <View style={homeScreenStyles.header}>
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

                <View style={homeScreenStyles.streakContainer}>
                    <Flame size={24} color="#F59E0B" fill="#F59E0B"/>
                    <Text style={homeScreenStyles.streakText}>
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
