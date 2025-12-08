import {Text, View} from "react-native";
import HabitList from "@/src/components/habit/HabitList";
import {useRouter} from 'expo-router';
import {homeScreenStyles, sharedFonts, sharedStyles} from "@/global";

export default function Home() {
    const router = useRouter();

    return (
        <View style={[sharedStyles.basicContainer, {marginTop: 64}]}>
            <View style={homeScreenStyles.header}>
                <Text style={[sharedFonts.headerText, {marginBottom: 4}]}>Today</Text>
                <Text style={sharedFonts.mediumSubtleText}>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
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

