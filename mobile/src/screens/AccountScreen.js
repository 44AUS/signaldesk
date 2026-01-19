// Account Screen - User profile and subscription management
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

const AccountScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { subscription, isSubscribed, cancelSubscription, restorePurchases, loading } = useSubscription();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your premium subscription?',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelSubscription();
            if (result.success) {
              Alert.alert('Success', 'Your subscription has been cancelled.');
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    const result = await restorePurchases();
    if (result.success) {
      Alert.alert('Success', 'Purchases restored successfully.');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const MenuItem = ({ icon, iconColor, title, subtitle, onPress, showChevron = true, danger = false }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} testID={`menu-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <View style={[styles.menuIcon, { backgroundColor: danger ? colors.sellGlow : `${iconColor}20` }]}>
        <Ionicons name={icon} size={20} color={danger ? colors.sell : iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, danger && { color: colors.sell }]}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Account</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={[colors.buyGlow, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileGradient}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Trader'}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Subscription Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <TouchableOpacity
              style={styles.subscriptionCard}
              onPress={() => navigation.navigate('Paywall')}
              testID="subscription-card"
            >
              <View style={styles.subscriptionContent}>
                <View style={[
                  styles.subscriptionIcon,
                  { backgroundColor: isSubscribed ? colors.buyGlow : colors.goldGlow }
                ]}>
                  <Ionicons
                    name={isSubscribed ? 'shield-checkmark' : 'diamond'}
                    size={24}
                    color={isSubscribed ? colors.buy : colors.gold}
                  />
                </View>
                <View style={styles.subscriptionInfo}>
                  <Text style={styles.subscriptionTitle}>
                    {isSubscribed ? 'Premium Active' : 'Free Plan'}
                  </Text>
                  <Text style={styles.subscriptionDesc}>
                    {isSubscribed
                      ? `Expires: ${new Date(subscription?.expires_at).toLocaleDateString()}`
                      : 'Upgrade to access all signals'}
                  </Text>
                  {subscription?.mock && (
                    <View style={styles.mockBadge}>
                      <Text style={styles.mockText}>MOCK</Text>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.subscriptionPricing}>
                <Text style={styles.pricingLabel}>$49.99/month</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Account Menu */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="person-outline"
                iconColor={colors.electric}
                title="Edit Profile"
                subtitle="Update your information"
                onPress={() => Alert.alert('Edit Profile', 'Coming soon!')}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon="notifications-outline"
                iconColor={colors.gold}
                title="Notifications"
                subtitle="Push notification settings"
                onPress={() => Alert.alert('Notifications', 'Coming soon!')}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon="refresh-outline"
                iconColor={colors.purple}
                title="Restore Purchases"
                subtitle="Recover your subscription"
                onPress={handleRestorePurchases}
              />
            </View>
          </View>

          {/* Subscription Management */}
          {isSubscribed && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Manage Subscription</Text>
              <View style={styles.menuCard}>
                <MenuItem
                  icon="close-circle-outline"
                  iconColor={colors.sell}
                  title="Cancel Subscription"
                  subtitle="Your access will continue until expiry"
                  onPress={handleCancelSubscription}
                  danger
                />
              </View>
            </View>
          )}

          {/* Legal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="document-text-outline"
                iconColor={colors.textSecondary}
                title="Terms of Service"
                onPress={() => Alert.alert('Terms of Service', 'View our terms at signaldesk.ai/terms')}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon="shield-outline"
                iconColor={colors.textSecondary}
                title="Privacy Policy"
                onPress={() => Alert.alert('Privacy Policy', 'View our policy at signaldesk.ai/privacy')}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon="warning-outline"
                iconColor={colors.warning}
                title="Risk Disclaimer"
                onPress={() => Alert.alert(
                  'Risk Disclaimer',
                  'Trading cryptocurrencies, stocks, forex, and other financial instruments involves substantial risk of loss and is not suitable for every investor. The signals provided by SignalDesk AI are for informational purposes only and do not constitute financial advice. Past performance does not guarantee future results.'
                )}
              />
            </View>
          </View>

          {/* Sign Out */}
          <View style={styles.section}>
            <View style={styles.menuCard}>
              <MenuItem
                icon="log-out-outline"
                iconColor={colors.sell}
                title="Sign Out"
                onPress={handleLogout}
                showChevron={false}
                danger
              />
            </View>
          </View>

          {/* App Version */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SignalDesk AI v1.0.0</Text>
            <Text style={styles.footerSubtext}>Powered by GPT-5.2</Text>
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
  profileCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.buy,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h3,
    color: colors.text,
  },
  profileEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  subscriptionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
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
  },
  subscriptionDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.goldGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  mockText: {
    ...typography.label,
    color: colors.gold,
    fontSize: 10,
  },
  subscriptionPricing: {
    backgroundColor: colors.cardHighlight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  pricingLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...typography.body,
    color: colors.text,
  },
  menuSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  footerSubtext: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 10,
  },
});

export default AccountScreen;
