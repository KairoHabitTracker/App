import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Plus} from "@tamagui/lucide-icons";
import {useThemeMode} from '@/src/contexts/ThemeContext';

type AddButtonProps = {
    onPress?: () => void;
};

export default function AddButton({ onPress }: AddButtonProps) {
    const {colors} = useThemeMode();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
        >
            <View
                style={[
                    styles.button,
                    {
                        backgroundColor: colors.accent,
                        shadowColor: colors.accent,
                    }

                ]}
            >
                <Plus size={28} color="white" strokeWidth={2.5} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 54,
        height: 54,
        borderRadius: 32,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        // ios
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        // Android
        elevation: 8,
    },
});