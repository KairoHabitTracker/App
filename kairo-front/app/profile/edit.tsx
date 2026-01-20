import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Input, Separator } from 'tamagui';

import ProfileAvatar from '@/src/components/ProfileAvatar';
import { useAuth } from '@/src/contexts/AuthContext';
import { deleteAvatarRequest, isApiError, updateProfileRequest, uploadAvatarRequest } from '@/src/lib/api';
import { editProfileStyles } from '@/global';

const MIN_USERNAME_LENGTH = 2;

export default function EditProfileScreen() {
    const { user, refreshProfile } = useAuth();
    const [displayName, setDisplayName] = useState(user?.username ?? '');
    const [savingName, setSavingName] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [removingAvatar, setRemovingAvatar] = useState(false);
    const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        setDisplayName(user?.username ?? '');
    }, [user?.username]);

    useEffect(() => {
        if (!uploadingAvatar) {
            setLocalAvatarPreview(null);
        }
    }, [uploadingAvatar]);

    const trimmedName = displayName.trim();
    const canSaveName = trimmedName.length >= MIN_USERNAME_LENGTH && trimmedName !== (user?.username ?? '');

    const activeAvatarUri = localAvatarPreview ?? user?.avatarUrl ?? null;

    function resolveErrorMessage(error: unknown, fallback: string) {
        if (isApiError(error) && typeof error.message === 'string' && error.message.length) {
            return error.message;
        }
        if (error instanceof Error && error.message) return error.message;
        return fallback;
    }

    async function handleSaveName() {
        if (!canSaveName) return;
        setSavingName(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            await updateProfileRequest({ name: trimmedName });
            await refreshProfile();
            setSuccessMessage('Username updated successfully.');
        } catch (error) {
            setErrorMessage(resolveErrorMessage(error, 'Unable to update username.'));
        } finally {
            setSavingName(false);
        }
    }

    async function handlePickAvatar() {
        setErrorMessage(null);
        setSuccessMessage(null);

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow photo library access to upload an avatar.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            aspect: [1, 1],
        });

        if (result.canceled) return;
        const asset = result.assets?.[0];
        if (!asset?.uri) return;

        setLocalAvatarPreview(asset.uri);
        setUploadingAvatar(true);
        try {
            await uploadAvatarRequest({
                uri: asset.uri,
                mimeType: asset.mimeType ?? undefined,
                name: asset.fileName ?? undefined,
            });
            await refreshProfile();
            setSuccessMessage('Avatar updated successfully.');
        } catch (error) {
            setLocalAvatarPreview(null);
            setErrorMessage(resolveErrorMessage(error, 'Unable to upload avatar.'));
        } finally {
            setUploadingAvatar(false);
        }
    }

    async function handleRemoveAvatar() {
        setErrorMessage(null);
        setSuccessMessage(null);
        setRemovingAvatar(true);
        try {
            await deleteAvatarRequest();
            await refreshProfile();
            setSuccessMessage('Avatar removed.');
        } catch (error) {
            setErrorMessage(resolveErrorMessage(error, 'Unable to remove avatar.'));
        } finally {
            setRemovingAvatar(false);
        }
    }

    return (
        <View style={editProfileStyles.screen}>
            <Text style={editProfileStyles.heading}>Edit Profile</Text>

            <View style={editProfileStyles.section}>
                <Text style={editProfileStyles.sectionTitle}>Avatar</Text>
                <View style={editProfileStyles.avatarRow}>
                    <ProfileAvatar username={user?.username} avatarUrl={activeAvatarUri} size={80} />
                    <View style={editProfileStyles.avatarActions}>
                        <Button
                            onPress={handlePickAvatar}
                            disabled={uploadingAvatar}
                            style={editProfileStyles.avatarButtonSpacing}
                        >
                            {uploadingAvatar ? 'Uploading...' : 'Change avatar'}
                        </Button>
                        <Button onPress={handleRemoveAvatar} disabled={uploadingAvatar || removingAvatar}>
                            {removingAvatar ? 'Removing...' : 'Remove avatar'}
                        </Button>
                    </View>
                </View>
                <Text style={editProfileStyles.helperText}>
                    Upload a square JPEG, PNG, JPG or WEBP up to 2MB.
                </Text>
            </View>

            <View style={editProfileStyles.separatorWrapper}>
                <Separator />
            </View>

            <View style={editProfileStyles.section}>
                <Text style={editProfileStyles.sectionTitle}>Username</Text>
                <Input
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your username"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={255}
                    style={editProfileStyles.input}
                />
                <View style={editProfileStyles.usernameMetaRow}>
                    <Text style={editProfileStyles.usernameMetaText}>
                        Minimum {MIN_USERNAME_LENGTH} characters.
                    </Text>
                    <Text style={editProfileStyles.usernameMetaText}>
                        {displayName.length}/255
                    </Text>
                </View>
                <Button
                    onPress={handleSaveName}
                    disabled={!canSaveName || savingName}
                    style={editProfileStyles.saveButton}
                >
                    {savingName ? 'Saving...' : 'Save changes'}
                </Button>
            </View>

            {(errorMessage || successMessage) && (
                <View
                    style={[
                        editProfileStyles.feedbackBox,
                        errorMessage ? editProfileStyles.feedbackBoxError : editProfileStyles.feedbackBoxSuccess
                    ]}
                >
                    <Text
                        style={[
                            editProfileStyles.feedbackText,
                            errorMessage ? editProfileStyles.feedbackTextError : editProfileStyles.feedbackTextSuccess
                        ]}
                    >
                        {errorMessage ?? successMessage}
                    </Text>
                </View>
            )}
        </View>
    );
}