import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type TaskInputProps = {
  onAdd: (text: string) => void;
};

export function TaskInput({ onAdd }: TaskInputProps) {
  const [text, setText] = useState('');

  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');
  const fieldBg = useThemeColor({}, 'surface');

  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        submitBehavior="submit"
        placeholder="Add a task..."
        placeholderTextColor={icon}
        returnKeyType="done"
        accessibilityLabel="New task"
        style={[styles.input, { backgroundColor: fieldBg, color: textColor }]}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit}
        accessibilityRole="button"
        accessibilityLabel="Add task"
        accessibilityState={{ disabled: !canSubmit }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: tint,
            opacity: !canSubmit ? 0.4 : pressed ? 0.8 : 1,
          },
        ]}>
        <IconSymbol name="plus" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
