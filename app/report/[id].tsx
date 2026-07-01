import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useDetailStore } from '../../src/application/stores/detailStore';
import { colors, typography, spacing } from '../../src/presentation/theme/tokens';

function formatPublishedAt(ts: string | undefined): string {
  if (!ts) return '';
  const date = new Date(parseInt(ts, 10));
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ReportDetailScreen() {
  const { id, ts, type } = useLocalSearchParams<{ id: string; ts?: string; type?: string }>();
  const decodedPath = decodeURIComponent(id ?? '');
  const { detail, isLoading, error, load, clear } = useDetailStore();

  useEffect(() => {
    if (decodedPath) load(decodedPath);
    return () => clear();
  }, [decodedPath]);

  const pageTitle = detail?.headers['Tytuł'] ?? 'Raport';
  const parenIdx = pageTitle.indexOf(' (');
  const company = parenIdx > 0 ? pageTitle.slice(0, parenIdx) : '';
  const publishedAt = formatPublishedAt(ts);

  return (
    <>
      <Stack.Screen
        options={{
          title: company || 'Raport',
          headerBackTitle: 'Wstecz',
        }}
      />
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.textSecondary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : detail ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Full title as a clean heading */}
          <Text style={styles.reportTitle}>{pageTitle}</Text>

          {/* Metadata row: type badge + publication timestamp */}
          {(type || publishedAt) ? (
            <View style={styles.meta}>
              {type ? (
                <Text
                  style={[
                    styles.typeBadge,
                    { backgroundColor: type === 'EBI' ? colors.ebi : colors.espi },
                  ]}
                >
                  {type}
                </Text>
              ) : null}
              {publishedAt ? <Text style={styles.publishedAt}>{publishedAt}</Text> : null}
            </View>
          ) : null}

          {/* Body — each line is a field entry, rendered as its own block */}
          {detail.body
            ? detail.body.split('\n').map((line, i) => {
                const colonIdx = line.indexOf(':');
                if (colonIdx > 0 && colonIdx < 45) {
                  const label = line.slice(0, colonIdx).trim();
                  const value = line.slice(colonIdx + 1).trim();
                  return (
                    <View key={i} style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>{label}</Text>
                      {value ? (
                        <Text style={styles.fieldValue}>{value}</Text>
                      ) : null}
                    </View>
                  );
                }
                return (
                  <Text key={i} style={styles.bodyLine}>
                    {line}
                  </Text>
                );
              })
            : null}
        </ScrollView>
      ) : null}
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
  errorText: {
    fontSize: typography.fontSizeMD,
    color: colors.error,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  reportTitle: {
    fontSize: typography.fontSizeLG,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    lineHeight: typography.lineHeightRelaxed,
    marginBottom: spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeBadge: {
    fontSize: typography.fontSizeXS,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.surface,
    backgroundColor: colors.espi,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  publishedAt: {
    fontSize: typography.fontSizeSM,
    color: colors.textMuted,
  },
  fieldRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: typography.fontSizeXS,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: typography.fontSizeMD,
    color: colors.textPrimary,
    lineHeight: typography.lineHeightNormal,
  },
  bodyLine: {
    fontSize: typography.fontSizeMD,
    color: colors.textPrimary,
    lineHeight: typography.lineHeightRelaxed,
  },
});
