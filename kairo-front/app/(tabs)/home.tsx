import {StyleSheet, View} from "react-native";
import HabitList from "@/app/components/HabitList";
import DailyWeeklyFilter from "@/app/components/DailyWeeklyFilter";
import TimeDayFilter from "@/app/components/TimeDayFilter";
import {useRouter} from 'expo-router';

export default function Home() {
    const router = useRouter();


    return (
        <View style={styles.container}>
            <View style={styles.filters}>
                <DailyWeeklyFilter/>
                <TimeDayFilter/>
            </View>

            <HabitList onAdd={() => router.push('/add-habit')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: 'white'
        // backgroundColor: "#F5EFE6"
    },
    filters: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
});