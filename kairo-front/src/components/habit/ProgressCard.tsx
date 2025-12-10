import {Text, View} from "react-native";
import {progressCard, sharedFonts} from "@/global";

export default function ProgressCard({ habits, completedToday}: any) {

    const progress = habits.length > 0
        ? Math.round((completedToday.length / habits.length) * 100)
        : 0;

    return (
        <View style={progressCard.progressCard}>
            <View style={progressCard.progressHeader}>
                <Text style={sharedFonts.mediumText}>Daily Progress</Text>
                <Text style={progressCard.progressPercent}>{progress}%</Text>
            </View>
            <View style={progressCard.progressBarBg}>
                <View style={[progressCard.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={sharedFonts.smallSubtleText}>
                {completedToday.length} of {habits.length} habits completed
            </Text>
        </View>
    )
}



