import {StyleSheet, Text, View} from "react-native";
import {Check} from '@tamagui/lucide-icons'
import {Checkbox} from 'tamagui'


type Habit = {
    name: string;
    streak: number;
    done: boolean;
};


export default function HabitListItem({habit}: { habit: Habit }) {
    return (
        <View style={styles.habitItem}>
            <View style={styles.picture}></View>
            <View style={styles.habitText}>
                <Text style={styles.text}>{habit.name}</Text>
                <Text>streak {habit.streak} days</Text>
            </View>
            <View style={styles.checkbox}>
                <Checkbox size="$4" checked={habit.done}>
                    <Checkbox.Indicator>
                        <Check/>
                    </Checkbox.Indicator>
                </Checkbox>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    habitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#CBDCEB',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 6,
        minHeight: 20,
    },
    picture: {
        backgroundColor: '#6D94C5',
        height: 30,
        width: 30,
        borderRadius: 5,
        marginRight: 16,
    },
    habitText: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    text: {
        fontSize: 16,
    },
    checkbox: {
        alignSelf: 'center',
        justifyContent: "flex-end",
    }
});

