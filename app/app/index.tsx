import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../src/api';
import { Article } from '../src/types';
import { colors } from '../src/theme';
import ArticleCard from '../components/ArticleCard';
import { EmptyState, ErrorState, LoadingState } from '../components/States';

export default function FeedScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openArticle = (a: Article) =>
    router.push({
      pathname: '/article',
      params: { title: a.title, url: a.url, publishedAt: a.publishedAt, summary: a.summary ?? '' },
    });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={data?.articles ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleCard article={item} onPress={() => openArticle(item)} />}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
