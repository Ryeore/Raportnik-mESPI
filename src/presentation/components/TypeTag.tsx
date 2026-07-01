import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ReportType } from '../../domain/models/FinancialReport';
import { colors, typography, spacing, radius } from '../theme/tokens';

interface TypeTagProps {
  type: ReportType;
}

export function TypeTag({ type }: TypeTagProps) {
  const isEspi = type === ReportType.ESPI;
  return (
    <View
      style={[
        styles.tag,
        { borderColor: isEspi ? colors.espi : colors.ebi },
      ]}
    >
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    width: 3,
    borderRadius: radius.sm,
    alignSelf: 'stretch',
    borderLeftWidth: 3,
    marginRight: spacing.sm,
  },
});
