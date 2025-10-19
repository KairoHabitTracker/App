import {StyleSheet, Text, View} from "react-native";
import HabitListItem from "./HabitListItem";
import AddButton from "@/app/components/shared/AddButton";

type Habit = {
    name: string;
    streak: number;
    done: boolean;
    color: string;
};

const habits: Habit[] = [
    {
        name: "Drink water",
        streak: 10,
        done: false,
        color: '#64C5E3'
    },
    {name: "Do yoga", streak: 10, done: false, color: '#BC89F3'},
    {name: "Read a book", streak: 2, done: false, color: '#46DB9A'},
    {name: "Meditate", streak: 0, done: false, color: '#E3C364'},
    {name: "Punch a friend", streak: 3, done: true, color: '#E37364'},
    {name: "Run a marathon", streak: 3, done: true, color: '#E39464'},

];

export default function HabitList() {
    const toBeCompleted = habits.filter(habit => !habit.done);
    const completed = habits.filter(habit => habit.done);

    return (
        <View style={styles.main}>
            {toBeCompleted.map(habit => (
                <HabitListItem key={habit.name} habit={habit} showCheckbox={true} color={habit.color}/>
            ))}
            {completed.length > 0 && (
                <>
                    <Text style={{marginTop: 20}}>Completed</Text>
                    {completed.map(habit => (
                        <HabitListItem key={habit.name} habit={habit} showCheckbox={false} color={habit.color}/>
                    ))}
                </>
            )}
            <View style={styles.addButton}>
                <AddButton/>
            </View>
            {/*zmienic zeby nie bylo pod lista tylko na*/}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        display: "flex",
    },
    addButton: {
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    }
});
