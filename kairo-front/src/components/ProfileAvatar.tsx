import {Image, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {useState} from 'react';

import {tokens} from '@/global';


type Props = {
    username?: string | null;
    avatarUrl?: string | null;
    size?: number;
    style?: StyleProp<ImageStyle>;
};

export default function ProfileAvatar({username, avatarUrl, size, style}: Props) {
    const [imageError, setImageError] = useState(false);

    const avatarSize = typeof size === 'number' ? size : tokens.avatar.width;
    const borderRadius = avatarSize / 2;

    const containerStyle: ViewStyle = {
        width: avatarSize,
        height: avatarSize,
        borderRadius: borderRadius,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
    };

    // Obliczamy inicjały
    const initials = (username || '?').slice(0, 1).toUpperCase();

    // Jeśli mamy URL i nie wystąpił błąd ładowania -> pokaż obrazek
    if (avatarUrl && !imageError) {
        return (
            <View style={[containerStyle, style]}>
                <Image
                    source={{uri: avatarUrl}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                    onError={(e) => {
                        console.log("Avatar load error:", e.nativeEvent.error);
                        setImageError(true);
                    }}
                />
            </View>
        );
    }

    // Fallback: Inicjały
    return (
        <View style={[containerStyle, style]}>
            <Text style={[styles.initials, {fontSize: avatarSize * 0.4}]}>
                {initials}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    initials: {
        fontWeight: '700',
        color: '#3B82F6',
    },
});