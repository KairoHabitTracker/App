// Libraries
import { Image, ImageStyle, StyleProp, Text, View } from 'react-native';

// Styles
import { profileStyles, tokens } from '../../../global';

type Props = {
	username?: string | null;
	avatarUrl?: string | null;
	size?: number;
	style?: StyleProp<ImageStyle> | StyleProp<ImageStyle>[];
};

export default function ProfileAvatar({ username, avatarUrl, size, style }: Props) {
	const avatarSize = typeof size === 'number' ? size : tokens.avatar.width;

		const avatarStyle: ImageStyle = {
		width: avatarSize,
		height: avatarSize,
		borderRadius: avatarSize / 2,
	} as ImageStyle;

	if (avatarUrl) {
			return (
				<Image source={{ uri: avatarUrl }} style={[profileStyles.avatar, 
					avatarStyle, ...(Array.isArray(style) ? style : [style])]} resizeMode="cover" />
			);
	}

	const initials = (username || '?').slice(0, 1).toUpperCase();

		// Fallback to initials placeholder
		return (
			<View style={[profileStyles.avatar, profileStyles.avatarPlaceholder, avatarStyle as any]}>
				<Text style={profileStyles.avatarInitials}>{initials}</Text>
			</View>
		);
}
