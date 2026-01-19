// Dashboard Screen - SignalDesk AI Main Home
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { dashboardAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { isSubscribed, subscription } = useSubscription();
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await dashboardAPI.get();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      // Set mock data for demo
      setDashboardData({
        active_signals: 3,
        total_signals: 47,
        ai_confidence: 82,
        recent_signals: [],
        last_signal_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

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
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'Trader'}</Text>
            </View>
            <TouchableOpacity style={styles.alertButton} testID="alerts-btn">
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
              <View style={styles.alertBadge} />
            </TouchableOpacity>
          </View>

          {/* Subscription Status */}
          <TouchableOpacity
            style={styles.subscriptionCard}
            onPress={() => navigation.navigate('Paywall')}
            testID="subscription-card"
          >
            <LinearGradient
              colors={isSubscribed ? [colors.buyGlow, 'transparent'] : [colors.goldGlow, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subscriptionGradient}
            >
              <View style={styles.subscriptionContent}>
                <View style={styles.subscriptionIcon}>
                  <Ionicons
                    name={isSubscribed ? 'shield-checkmark' : 'diamond'}
                    size={24}
                    color={isSubscribed ? colors.buy : colors.gold}
                  />
                </View>
                <View style={styles.subscriptionInfo}>
                  <Text style={styles.subscriptionTitle}>
                    {isSubscribed ? 'Premium Active' : 'Upgrade to Premium'}
                  </Text>
                  <Text style={styles.subscriptionDesc}>
                    {isSubscribed
                      ? `Access until ${new Date(subscription?.expires_at).toLocaleDateString()}`
                      : 'Unlock all AI trading signals'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardLarge]}>
              <LinearGradient
                colors={[colors.buyGlow, 'transparent']}
                style={styles.statGradient}
              >
                <Text style={styles.statLabel}>AI CONFIDENCE</Text>
                <Text style={styles.statValueLarge}>{dashboardData?.ai_confidence || 0}%</Text>
                <View style={styles.confidenceBar}>
                  <View
                    style={[
                      styles.confidenceFill,
                      { width: `${dashboardData?.ai_confidence || 0}%` },
                    ]}
                  />
                </View>
              </LinearGradient>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="pulse" size={20} color={colors.buy} />
                </View>
                <Text style={styles.statValue}>{dashboardData?.active_signals || 0}</Text>
                <Text style={styles.statLabel}>ACTIVE SIGNALS</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.electricGlow }]}>
                  <Ionicons name="analytics" size={20} color={colors.electric} />
                </View>
                <Text style={styles.statValue}>{dashboardData?.total_signals || 0}</Text>
                <Text style={styles.statLabel}>TOTAL SIGNALS</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('Signals')}
                testID="view-signals-btn"
              >
                <LinearGradient
                  colors={[colors.card, colors.cardHighlight]}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: colors.buyGlow }]}>
                    <Ionicons name="flash" size={24} color={colors.buy} />
                  </View>
                  <Text style={styles.actionTitle}>Generate Signal</Text>
                  <Text style={styles.actionDesc}>Get AI predictions</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('Performance')}
                testID="view-performance-btn"
              >
                <LinearGradient
                  colors={[colors.card, colors.cardHighlight]}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: colors.goldGlow }]}>
                    <Ionicons name="stats-chart" size={24} color={colors.gold} />
                  </View>
                  <Text style={styles.actionTitle}>Performance</Text>
                  <Text style={styles.actionDesc}>View win rate</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Last Update */}
          <View style={styles.lastUpdate}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={styles.lastUpdateText}>
              Last signal: {formatTime(dashboardData?.last_signal_at)}
            </Text>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
            <Text style={styles.disclaimerText}>
              Not financial advice. Trading involves substantial risk of loss.
            </Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
  },
  alertButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.buy,
  },
  subscriptionCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  subscriptionGradient: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 2,
  },
  subscriptionDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statsGrid: {
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardLarge: {
    padding: 0,
    overflow: 'hidden',
  },
  statGradient: {
    padding: spacing.lg,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.buyGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.numericLarge,
    color: colors.text,
  },
  statValueLarge: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'monospace',
    marginVertical: spacing.sm,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: colors.cardHighlight,
    borderRadius: 3,
    marginTop: spacing.sm,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: colors.buy,
    borderRadius: 3,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 2,
  },
  actionDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  lastUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  lastUpdateText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  disclaimerText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    fontSize: 11,
  },
});

export default DashboardScreen;
