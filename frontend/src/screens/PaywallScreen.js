// Paywall Screen - Subscription modal with RevenueCat mock
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const FEATURES = [
  {
    icon: 'flash',
    title: 'Unlimited AI Signals',
    description: 'Generate unlimited trading signals powered by GPT-5.2',
  },
  {
    icon: 'analytics',
    title: 'Real-time Analysis',
    description: 'Get instant market insights with AI confidence scores',
  },
  {
    icon: 'notifications',
    title: 'Push Alerts',
    description: 'Receive alerts when signals hit TP or SL levels',
  },
  {
    icon: 'shield-checkmark',
    title: 'Risk Management',
    description: 'Every signal includes stop-loss and take-profit levels',
  },
  {
    icon: 'trending-up',
    title: 'Multi-Asset Coverage',
    description: 'Crypto, stocks, forex, and commodities signals',
  },
  {
    icon: 'stats-chart',
    title: 'Performance Tracking',
    description: 'Track your win rate and trading history',
  },
];

const PaywallScreen = ({ navigation }) => {
  const { offerings, purchasePackage, restorePurchases, loading, isSubscribed } = useSubscription();
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (isSubscribed) {
      navigation.goBack();
      return;
    }

    setPurchasing(true);
    try {
      const monthlyPackage = offerings?.current?.availablePackages?.[0];
      const result = await purchasePackage(monthlyPackage);
      
      if (result.success) {
        Alert.alert(
          'Welcome to Premium! 🎉',
          'You now have access to all AI trading signals.',
          [{ text: 'Start Trading', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Purchase Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    const result = await restorePurchases();
    if (result.success) {
      Alert.alert('Success', 'Purchases restored successfully.');
    } else {
      Alert.alert('Error', 'No purchases found to restore.');
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          testID="close-paywall-btn"
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.premiumBadge}>
              <Ionicons name="diamond" size={40} color={colors.gold} />
            </View>
            <Text style={styles.title}>SignalDesk Premium</Text>
            <Text style={styles.subtitle}>
              Unlock the full power of AI trading signals
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={20} color={colors.buy} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing Card */}
          <View style={styles.pricingCard}>
            <LinearGradient
              colors={[colors.buyGlow, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pricingGradient}
            >
              <View style={styles.pricingBadge}>
                <Text style={styles.pricingBadgeText}>MOST POPULAR</Text>
              </View>
              <Text style={styles.pricingTitle}>Monthly Premium</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceAmount}>$49.99</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>
              <Text style={styles.pricingDesc}>
                Cancel anytime. Billed monthly.
              </Text>
            </LinearGradient>
          </View>

          {/* Mock Notice */}
          <View style={styles.mockNotice}>
            <Ionicons name="information-circle" size={16} color={colors.electric} />
            <Text style={styles.mockText}>
              Demo Mode: RevenueCat mocked for testing. No real charges.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handlePurchase}
            disabled={purchasing || loading}
            testID="subscribe-btn"
          >
            <LinearGradient
              colors={purchasing ? [colors.textMuted, colors.textMuted] : [colors.buy, colors.buyDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              {purchasing ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Ionicons name="diamond" size={20} color={colors.text} />
                  <Text style={styles.subscribeText}>
                    {isSubscribed ? 'Already Subscribed' : 'Subscribe Now'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            testID="restore-purchases-btn"
          >
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By subscribing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
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
  closeButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  premiumBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.goldGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  featuresContainer: {
    marginBottom: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.buyGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  pricingCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  pricingGradient: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.buy,
  },
  pricingBadge: {
    backgroundColor: colors.buy,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  pricingBadgeText: {
    ...typography.label,
    color: colors.text,
    fontSize: 10,
  },
  pricingTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
  },
  pricePeriod: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  pricingDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  mockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.electricGlow,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
  },
  mockText: {
    ...typography.bodySmall,
    color: colors.electric,
    marginLeft: spacing.xs,
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  subscribeButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.buy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  subscribeText: {
    ...typography.h4,
    color: colors.text,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  restoreText: {
    ...typography.bodySmall,
    color: colors.buy,
  },
  termsText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
  },
  termsLink: {
    color: colors.textSecondary,
  },
});

export default PaywallScreen;
