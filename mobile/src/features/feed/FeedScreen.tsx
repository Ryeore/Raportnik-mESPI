import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeed, refreshFeed, Report } from '../../api/reports';

export default function FeedScreen({ navigation }: any) {
  const { data, refetch, isRefetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed({ size: 20, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last: Report[]) => {
      const oldest = last.at(-1);
      return oldest ? new Date(oldest.publishedAt).getTime() : undefined;
    },
  });
  const items = data?.pages.flat() ?? [];

  const onRefresh = async () => {
    await refreshFeed();
    await refetch();
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(r) => r.id}
      onEndReached={() => fetchNextPage()}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ReportDetail', { report: item })}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontSize: 12, color: '#888' }}>{item.type} • {item.number}</Text>
            <Text style={{ fontWeight: '600' }}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
