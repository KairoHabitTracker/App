import {StyleSheet} from "react-native";


export const tokens = {
    colors: {
        background: "#f8f9fb",
        text: "#1f2937",
        textSubtle: "#6b7280",
        avatarBackground: "#dfe3ea",
        avatarText: "#556070",
        cardBackground: "#ffffff",
        cardShadow: "#000000",
        statText: "#111827",
        tabBar: '#54beff',
        tabBarInactiveTintColor: '#B8E6FF',
        buttonColor: '#6366F1',
    },
    radius: {
        md: 12,
        full: 9999,
    },
    spacing: {
        xs: 4,
        sm: 12,
        md: 16,
        lg: 20,
        xl: 24,
        xxl: 32,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        fontSize: 36,
        fontWeight: "700",
    },
    username: {
        fontSize: 22,
        fontWeight: "600",
    },
    statistics: {
        labelFontSize: 12,
        valueFontSize: 20,
        valueFontWeight: "700",
    }
} as const;


export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.background,
        paddingHorizontal: tokens.spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
        gap: tokens.spacing.md,
    },
    basicContainer: {
        flex: 1,
        backgroundColor: tokens.colors.cardBackground,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#111827',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
    categoryBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    headerShadow: {
        // --- Cienie dla iOS ---
        shadowColor: '#000', // Kolor cienia (iOS)
        shadowOffset: {
            width: 0,
            height: 2
        }, // Przesunięcie cienia (iOS)
        shadowOpacity: 0.25, // Przezroczystość cienia (iOS)
        shadowRadius: 3.84, // Rozmycie cienia (iOS)

        // --- Cienie dla Androida ---
        elevation: 5, // Głębokość cienia (Android)

        // --- Styl kontenera (przeniesiony z Pana/Pani kodu) ---
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        // WAŻNE: Na Androidzie do prawidłowego działania elevation, kontener musi mieć tło (np. backgroundColor: 'white')
        backgroundColor: 'white',
    },
})

export const sharedFonts = StyleSheet.create({
    errorText: {
        color: '#EF4444',
        fontSize: 16,
    },
    headerText: {
        fontSize: 32,
        fontWeight: '700',
        color: tokens.colors.text,
    },
    bigText: {
        fontSize: 22,
        fontWeight: '700',
        color: tokens.colors.text,
    },
    mediumText: {
        fontSize: 16,
        color: tokens.colors.text,
        fontWeight: '600',
    },
    smallText: {
        fontSize: 14,
        fontWeight: '600',
        color: tokens.colors.text,
    },
    mediumSubtleText: {
        fontSize: 16,
        color: tokens.colors.textSubtle,
        fontWeight: '500',
    },
    smallSubtleText: {
        fontSize: 14,
        color: tokens.colors.textSubtle,
    },
    upperCaseSubtleText: {
        fontSize: 16,
        color: tokens.colors.textSubtle,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    mediumWhiteText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    smallWhiteText: {
        fontSize: 14,
        color: 'white',
    },

    bigEmoji: {
        fontSize: 64,
    },
    biggerEmoji: {
        fontSize: 48,
    },
    mediumEmoji: {
        fontSize: 24,
    },
    smallEmoji: {fontSize: 20},

})

// Profile-specific styles (can be reused or extended elsewhere)
export const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.background,
        paddingHorizontal: tokens.spacing.lg,
        paddingTop: tokens.spacing.xxl,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        marginBottom: tokens.spacing.xl,
    },
    avatar: {
        width: tokens.avatar.width,
        height: tokens.avatar.height,
        borderRadius: tokens.avatar.borderRadius,
        marginBottom: tokens.spacing.sm,
    },
    avatarPlaceholder: {
        backgroundColor: tokens.colors.avatarBackground,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarInitials: {
        fontSize: tokens.avatar.fontSize,
        fontWeight: tokens.avatar.fontWeight,
        color: tokens.colors.avatarText,
    },
    username: {
        fontSize: tokens.username.fontSize,
        fontWeight: tokens.username.fontWeight,
        color: tokens.colors.text,
    },
    statsRow: {
        flexDirection: "row",
        gap: 12 as unknown as number, // RN gap not on all versions; fallback via margins
    },
    statCard: {
        flex: 1,
        backgroundColor: tokens.colors.cardBackground,
        borderRadius: tokens.radius.md,
        padding: tokens.spacing.md,
        shadowColor: tokens.colors.cardShadow,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        marginRight: tokens.spacing.sm,
        marginBottom: tokens.spacing.lg,
    },
    statLabel: {
        fontSize: tokens.statistics.labelFontSize,
        color: tokens.colors.textSubtle,
        marginBottom: tokens.spacing.xs,
    },
    statValue: {
        fontSize: tokens.statistics.valueFontSize,
        fontWeight: tokens.statistics.valueFontWeight,
        color: tokens.colors.statText,
    },
    subtle: {
        color: tokens.colors.textSubtle,
    },
});

// Do not question this, I
// was just really excited to work on something other
// than Auth T___T
export const errorStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.background,
        paddingHorizontal: tokens.spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
        gap: tokens.spacing.md as unknown as number,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: tokens.colors.text,
        marginBottom: tokens.spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: tokens.colors.textSubtle,
        marginBottom: tokens.spacing.lg,
        textAlign: 'center',
        maxWidth: 520,
    },
    button: {
        backgroundColor: tokens.colors.text,
        paddingVertical: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.xl,
        borderRadius: tokens.radius.md,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    smallNote: {
        marginTop: tokens.spacing.md,
        color: tokens.colors.textSubtle,
        fontSize: 12,
        textAlign: 'center',
        maxWidth: 420,
    },
});


