import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type TaskItemMenuProps = {
  visible: boolean;
  position: { top: number; right: number };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskItemMenu({
  visible,
  position,
  onClose,
  onEdit,
  onDelete,
}: TaskItemMenuProps) {
  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const danger = useThemeColor({}, 'danger');
  const textColor = useThemeColor({}, 'text');

  const handleEdit = () => {
    onClose();
    onEdit();
  };

  const handleDelete = () => {
    onClose();
    Alert.alert(
      'Delete task?',
      'This task will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[
            styles.menu,
            {
              backgroundColor: background,
              borderColor: surface,
              top: position.top,
              right: position.right,
            },
          ]}>
          <Pressable
            onPress={handleEdit}
            android_ripple={{ color: surface }}
            style={({ pressed }) => [styles.item, pressed && { backgroundColor: surface }]}>
            <IconSymbol name="pencil" size={18} color={textColor} />
            <ThemedText style={styles.itemText}>Edit</ThemedText>
          </Pressable>
          <View style={[styles.divider, { backgroundColor: surface }]} />
          <Pressable
            onPress={handleDelete}
            android_ripple={{ color: surface }}
            style={({ pressed }) => [styles.item, pressed && { backgroundColor: surface }]}>
            <IconSymbol name="trash" size={18} color={danger} />
            <ThemedText style={[styles.itemText, { color: danger }]}>Delete</ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    minWidth: 160,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  itemText: {
    fontSize: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 8,
  },
});
