import { useState } from "react";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { collection, doc, deleteDoc } from "@react-native-firebase/firestore";
import { useTheme } from "@/hooks/useTheme";
import { auth, firestore } from "@/lib/firebase";

const DELETE_RED = "#DC2626";

export default function DeleteAccountScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setModalVisible(false);
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) return;
      await deleteDoc(doc(collection(firestore, "users"), user.uid));
      await user.delete();
      router.replace("/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/requires-recent-login") {
        setError(t("errors.recentLoginRequired"));
      } else {
        setError(t("errors.somethingWentWrong"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <Animated.View entering={FadeIn.duration(300)}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(22)}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        </Animated.View>

        {/* Card */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(120)}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          {/* Warning icon */}
          <View style={styles.iconCircle}>
            <Ionicons
              name="warning"
              size={moderateScale(40)}
              color={DELETE_RED}
            />
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fonts.bold,
                fontSize: moderateScale(24),
              },
            ]}
          >
            {t("deleteAccount.title")}
          </Text>

          {/* Subtitle */}
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.sm,
                lineHeight: moderateScale(14) * 1.6,
              },
            ]}
          >
            {t("deleteAccount.subtitle")}
          </Text>

          {/* Info cards */}
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {t("deleteAccount.impactLabel")}
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t("deleteAccount.impactValue")}
              </Text>
            </View>

            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.medium,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {t("deleteAccount.statusLabel")}
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.typography.fonts.bold,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t("deleteAccount.statusValue")}
              </Text>
            </View>
          </View>

          {/* Error */}
          {error && (
            <Text
              style={[
                styles.errorText,
                {
                  color: DELETE_RED,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {error}
            </Text>
          )}

          {/* Delete Account button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading}
            onPress={() => setModalVisible(true)}
            style={[styles.deleteBtn, { borderRadius: theme.radius.pill }]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons
                  name="trash-outline"
                  size={moderateScale(18)}
                  color="#FFFFFF"
                />
                <Text
                  style={[
                    styles.deleteBtnText,
                    {
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: theme.typography.sizes.md,
                    },
                  ]}
                >
                  {t("deleteAccount.deleteButton")}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Cancel button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={[
              styles.cancelBtn,
              {
                backgroundColor: theme.colors.background,
                borderRadius: theme.radius.pill,
              },
            ]}
          >
            <Text
              style={[
                styles.cancelBtnText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.md,
                },
              ]}
            >
              {t("deleteAccount.cancel")}
            </Text>
          </TouchableOpacity>

          {/* Footer note */}
          <Text
            style={[
              styles.footerNote,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fonts.regular,
                fontSize: theme.typography.sizes.xs,
                lineHeight: moderateScale(12) * 1.6,
              },
            ]}
          >
            {t("deleteAccount.footerNote")}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Confirmation modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.xl,
              },
            ]}
          >
            <View style={styles.modalIconCircle}>
              <Ionicons
                name="warning"
                size={moderateScale(28)}
                color={DELETE_RED}
              />
            </View>
            <Text
              style={[
                styles.modalTitle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: theme.typography.sizes.xl,
                },
              ]}
            >
              {t("deleteAccount.confirmTitle")}
            </Text>
            <Text
              style={[
                styles.modalBody,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {t("deleteAccount.confirmBody")}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleDelete}
              style={[
                styles.modalDeleteBtn,
                { borderRadius: theme.radius.pill },
              ]}
            >
              <Text
                style={[
                  styles.modalDeleteBtnText,
                  {
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t("deleteAccount.confirmYes")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setModalVisible(false)}
              style={[
                styles.modalCancelBtn,
                {
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalCancelBtnText,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fonts.semiBold,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                {t("deleteAccount.confirmCancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(40),
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(24),
  },
  card: {
    borderWidth: 1,
    padding: scale(24),
    alignItems: "center",
    gap: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.06,
    shadowRadius: moderateScale(12),
    elevation: 3,
  },
  iconCircle: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: "rgba(220,38,38,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(4),
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    maxWidth: scale(280),
  },
  infoRow: {
    flexDirection: "row",
    gap: scale(12),
    width: "100%",
    marginVertical: verticalScale(4),
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    padding: scale(14),
    gap: verticalScale(4),
  },
  infoLabel: {
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  infoValue: {},
  errorText: {
    textAlign: "center",
  },
  deleteBtn: {
    width: "100%",
    height: verticalScale(52),
    backgroundColor: DELETE_RED,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
  },
  deleteBtnText: {
    color: "#FFFFFF",
  },
  cancelBtn: {
    width: "100%",
    height: verticalScale(52),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {},
  footerNote: {
    textAlign: "center",
    maxWidth: scale(260),
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(32),
  },
  modalCard: {
    width: "100%",
    padding: scale(24),
    alignItems: "center",
    gap: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(8) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(20),
    elevation: 10,
  },
  modalIconCircle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: "rgba(220,38,38,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(4),
  },
  modalTitle: {
    textAlign: "center",
  },
  modalBody: {
    textAlign: "center",
    maxWidth: scale(240),
    lineHeight: moderateScale(14) * 1.6,
  },
  modalDeleteBtn: {
    width: "100%",
    height: verticalScale(48),
    backgroundColor: DELETE_RED,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(4),
  },
  modalDeleteBtnText: {
    color: "#FFFFFF",
  },
  modalCancelBtn: {
    width: "100%",
    height: verticalScale(48),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  modalCancelBtnText: {},
});
