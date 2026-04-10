import { useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { TaskItemMenu } from '@/components/task-item-menu';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Task } from '@/types/task';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const tint = useThemeColor({}, 'tint');
  const icon = useThemeColor({}, 'icon');
  const rowBg = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const buttonRef = useRef<View>(null);

  const openMenu = () => {
    buttonRef.current?.measureInWindow((x, y, w, h) => {
      const screenWidth = Dimensions.get('window').width;
      setMenuPos({ top: y + h + 4, right: Math.max(8, screenWidth - x - w) });
      setMenuVisible(true);
    });
  };

  const startEditing = () => {
    setDraft(task.text);
    setEditing(true);
  };

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed.length > 0 && trimmed !== task.text) {
      onEdit(task.id, trimmed);
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(task.text);
    setEditing(false);
  };

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: rowBg, opacity: task.completed && !editing ? 0.6 : 1 },
      ]}>
      <Pressable
        onPress={() => onToggle(task.id)}
        hitSlop={8}
        disabled={editing}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        style={({ pressed }) => [styles.checkbox, { opacity: pressed ? 0.6 : 1 }]}>
        <IconSymbol
          name={task.completed ? 'checkmark.circle.fill' : 'circle'}
          size={26}
          color={task.completed ? tint : icon}
        />
      </Pressable>

      {editing ? (
        <TextInput
          style={[styles.text, styles.input, { color: textColor, borderColor: tint }]}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={commitEdit}
          onBlur={commitEdit}
          autoFocus
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          multiline
        />
      ) : (
        <ThemedText
          style={[styles.text, task.completed && styles.textCompleted]}
          numberOfLines={3}>
          {task.text}
        </ThemedText>
      )}

      {editing ? (
        <Pressable
          onPress={cancelEdit}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Cancel edit"
          style={({ pressed }) => [styles.trailing, { opacity: pressed ? 0.6 : 1 }]}>
          <ThemedText style={{ color: tint }}>Cancel</ThemedText>
        </Pressable>
      ) : (
        <Pressable
          ref={buttonRef}
          onPress={openMenu}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Task actions"
          android_ripple={{ color: icon, borderless: true, radius: 16 }}
          style={({ pressed }) => [styles.trailing, { opacity: pressed ? 0.6 : 1 }]}>
          <IconSymbol name="ellipsis" size={22} color={icon} />
        </Pressable>
      )}

      <TaskItemMenu
        visible={menuVisible}
        position={menuPos}
        onClose={() => setMenuVisible(false)}
        onEdit={startEditing}
        onDelete={() => onDelete(task.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
  },
  input: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  trailing: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
