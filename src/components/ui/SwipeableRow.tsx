import { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useThemeColors, spacing, fontSize } from '../../theme';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export function SwipeableRow({ children, onDelete }: SwipeableRowProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const colors = useThemeColors();

  function handleDelete() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    swipeableRef.current?.close();
    onDelete();
  }

  function renderRightActions() {
    return (
      <RectButton style={[styles.deleteAction, { backgroundColor: colors.negative }]} onPress={handleDelete}>
        <Text style={styles.deleteText}>Excluir</Text>
      </RectButton>
    );
  }

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false}>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
