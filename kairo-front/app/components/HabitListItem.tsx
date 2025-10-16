import {StyleSheet, Text, View} from "react-native";
import {Checkbox} from 'react-native-paper';

type Habit = {
    name: string;
    streak: number;
    done: boolean;
};

export default function HabitListItem({habit}: { habit: Habit }) {
    return (
        <View style={styles.habitItem}>
            <View style={styles.picture}></View>
            <View style={styles.text}>
                <Text style={styles.habitText}>{habit.name}</Text>
                <Text>streak {habit.streak} days</Text>
            </View>
            <Checkbox
                status={habit.done ? 'checked' : 'unchecked'}
                disabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    habitItem: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        gap: '20',
        backgroundColor: '#CBDCEB',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 6,
        alignItems: 'flex-start',
        minHeight: 20,

    },
    picture: {
        alignSelf: 'center',
        backgroundColor: '#6D94C5',
        height: 30,
        width: 30,
        borderRadius: 5,
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    habitText: {
        fontSize: 16,
    },
});


//
// import {StyleSheet, Text, View} from "react-native";
// import {Check} from '@tamagui/lucide-icons'
// import {Checkbox} from 'tamagui'
//
//
// export default function HabitListItem({habit}: { habit: Habit }) {
//     return (
//         <View style={styles.habitItem}>
//             <View style={styles.picture}></View>
//             <View style={styles.text}>
//                 <Text style={styles.habitText}>{habit.name}</Text>
//                 <Text>streak {habit.streak} days</Text>
//             </View>
//             <Checkbox size="$4">
//                 <Checkbox.Indicator>
//                     <Check
//                         checked={habit.done}
//                     />
//                 </Checkbox.Indicator>
//             </Checkbox>
//         </View>
//     );
// }
//
