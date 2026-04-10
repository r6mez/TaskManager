import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export function TasksEmptyState() {
  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.text}>No tasks yet.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    opacity: 0.6,
    textAlign: 'center',
  },
});
