import React, { useEffect, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useFeedStore, selectFilteredReports } from '../src/application/stores/feedStore';
import { ReportListItem } from '../src/presentation/components/ReportListItem';
import { SearchBar } from '../src/presentation/components/SearchBar';
import type { FinancialReport } from '../src/domain/models/FinancialReport';
import { colors, typography, spacing } from '../src/presentation/theme/tokens';

export default function FeedScreen() {
  const router = useRouter();
  const {
    isLoading,
    isRefreshing,
    error,
    hasMore,
    searchQuery,
    loadInitial,
    loadNextPage,
    refresh,
    setSearchQuery,
  } = useFeedStore();

  const reports = useFeedStore(selectFilteredReports);

  useEffect(() => {
    loadInitial();
  }, []);

  const handlePress = useCallback(
    (report: FinancialReport) => {
      router.push(
        `/report/${encodeURIComponent(report.id)}?ts=${report.dateTime.getTime()}&type=${report.reportType}`,
      );
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: FinancialReport }) => (
      <ReportListItem report={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: FinancialReport) => item.sourceUrl, []);

  const ListHeader = (
    <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
  );

  const ListEmpty = !isLoading ? (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error ? error : 'Brak raportów na dziś.'}
      </Text>
    </View>
  ) : null;

  const ListFooter =
    isLoading && reports.length > 0 ? (
      <ActivityIndicator
        style={styles.footer}
        color={colors.textSecondary}
      />
    ) : null;

  return (
    <>
      <Stack.Screen options={{ title: 'Raporty ESPI/EBI' }} />
      {isLoading && reports.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.textSecondary} />
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          stickyHeaderIndices={[0]}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={colors.textSecondary}
            />
          }
          contentContainerStyle={reports.length === 0 ? styles.emptyFlex : undefined}
          removeClippedSubviews
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyFlex: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: typography.fontSizeMD,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeightRelaxed,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
