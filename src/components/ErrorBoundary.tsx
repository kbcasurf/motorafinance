import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeColors, spacing, fontSize, borderRadius } from '../theme';

interface Props {
  children: React.ReactNode;
  silent?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.silent) return null;
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.emoji, { color: colors.textSecondary }]}>:(</Text>
      <Text style={[styles.title, { color: colors.text }]}>Algo deu errado</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        Ocorreu um erro inesperado. Tente novamente.
      </Text>
      {__DEV__ && error && (
        <Text style={styles.debug}>{error.message}</Text>
      )}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.primary,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emoji: { fontSize: 48, marginBottom: spacing.lg },
  title: { fontSize: 22, fontWeight: '700', marginBottom: spacing.sm },
  message: { fontSize: fontSize.md, textAlign: 'center', marginBottom: spacing.md },
  debug: {
    fontSize: fontSize.xs,
    color: '#DC2626',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  button: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  buttonText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: '600' },
});

