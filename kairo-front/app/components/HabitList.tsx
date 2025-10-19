import {FlatList, StyleSheet, View} from "react-native";
import HabitListItem from "./HabitListItem";
import AddButton from "@/app/components/shared/AddButton";

const habits = [
    {
        name: "Drink water",
        streak: 10,
        done: true,
    },
    {name: "Do yoga", streak: 10, done: false},
    {name: "Read a book", streak: 2, done: true},
    {name: "Meditate", streak: 0, done: false},
    {name: "Walk outside", streak: 3, done: true},
];

export default function HabitList() {
    return (
        <View style={styles.habitsContainer}>
            <FlatList
                data={habits}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({item}) => (
                    <HabitListItem habit={item}/>
                )}
            />
            <View style={styles.addButton}>
                <AddButton/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    habitsContainer: {
        display: "flex",
        flexDirection: "column",
    },

    addButton: {
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    }
});
