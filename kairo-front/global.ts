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