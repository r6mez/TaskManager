import { useCallback, useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import { useConfirm } from '@/components/confirm-dialog';
import { TaskInput } from '@/components/task-input';
import { TaskItem } from '@/components/task-item';
import { TasksEmptyState } from '@/components/tasks-empty-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppTheme } from '@/components/theme-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Task } from '@/types/task';

type TaskSection = {
  title: string;
  data: Task[];
  clearable?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCollapsed, setCompletedCollapsed] = useState(false);
  const insets = useSafeAreaInsets();
  const { scheme, toggle: toggleScheme } = useAppTheme();
  const confirm = useConfirm();
  const danger = useThemeColor({}, 'danger');
  const icon = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

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

  const clearCompleted = useCallback(async () => {
    const ok = await confirm({
      title: 'Clear completed tasks?',
      message: 'All completed tasks will be permanently removed.',
      confirmLabel: 'Clear',
      destructive: true,
    });
    if (ok) {
      setTasks((prev) => prev.filter((task) => !task.completed));
    }
  }, [confirm]);

  const sections = useMemo<TaskSection[]>(() => {
    const active: Task[] = [];
    const done: Task[] = [];
    for (const task of tasks) {
      (task.completed ? done : active).push(task);
    }
    const result: TaskSection[] = [];
    if (active.length > 0) result.push({ title: 'To do', data: active });
    if (done.length > 0) {
      result.push({
        title: 'Completed',
        data: completedCollapsed ? [] : done,
        clearable: true,
        collapsible: true,
        collapsed: completedCollapsed,
      });
    }
    return result;
  }, [tasks, completedCollapsed]);

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
    ({ section }: { section: TaskSection }) => {
      const titleNode = (
        <View style={styles.sectionTitleGroup}>
          {section.collapsible && (
            <IconSymbol
              name={section.collapsed ? 'chevron.right' : 'chevron.down'}
              size={18}
              color={icon}
            />
          )}
          <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>
            {section.title}
          </ThemedText>
        </View>
      );

      return (
        <View style={styles.sectionHeaderRow}>
          {section.collapsible ? (
            <Pressable
              onPress={() => setCompletedCollapsed((prev) => !prev)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{ expanded: !section.collapsed }}
              accessibilityLabel={
                section.collapsed
                  ? 'Expand completed tasks'
                  : 'Collapse completed tasks'
              }
              style={({ pressed }) => [
                styles.sectionTitleGroup,
                { opacity: pressed ? 0.6 : 1 },
              ]}>
              {titleNode}
            </Pressable>
          ) : (
            titleNode
          )}
          {section.clearable && (
            <Pressable
              onPress={clearCompleted}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear completed tasks"
              style={({ pressed }) => [styles.clearButton, { opacity: pressed ? 0.6 : 1 }]}>
              <ThemedText style={[styles.clearButtonText, { color: danger }]}>
                Clear
              </ThemedText>
            </Pressable>
          )}
        </View>
      );
    },
    [clearCompleted, danger, icon],
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
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.title}>
              Tasks
            </ThemedText>
            <Pressable
              onPress={toggleScheme}
              hitSlop={8}
              accessibilityRole="switch"
              accessibilityState={{ checked: scheme === 'dark' }}
              accessibilityLabel={
                scheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
              }
              style={({ pressed }) => [
                styles.themeToggle,
                { borderColor: icon, opacity: pressed ? 0.6 : 1 },
              ]}>
              <IconSymbol
                name={scheme === 'dark' ? 'sun.max.fill' : 'moon.fill'}
                size={20}
                color={textColor}
              />
            </Pressable>
          </View>

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 8,
    marginBottom: 16,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionHeader: {
    fontSize: 13,
    textTransform: 'uppercase',
    opacity: 0.6,
    letterSpacing: 0.5,
  },
  clearButton: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
