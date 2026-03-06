import React, {useRef} from 'react';
import {Pressable, Text, View} from 'react-native';
import {Check, Flame, RotateCcw} from '@tamagui/lucide-icons';
import Swipeable, {SwipeableMethods} from 'react-native-gesture-handler/ReanimatedSwipeable';
import {UserHabit} from '@/src/types/habits/UserHabit';
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

interface HabitListItemProps {
  userHabit: UserHabit;
  isCompleted?: boolean;
  onComplete?: () => void;
  onUncomplete?: () => void;
  onEditHabit?: (id: number) => void;
}

export default function HabitListItem({
  userHabit,
  isCompleted = false,
  onComplete,
  onUncomplete,
  onEditHabit,
}: HabitListItemProps) {
  const {habit, streak} = userHabit;
  const styles = useHabitListItemStyles();
  const swipeableRef = useRef<SwipeableMethods>(null);

  if (!userHabit?.habit) {
    return null;
  }

  const formatCategory = (cat: string) =>
    cat
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const renderLeftActions = () => (
    <View style={styles.leftActionContainer}>
      <Check size={24} color="white" />
      <Text style={styles.actionText}>Complete</Text>
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.rightActionContainer}>
      <Text style={styles.actionText}>Undo</Text>
      <RotateCcw size={24} color="white" />
    </View>
  );

  const handleOpen = (direction: 'left' | 'right') => {
    swipeableRef.current?.close();

    setTimeout(() => {
      if (direction === 'right' && !isCompleted) {
        onComplete?.();
      } else if (direction === 'left' && isCompleted) {
        onUncomplete?.();
      }
    }, 80);
  };

  return (
    <View style={styles.container}>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        leftThreshold={40}
        rightThreshold={40}
        renderLeftActions={!isCompleted ? renderLeftActions : undefined}
        renderRightActions={isCompleted ? renderRightActions : undefined}
        onSwipeableOpen={handleOpen}>
        <Pressable
          onPress={() => onEditHabit?.(userHabit.id)}
          style={[
            styles.habitCard,
            {
              backgroundColor: habit.hex_color || '#3B82F6',
              opacity: isCompleted ? 0.9 : 1,
            },
          ]}>
          <View style={styles.cardContent}>
            <View style={styles.leftSection}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{habit.emoji}</Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.habitName} numberOfLines={1}>
                  {habit.name}
                </Text>
                {habit.category && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{formatCategory(habit.category)}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.rightSection}>
              <View style={styles.streakContainer}>
                <Flame size={14} color="white" fill={streak > 0 ? 'white' : 'transparent'} />
                <Text style={styles.streakText}>{streak}</Text>
              </View>

              {isCompleted && (
                <View style={styles.checkmarkCircle}>
                  <Check size={16} color={habit.hex_color || '#3B82F6'} />
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </View>
  );
}

const createHabitListItemStyles = (colors: ThemeColors) => ({
  container: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  leftActionContainer: {
    width: 100,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
  },
  rightActionContainer: {
    width: 100,
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginLeft: 8,
    gap: 4,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  habitCard: {
    minHeight: 80,
    borderRadius: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {fontSize: 24},
  textContainer: {justifyContent: 'center', flex: 1, gap: 4},
  habitName: {color: 'white', fontSize: 17, fontWeight: '700'},
  categoryBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryText: {color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600'},
  rightSection: {alignItems: 'flex-end', justifyContent: 'center', gap: 8},
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {color: 'white', fontWeight: '700', fontSize: 13},
  checkmarkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function useHabitListItemStyles() {
  return useThemedStyles(createHabitListItemStyles);
}
