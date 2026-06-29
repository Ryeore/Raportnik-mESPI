import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeed, Report } from '../../api/reports';

export default function FeedScreen({ navigation }: any) {
  const { data, refetch, isRefetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed({ size: 20, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: Report[]) => last.at(-1)?.id,
  });
  const items = data?.pages.flat() ?? [];

  return (
    <FlatList
      data={items}
      keyExtractor={(r) => r.id}
      onEndReached={() => fetchNextPage()}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
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