export const friendStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    inviteButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    inviteSection: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    inviteTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    inviteInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    inviteIcon: {
        marginRight: 8,
    },
    inviteInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
    },
    sendButton: {
        padding: 8,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    invitationCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    invitationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    invitationDetails: {
        flex: 1,
    },
    invitationName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    invitationDate: {
        fontSize: 14,
        color: '#6B7280',
    },
    invitationActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#10B981',
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    rejectButton: {
        backgroundColor: '#F3F4F6',
    },
    rejectButtonText: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '600',
    },
    friendCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    friendAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 28,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    friendEmail: {
        fontSize: 14,
        color: '#6B7280',
    },
    coinsBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    coinsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400E',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
    },
    emptyEmoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
})


export const oneHabitStyles = StyleSheet.create({
    card: {
        backgroundColor: tokens.colors.cardBackground,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'capitalize',
    },
    formSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 10,
    },

    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10
    },
    dayButton: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        minWidth: 50,
        alignItems: 'center',
    },
    dayButtonActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    dayTextActive: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: tokens.colors.buttonColor,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
});


export const searchHabitStyles = StyleSheet.create({
    flex: {flex: 1},
    container: {padding: 16, alignItems: 'center'},
    inputCard: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    input: {
        fontSize: 16,
        padding: 8,
        flex: 1,
    },
    sectionHeaderRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    suggestionsWrap: {
        width: '100%',
        display: 'flex',
        gap: 8,
    },
    suggestion: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 8,
    },
    suggestionRow: {flexDirection: 'row', alignItems: 'center'},
});


export const progressCard = StyleSheet.create({
    progressCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressPercent: {
        fontSize: 24,
        fontWeight: '700',
        color: '#3B82F6',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 4,
    },
});

export const progressCardStyles = StyleSheet.create({
    container: {
        marginBottom: 12,
        position: 'relative',
    },
    actionBg: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        borderRadius: 16,
    },
    actionBgComplete: {
        backgroundColor: '#10B981',
        justifyContent: 'flex-start',
        paddingLeft: 24,
    },
    actionBgUndo: {
        backgroundColor: '#EF4444',
        justifyContent: 'flex-end',
        paddingRight: 24,
    },
    habitCard: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    habitContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emojiContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    checkmark: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export const editProfileStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: tokens.colors.cardBackground,
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.lg,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: tokens.colors.text,
        marginBottom: tokens.spacing.lg,
    },
    section: {
        marginBottom: tokens.spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: tokens.colors.text,
        marginBottom: tokens.spacing.sm,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarActions: {
        flex: 1,
        marginLeft: tokens.spacing.lg,
    },
    avatarButtonSpacing: {
        marginBottom: tokens.spacing.sm,
    },
    helperText: {
        color: tokens.colors.textSubtle,
        fontSize: 14,
        marginTop: tokens.spacing.sm,
    },
    separatorWrapper: {
        marginBottom: tokens.spacing.xl,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: tokens.radius.md,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        color: tokens.colors.text,
        marginBottom: tokens.spacing.sm,
    },
    usernameMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: tokens.spacing.sm,
    },
    usernameMetaText: {
        color: tokens.colors.textSubtle,
        fontSize: 12,
    },
    saveButton: {
        marginTop: tokens.spacing.sm,
    },
    feedbackBox: {
        borderRadius: tokens.radius.md,
        padding: tokens.spacing.md,
        marginTop: tokens.spacing.sm,
    },
    feedbackBoxError: {
        backgroundColor: '#fee2e2',
    },
    feedbackBoxSuccess: {
        backgroundColor: '#ecfdf5',
    },
    feedbackText: {
        fontSize: 14,
    },
    feedbackTextError: {
        color: '#b91c1c',
    },
    feedbackTextSuccess: {
        color: '#047857',
    },
});

export const homeScreenStyles = StyleSheet.create({
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: 'white',
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFEDD5',
        gap: 6
    },
    streakText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#B45309',
    }
})

export const friendsScreenStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    copyIdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        paddingVertical: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 4
    },

    cardGroup: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden'
    },
    sectionContainer: {
        marginBottom: 8
    },

    cardRow: {
        backgroundColor: 'white',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    inviteRow: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    dividerMargin: {
        height: 8
    },
    inviteInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    actionButtons: {
        flexDirection: 'row',
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3B82F6'
    },
    infoContainer: {
        flex: 1
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827'
    },
    subText: {
        fontSize: 13,
        color: '#6B7280'
    },
    coinBadge: {
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFEDD5'
    },
    coinText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B45309'
    },

    inviteContainer: {
        padding: 16,
        backgroundColor: '#F9FAFB'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    sendIconBtn: {
        padding: 8
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40
    }
});


export const notificationStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginTop: 8,
    },
    settingsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'center',
    },
    notificationIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    notificationTime: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3B82F6',
        marginLeft: 8,
    },
    notificationDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    infoCard: {
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginTop: 12,
    },
    infoText: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
    },
});

export const settingRowStyles = StyleSheet.create({
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
});
