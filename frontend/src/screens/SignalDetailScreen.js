// Signal Detail Screen - Expanded signal breakdown
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const { width } = Dimensions.get('window');

const SignalDetailScreen = ({ route, navigation }) => {
  const { signal } = route.params;
  const isBuy = signal.signal === 'BUY';
  const signalColor = isBuy ? colors.buy : colors.sell;
  const signalGlow = isBuy ? colors.buyGlow : colors.sellGlow;

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            testID="back-btn"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Signal Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Signal Badge */}
          <View style={styles.signalHeader}>
            <LinearGradient
              colors={[signalGlow, 'transparent']}
              style={styles.signalBadgeContainer}
            >
              <View style={styles.signalBadge}>
                <Ionicons
                  name={isBuy ? 'trending-up' : 'trending-down'}
                  size={32}
                  color={signalColor}
                />
              </View>
              <View style={styles.signalInfo}>
                <Text style={styles.assetName}>{signal.asset}</Text>
                <Text style={[styles.signalType, { color: signalColor }]}>
                  {signal.signal} SIGNAL
                </Text>
              </View>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceLabel}>AI Confidence</Text>
                <Text style={[styles.confidenceValue, { color: signalColor }]}>
                  {signal.confidence}%
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Price Levels */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Levels</Text>
            
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <View style={styles.priceIconContainer}>
                  <Ionicons name="enter-outline" size={20} color={colors.electric} />
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceLabel}>Entry Price</Text>
                  <Text style={styles.priceValue}>{formatPrice(signal.entry)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <View style={[styles.priceIconContainer, { backgroundColor: colors.buyGlow }]}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.buy} />
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceLabel}>Take Profit Targets</Text>
                  <View style={styles.tpContainer}>
                    {signal.take_profit?.map((tp, index) => (
                      <View key={index} style={styles.tpBadge}>
                        <Text style={styles.tpLabel}>TP{index + 1}</Text>
                        <Text style={styles.tpValue}>{formatPrice(tp)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <View style={[styles.priceIconContainer, { backgroundColor: colors.sellGlow }]}>
                  <Ionicons name="close-circle-outline" size={20} color={colors.sell} />
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceLabel}>Stop Loss</Text>
                  <Text style={[styles.priceValue, { color: colors.sell }]}>
                    {formatPrice(signal.stop_loss)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Risk/Reward */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Analysis</Text>
            <View style={styles.riskCard}>
              <View style={styles.riskItem}>
                <Text style={styles.riskLabel}>Risk/Reward Ratio</Text>
                <Text style={styles.riskValue}>{signal.risk_reward || '1:2'}</Text>
              </View>
              <View style={styles.riskDivider} />
              <View style={styles.riskItem}>
                <Text style={styles.riskLabel}>Timeframe</Text>
                <Text style={styles.riskValue}>{signal.timeframe}</Text>
              </View>
              <View style={styles.riskDivider} />
              <View style={styles.riskItem}>
                <Text style={styles.riskLabel}>Status</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: signal.status === 'active' ? colors.buyGlow : colors.cardHighlight }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: signal.status === 'active' ? colors.buy : colors.textMuted }
                  ]}>
                    {signal.status?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* AI Reasoning */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Analysis</Text>
            <View style={styles.reasoningCard}>
              <View style={styles.reasoningIcon}>
                <Ionicons name="bulb-outline" size={24} color={colors.gold} />
              </View>
              <Text style={styles.reasoningText}>
                {signal.ai_reasoning || 'Technical analysis indicates favorable conditions for this trade setup based on price action and momentum indicators.'}
              </Text>
            </View>
          </View>

          {/* Timestamps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timing</Text>
            <View style={styles.timeCard}>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={16} color={colors.textMuted} />
                <Text style={styles.timeLabel}>Created</Text>
                <Text style={styles.timeValue}>{formatDate(signal.created_at)}</Text>
              </View>
              <View style={styles.timeRow}>
                <Ionicons name="hourglass-outline" size={16} color={colors.textMuted} />
                <Text style={styles.timeLabel}>Expires</Text>
                <Text style={styles.timeValue}>{formatDate(signal.expires_at)}</Text>
              </View>
            </View>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="warning-outline" size={16} color={colors.warning} />
            <Text style={styles.disclaimerText}>
              This is not financial advice. Trading cryptocurrencies and other assets involves substantial risk of loss. Past performance does not guarantee future results.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  signalHeader: {
    marginBottom: spacing.lg,
  },
  signalBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signalBadge: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  signalInfo: {
    flex: 1,
  },
  assetName: {
    ...typography.h2,
    color: colors.text,
  },
  signalType: {
    ...typography.label,
    marginTop: 2,
  },
  confidenceBadge: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },
  confidenceValue: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  priceCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.electricGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    ...typography.numeric,
    color: colors.text,
    fontSize: 20,
  },
  tpContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  tpBadge: {
    backgroundColor: colors.buyGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tpLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontSize: 10,
  },
  tpValue: {
    ...typography.numeric,
    color: colors.buy,
    fontSize: 14,
  },
  riskCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  riskItem: {
    paddingVertical: spacing.sm,
  },
  riskLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  riskValue: {
    ...typography.h4,
    color: colors.text,
  },
  riskDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: 4,
  },
  statusText: {
    ...typography.label,
    fontSize: 11,
  },
  reasoningCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
  },
  reasoningIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.goldGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reasoningText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  timeCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  timeLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  timeValue: {
    ...typography.bodySmall,
    color: colors.text,
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  disclaimerText: {
    ...typography.bodySmall,
    color: colors.warning,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
});

export default SignalDetailScreen;
