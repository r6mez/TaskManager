import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');

  const confirm = useCallback<ConfirmFn>((next) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOpts(next);
    });
  }, []);

  const close = (result: boolean) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setOpts(null);
  };

  const destructive = opts?.destructive ?? false;
  const confirmColor = destructive ? danger : tint;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        visible={opts !== null}
        transparent
        animationType="fade"
        onRequestClose={() => close(false)}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => close(false)}>
          <Pressable
            style={[styles.dialog, { backgroundColor: background, borderColor: surface }]}
            onPress={(e) => e.stopPropagation()}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {opts?.title}
            </ThemedText>
            {opts?.message ? (
              <ThemedText style={[styles.message, { color: icon }]}>
                {opts.message}
              </ThemedText>
            ) : null}
            <View style={styles.actions}>
              <Pressable
                onPress={() => close(false)}
                style={({ pressed }) => [
                  styles.action,
                  { backgroundColor: surface, opacity: pressed ? 0.7 : 1 },
                ]}>
                <ThemedText style={[styles.actionText, { color: textColor }]}>
                  {opts?.cancelLabel ?? 'Cancel'}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => close(true)}
                style={({ pressed }) => [
                  styles.action,
                  { backgroundColor: confirmColor, opacity: pressed ? 0.8 : 1 },
                ]}>
                <ThemedText
                  style={[
                    styles.actionText,
                    styles.actionTextStrong,
                    { color: background },
                  ]}>
                  {opts?.confirmLabel ?? 'OK'}
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 17,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 15,
  },
  actionTextStrong: {
    fontWeight: '600',
  },
});
