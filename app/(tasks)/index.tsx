import { useCallback, useMemo, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import { TaskInput } from '@/components/task-input';
import { TaskItem } from '@/components/task-item';
import { TasksEmptyState } from '@/components/tasks-empty-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Task } from '@/types/task';

type TaskSection = {
  title: string;
  data: Task[];
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const insets = useSafeAreaInsets();

  const addTask = useCallback((text: string) => {
    setTasks((prev) => [
      { id: uuid.v4() as string, text, completed: false },
      ...prev,
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const editTask = useCallback((id: string, text: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text } : task)),
    );
  }, []);

  const sections = useMemo<TaskSection[]>(() => {
    const active: Task[] = [];
    const done: Task[] = [];
    for (const task of tasks) {
      (task.completed ? done : active).push(task);
    }
    const result: TaskSection[] = [];
    if (active.length > 0) result.push({ title: 'To do', data: active });
    if (done.length > 0) result.push({ title: 'Completed', data: done });
    return result;
  }, [tasks]);

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        task={item}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />
    ),
    [toggleTask, deleteTask, editTask],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>
        {section.title}
      </ThemedText>
    ),
    [],
  );

  const isEmpty = tasks.length === 0;

  return (
    <ThemedView
      style={[
        styles.flex,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        },
      ]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}>
        <View style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Tasks
          </ThemedText>

          {isEmpty ? (
            <TasksEmptyState />
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              SectionSeparatorComponent={SectionGap}
              ItemSeparatorComponent={ItemGap}
              contentContainerStyle={styles.listContent}
              stickySectionHeadersEnabled={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
            />
          )}

          <View style={styles.inputDock}>
            <TaskInput onAdd={addTask} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function SectionGap() {
  return <View style={styles.sectionGap} />;
}

function ItemGap() {
  return <View style={styles.itemGap} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    marginTop: 8,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    textTransform: 'uppercase',
    opacity: 0.6,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionGap: {
    height: 16,
  },
  itemGap: {
    height: 10,
  },
  inputDock: {
    paddingTop: 12,
  },
});
