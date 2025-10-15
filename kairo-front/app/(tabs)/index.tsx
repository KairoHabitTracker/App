import { View, StyleSheet } from "react-native";
import Calendar from "../components/Calendar";
import HabitList from "../components/HabitList";

export default function Index() {
    return (
        <View style={styles.container}>
            <Calendar />
            <HabitList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: "#fff" },
});