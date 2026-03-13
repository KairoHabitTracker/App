import {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Button, Input, Separator} from 'tamagui';

import ProfileAvatar from '@/src/components/ProfileAvatar';
import {useAuth} from '@/src/contexts/AuthContext';
import {
  deleteAvatarRequest,
  isApiError,
  updateProfileRequest,
  uploadAvatarRequest,
} from '@/src/lib/api';
import {ThemeColors, useThemeMode} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';
import {useScreenStyles} from '@/src/styles/screenStyles';

const MIN_USERNAME_LENGTH = 2;

export default function EditProfileScreen() {
  const {user, refreshProfile} = useAuth();
  const styles = useEditProfileStyles();
  const s = useScreenStyles();
  const {colors} = useThemeMode();
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
  const canSaveName =
    trimmedName.length >= MIN_USERNAME_LENGTH && trimmedName !== (user?.username ?? '');

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
      await updateProfileRequest({name: trimmedName});
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
    <View style={s.screen}>
      <View style={{paddingHorizontal: 20, paddingVertical: 24, gap: 24, flex: 1}}>
        <Text style={[s.headerTitle, {fontSize: 28}]}>Edit Profile</Text>

        <View style={styles.section}>
          <Text style={[s.itemTitle, {fontSize: 18}]}>Avatar</Text>
          <View style={styles.avatarRow}>
            <ProfileAvatar username={user?.username} avatarUrl={activeAvatarUri} size={80} />
            <View style={styles.avatarActions}>
              <Button
                onPress={handlePickAvatar}
                disabled={uploadingAvatar}
                style={styles.avatarButtonSpacing}>
                {uploadingAvatar ? 'Uploading...' : 'Change avatar'}
              </Button>
              <Button onPress={handleRemoveAvatar} disabled={uploadingAvatar || removingAvatar}>
                {removingAvatar ? 'Removing...' : 'Remove avatar'}
              </Button>
            </View>
          </View>
          <Text style={s.itemSubtext}>Upload a square JPEG, PNG, JPG or WEBP up to 2MB.</Text>
        </View>

        <View style={styles.separatorWrapper}>
          <Separator style={{backgroundColor: colors.border}} />
        </View>

        <View style={styles.section}>
          <Text style={[s.itemTitle, {fontSize: 18}]}>Username</Text>
          <Input
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your username"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={255}
            style={s.input}
          />
          <View style={styles.usernameMetaRow}>
            <Text style={s.itemSubtext}>Minimum {MIN_USERNAME_LENGTH} characters.</Text>
            <Text style={s.itemSubtext}>{displayName.length}/255</Text>
          </View>
          <Button
            onPress={handleSaveName}
            disabled={!canSaveName || savingName}
            style={styles.saveButton}>
            {savingName ? 'Saving...' : 'Save changes'}
          </Button>
        </View>

        {(errorMessage || successMessage) && (
          <View style={[s.feedbackBox, errorMessage ? s.feedbackBoxError : s.feedbackBoxSuccess]}>
            <Text style={[errorMessage ? s.feedbackTextError : s.feedbackTextSuccess]}>
              {errorMessage ?? successMessage}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const createEditProfileStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      gap: 12,
    },
    avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    avatarActions: {
      flex: 1,
      gap: 8,
    },
    avatarButtonSpacing: {
      marginBottom: 8,
    },
    separatorWrapper: {
      marginVertical: 12,
    },
    usernameMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    saveButton: {
      marginTop: 4,
    },
  });

function useEditProfileStyles() {
  return useThemedStyles(createEditProfileStyles);
}
