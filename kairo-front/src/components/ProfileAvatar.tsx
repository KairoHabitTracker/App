// Libraries
import {Image, ImageStyle, StyleProp, Text, View} from 'react-native';

// Styles
import {profileStyles, tokens} from '@/global';

type Props = {
    username?: string | null;
    avatarUrl?: string | null;
    size?: number;
    // Image-specific style only when rendering the <Image />; arrays also allowed
    style?: StyleProp<ImageStyle> | Array<StyleProp<ImageStyle>>;
};

export default function ProfileAvatar({username, avatarUrl, size, style}: Props) {
    const avatarSize = typeof size === 'number' ? size : tokens.avatar.width;

    const avatarStyleObject: ImageStyle = {
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
    };
    const avatarStyle: StyleProp<ImageStyle> = avatarStyleObject;

    if (avatarUrl) {
        // profileStyles.avatar may include View-specific props; cast to ImageStyle for the Image
        const baseStyle = profileStyles.avatar as ImageStyle;
        const extraStyles = (Array.isArray(style) ? style : [style]) as StyleProp<ImageStyle>[];
        return (
            <Image source={{uri: avatarUrl}} style={[baseStyle, avatarStyle, ...extraStyles]} resizeMode="cover"/>
        );
    }

    const initials = (username || '?').slice(0, 1).toUpperCase();

    // Fallback to initials placeholder
    return (
        <View style={[profileStyles.avatar, profileStyles.avatarPlaceholder, avatarStyle]}>
            <Text style={profileStyles.avatarInitials}>{initials}</Text>
        </View>
    );
}
