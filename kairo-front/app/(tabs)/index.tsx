import {StyleSheet, View} from "react-native";
import HabitList from "../components/HabitList";
import DailyWeeklyFilter from "@/app/components/DailyWeeklyFilter";
import TimeDayFilter from "@/app/components/TimeDayFilter";

export default function Index() {
    return (
        <View style={styles.container}>
            <DailyWeeklyFilter/>
            <TimeDayFilter/>
            <HabitList/>
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
});