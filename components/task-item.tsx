import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Task } from '@/types/task';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const tint = useThemeColor({}, 'tint');
  const icon = useThemeColor({}, 'icon');
  const danger = useThemeColor({}, 'danger');
  const rowBg = useThemeColor({}, 'surface');

  return (
    <View style={[styles.row, { backgroundColor: rowBg, opacity: task.completed ? 0.6 : 1 }]}>
      <Pressable
        onPress={() => onToggle(task.id)}
        hitSlop={8}
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

      <ThemedText
        style={[styles.text, task.completed && styles.textCompleted]}
        numberOfLines={3}>
        {task.text}
      </ThemedText>

      <Pressable
        onPress={() => onDelete(task.id)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Delete task"
        android_ripple={{ color: danger, borderless: true, radius: 16 }}
        style={({ pressed }) => [styles.delete, { opacity: pressed ? 0.6 : 1 }]}>
        <IconSymbol name="trash" size={22} color={danger} />
      </Pressable>
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
  delete: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
