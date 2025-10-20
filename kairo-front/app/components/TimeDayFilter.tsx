import {StyleSheet, View} from "react-native";
import {Button} from "tamagui";

export default function TimeDayFilter() {
    return (
        <View style={styles.main}>
            <Button size={30}>All</Button>
            <Button size={30}>Morning</Button>
            <Button size={30}>Afternoon</Button>
            <Button size={30}>Evening</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
