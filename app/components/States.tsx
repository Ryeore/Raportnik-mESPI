import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../src/theme';

export function LoadingState() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.label}>Loading news…</Text>
    </View>
  );
}

export function EmptyState() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>No news available</Text>
    </View>
  );
}

export function ErrorState() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Failed to load news</Text>
      <Text style={styles.label}>Pull down to retry.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 300 },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  label: { fontSize: 14, color: colors.muted, marginTop: 8 },
});
