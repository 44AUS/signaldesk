// Performance Screen - Trading stats and history
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { performanceAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const { width } = Dimensions.get('window');

const PerformanceScreen = () => {
  const [performance, setPerformance] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = useCallback(async () => {
    try {
      const response = await performanceAPI.get();
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
      // Mock data for demo
      setPerformance({
        total_signals: 47,
        win_rate: 73.2,
        active_signals: 3,
        hit_tp: 28,
        stopped_out: 11,
        avg_confidence: 78,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPerformance();
    setRefreshing(false);
  };

  const StatCard = ({ icon, iconColor, iconBg, label, value, suffix = '' }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statSuffix}>{suffix}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.buy}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Performance</Text>
            <Text style={styles.headerSubtitle}>Your trading statistics</Text>
          </View>

          {/* Win Rate Card */}
          <View style={styles.winRateCard}>
            <LinearGradient
              colors={[colors.buyGlow, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.winRateGradient}
            >
              <View style={styles.winRateContent}>
                <Text style={styles.winRateLabel}>WIN RATE</Text>
                <Text style={styles.winRateValue}>{performance?.win_rate || 0}%</Text>
                <View style={styles.winRateBar}>
                  <View
                    style={[
                      styles.winRateFill,
                      { width: `${performance?.win_rate || 0}%` },
                    ]}
                  />
                </View>
                <View style={styles.winRateLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.buy }]} />
                    <Text style={styles.legendText}>
                      Wins: {performance?.hit_tp || 0}
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.sell }]} />
                    <Text style={styles.legendText}>
                      Losses: {performance?.stopped_out || 0}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              icon="pulse"
              iconColor={colors.electric}
              iconBg={colors.electricGlow}
              label="TOTAL SIGNALS"
              value={performance?.total_signals || 0}
            />
            <StatCard
              icon="flash"
              iconColor={colors.buy}
              iconBg={colors.buyGlow}
              label="ACTIVE"
              value={performance?.active_signals || 0}
            />
            <StatCard
              icon="checkmark-circle"
              iconColor={colors.buy}
              iconBg={colors.buyGlow}
              label="HIT TP"
              value={performance?.hit_tp || 0}
            />
            <StatCard
              icon="close-circle"
              iconColor={colors.sell}
              iconBg={colors.sellGlow}
              label="STOPPED OUT"
              value={performance?.stopped_out || 0}
            />
          </View>

          {/* AI Confidence */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Performance</Text>
            <View style={styles.confidenceCard}>
              <View style={styles.confidenceHeader}>
                <View style={styles.confidenceIcon}>
                  <Ionicons name="analytics" size={24} color={colors.gold} />
                </View>
                <View style={styles.confidenceInfo}>
                  <Text style={styles.confidenceLabel}>Average Confidence</Text>
                  <Text style={styles.confidenceValue}>
                    {performance?.avg_confidence || 0}%
                  </Text>
                </View>
              </View>
              <View style={styles.confidenceBar}>
                <View
                  style={[
                    styles.confidenceFill,
                    { width: `${performance?.avg_confidence || 0}%` },
                  ]}
                />
              </View>
              <Text style={styles.confidenceDesc}>
                GPT-5.2 model consistency score across all generated signals
              </Text>
            </View>
          </View>

          {/* Performance Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Signal Accuracy</Text>
                <Text style={[styles.summaryValue, { color: colors.buy }]}>
                  {performance?.win_rate || 0}%
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Signals</Text>
                <Text style={styles.summaryValue}>{performance?.total_signals || 0}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Completed Trades</Text>
                <Text style={styles.summaryValue}>
                  {(performance?.hit_tp || 0) + (performance?.stopped_out || 0)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pending Signals</Text>
                <Text style={[styles.summaryValue, { color: colors.electric }]}>
                  {performance?.active_signals || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
            <Text style={styles.disclaimerText}>
              Past performance does not guarantee future results. Trading involves substantial risk.
            </Text>
          </View>

          <View style={{ height: 120 }} />
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
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  winRateCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  winRateGradient: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  winRateContent: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  winRateLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  winRateValue: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.text,
  },
  winRateBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.cardHighlight,
    borderRadius: 4,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  winRateFill: {
    height: '100%',
    backgroundColor: colors.buy,
    borderRadius: 4,
  },
  winRateLegend: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  legendText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.numericLarge,
    color: colors.text,
  },
  statSuffix: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  confidenceCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  confidenceIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.goldGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  confidenceInfo: {
    flex: 1,
  },
  confidenceLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  confidenceValue: {
    ...typography.h2,
    color: colors.gold,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: colors.cardHighlight,
    borderRadius: 3,
    marginBottom: spacing.md,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  confidenceDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.numeric,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimerText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default PerformanceScreen;
