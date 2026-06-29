import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Article } from '../src/types';
import { colors } from '../src/theme';
import { formatDate } from '../src/format';

type Props = {
  article: Article;
  onPress: () => void;
};

export default function ArticleCard({ article, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.title} numberOfLines={3}>
        {article.title}
      </Text>
      <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
      {article.summary ? (
        <Text style={styles.summary} numberOfLines={3}>
          {article.summary}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pressed: { backgroundColor: '#f0f0f2' },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, lineHeight: 22 },
  date: { fontSize: 12, color: colors.muted, marginTop: 6 },
  summary: { fontSize: 14, color: '#444', marginTop: 8, lineHeight: 20 },
});
