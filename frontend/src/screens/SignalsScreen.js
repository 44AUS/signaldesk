// Signals Screen - AI Trading Signals List
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSubscription } from '../context/SubscriptionContext';
import { signalsAPI, assetsAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const TIMEFRAMES = ['Scalp', 'Intraday', 'Swing'];

const SignalsScreen = ({ navigation }) => {
  const { isSubscribed } = useSubscription();
  const [signals, setSignals] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Intraday');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSignals = useCallback(async () => {
    try {
      const response = await signalsAPI.getAll(20);
      setSignals(response.data.signals || []);
    } catch (error) {
      console.error('Error fetching signals:', error);
    }
  }, []);

  const fetchAssets = useCallback(async () => {
    try {
      const response = await assetsAPI.get();
      setAssets(response.data.assets || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      // Fallback assets
      setAssets([
        { symbol: 'BTCUSDT', name: 'Bitcoin', category: 'Crypto' },
        { symbol: 'ETHUSDT', name: 'Ethereum', category: 'Crypto' },
        { symbol: 'SPY', name: 'S&P 500', category: 'Stocks' },
      ]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSignals(), fetchAssets()]).finally(() => setLoading(false));
  }, [fetchSignals, fetchAssets]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSignals();
    setRefreshing(false);
  };

  const generateSignal = async () => {
    if (!isSubscribed) {
      navigation.navigate('Paywall');
      return;
    }

    try {
      setGenerating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const response = await signalsAPI.generate({
        asset: selectedAsset,
        timeframe: selectedTimeframe,
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSignals(prev => [response.data, ...prev]);
      
      // Navigate to detail
      navigation.navigate('SignalDetail', { signal: response.data });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to generate signal. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const renderSignalCard = (signal) => {
    const isBuy = signal.signal === 'BUY';
    const signalColor = isBuy ? colors.buy : colors.sell;
    const signalGlow = isBuy ? colors.buyGlow : colors.sellGlow;

    return (
      <TouchableOpacity
        key={signal.signal_id || signal.id}
        style={styles.signalCard}
        onPress={() => navigation.navigate('SignalDetail', { signal })}
        testID={`signal-card-${signal.signal_id || signal.id}`}
      >
        <LinearGradient
          colors={[signalGlow, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.signalGradient}
        >
          <View style={styles.signalHeader}>
            <View style={styles.assetInfo}>
              <Text style={styles.assetSymbol}>{signal.asset}</Text>
              <View style={[styles.signalBadge, { backgroundColor: signalGlow }]}>
                <Ionicons
                  name={isBuy ? 'trending-up' : 'trending-down'}
                  size={14}
                  color={signalColor}
                />
                <Text style={[styles.signalType, { color: signalColor }]}>
                  {signal.signal}
                </Text>
              </View>
            </View>
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Confidence</Text>
              <Text style={[styles.confidenceValue, { color: signalColor }]}>
                {signal.confidence}%
              </Text>
            </View>
          </View>

          <View style={styles.priceGrid}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>ENTRY</Text>
              <Text style={styles.priceValue}>${signal.entry?.toLocaleString()}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>TAKE PROFIT</Text>
              <Text style={[styles.priceValue, { color: colors.buy }]}>
                ${signal.take_profit?.[0]?.toLocaleString()}
              </Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>STOP LOSS</Text>
              <Text style={[styles.priceValue, { color: colors.sell }]}>
                ${signal.stop_loss?.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.signalFooter}>
            <View style={styles.timeframeBadge}>
              <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.timeframeText}>{signal.timeframe}</Text>
            </View>
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
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.buy} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Signals</Text>
          <Text style={styles.headerSubtitle}>GPT-5.2 Powered Analysis</Text>
        </View>

        {/* Asset Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.assetSelector}
          contentContainerStyle={styles.assetSelectorContent}
        >
          {assets.map((asset) => (
            <TouchableOpacity
              key={asset.symbol}
              style={[
                styles.assetChip,
                selectedAsset === asset.symbol && styles.assetChipActive,
              ]}
              onPress={() => setSelectedAsset(asset.symbol)}
              testID={`asset-${asset.symbol}`}
            >
              <Text
                style={[
                  styles.assetChipText,
                  selectedAsset === asset.symbol && styles.assetChipTextActive,
                ]}
              >
                {asset.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Timeframe Selector */}
        <View style={styles.timeframeSelector}>
          {TIMEFRAMES.map((tf) => (
            <TouchableOpacity
              key={tf}
              style={[
                styles.timeframeChip,
                selectedTimeframe === tf && styles.timeframeChipActive,
              ]}
              onPress={() => setSelectedTimeframe(tf)}
              testID={`timeframe-${tf}`}
            >
              <Text
                style={[
                  styles.timeframeChipText,
                  selectedTimeframe === tf && styles.timeframeChipTextActive,
                ]}
              >
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateSignal}
          disabled={generating}
          testID="generate-signal-btn"
        >
          <LinearGradient
            colors={generating ? [colors.textMuted, colors.textMuted] : [colors.buy, colors.buyDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.generateGradient}
          >
            {generating ? (
              <>
                <ActivityIndicator color={colors.text} style={{ marginRight: spacing.sm }} />
                <Text style={styles.generateText}>Analyzing Markets...</Text>
              </>
            ) : (
              <>
                <Ionicons name="flash" size={20} color={colors.text} />
                <Text style={styles.generateText}>Generate AI Signal</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Signals List */}
        <ScrollView
          style={styles.signalsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.buy}
            />
          }
        >
          {signals.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pulse-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Signals Yet</Text>
              <Text style={styles.emptyDesc}>
                Generate your first AI trading signal above
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.listTitle}>Recent Signals</Text>
              {signals.map(renderSignalCard)}
            </>
          )}
          
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Disclaimer */}
        <View style={styles.disclaimerBar}>
          <Ionicons name="information-circle" size={14} color={colors.textMuted} />
          <Text style={styles.disclaimerText}>Not financial advice</Text>
        </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  assetSelector: {
    maxHeight: 50,
    marginBottom: spacing.sm,
  },
  assetSelectorContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  assetChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  assetChipActive: {
    backgroundColor: colors.buyGlow,
    borderColor: colors.buy,
  },
  assetChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  assetChipTextActive: {
    color: colors.buy,
  },
  timeframeSelector: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timeframeChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeframeChipActive: {
    backgroundColor: colors.electricGlow,
    borderColor: colors.electric,
  },
  timeframeChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timeframeChipTextActive: {
    color: colors.electric,
  },
  generateButton: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.buy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  generateText: {
    ...typography.h4,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  signalsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  listTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  signalCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  signalGradient: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  assetInfo: {
    gap: spacing.sm,
  },
  assetSymbol: {
    ...typography.h3,
    color: colors.text,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  signalType: {
    ...typography.label,
    fontSize: 11,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },
  confidenceValue: {
    ...typography.numericLarge,
    fontSize: 24,
  },
  priceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  priceValue: {
    ...typography.numeric,
    color: colors.text,
  },
  signalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeframeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeframeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.label,
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyDesc: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  disclaimerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: 'absolute',
    bottom: 85,
    left: 0,
    right: 0,
  },
  disclaimerText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    fontSize: 11,
  },
});

export default SignalsScreen;
