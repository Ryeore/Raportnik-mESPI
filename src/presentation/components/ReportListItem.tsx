import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { FinancialReport } from '../../domain/models/FinancialReport';
import { TypeTag } from './TypeTag';
import { colors, typography, spacing } from '../theme/tokens';

interface ReportListItemProps {
  report: FinancialReport;
  onPress: (report: FinancialReport) => void;
}

function formatDateTime(date: Date): string {
  const time = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  const day = date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  // strip trailing dot that some locales add to month abbreviations
  return `${day.replace(/\.$/, '')} ${time}`;
}

export function ReportListItem({ report, onPress }: ReportListItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(report)}
      accessibilityRole="button"
      accessibilityLabel={`${report.companyName}, ${report.title}`}
    >
      <TypeTag type={report.reportType} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.company} numberOfLines={1}>
            {report.companyName || report.reportNumber}
          </Text>
          <Text style={styles.time}>{formatDateTime(report.dateTime)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {report.title}
        </Text>
        <Text style={styles.meta}>
          {report.reportType} · {report.reportNumber}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  pressed: {
    backgroundColor: colors.separator,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  company: {
    flex: 1,
    fontSize: typography.fontSizeMD,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  time: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    flexShrink: 0,
  },
  title: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightNormal,
  },
  meta: {
    fontSize: typography.fontSizeXS,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
});
