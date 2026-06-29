import { Linking, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme';
import { formatDate } from '../src/format';

export default function ArticleScreen() {
  const { title, url, publishedAt, summary } = useLocalSearchParams<{
    title: string;
    url: string;
    publishedAt: string;
    summary: string;
  }>();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{formatDate(publishedAt)}</Text>
        {summary ? <Text style={styles.body}>{summary}</Text> : null}
        <Pressable style={styles.button} onPress={() => Linking.openURL(url)}>
          <Text style={styles.buttonText}>Open original source</Text>
        </Pressable>
        <Text style={styles.source}>Source: PAP / espiebi.pap.pl</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, lineHeight: 30 },
  date: { fontSize: 13, color: colors.muted, marginTop: 10 },
  body: { fontSize: 16, color: '#333', marginTop: 18, lineHeight: 24 },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  source: { fontSize: 12, color: colors.muted, marginTop: 16 },
});
