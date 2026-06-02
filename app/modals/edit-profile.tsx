import type { AppTheme } from "@/constants/themes";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useTheme } from "@/hooks/useTheme";
import { auth, firestore } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { updateProfile } from "@react-native-firebase/auth";
import { collection, doc, setDoc } from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function EditProfileScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const user = auth.currentUser;
  const { profile, updateProfile: updateCtxProfile } = useUserProfile();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const email = user?.email ?? "";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName ?? "");
    setBio(profile.bio);
    setTitle(profile.title);
    setIndustry(profile.industry);
    setAudience(profile.audience);
    setTopics(profile.topics);
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      const patch = {
        bio: bio.trim(),
        title: title.trim(),
        industry: industry.trim(),
        audience: audience.trim(),
        topics,
      };
      await setDoc(doc(collection(firestore, "users"), user.uid), patch, {
        merge: true,
      });
      updateCtxProfile(patch);
      router.back();
    } catch (err) {
      console.error("[EditProfile] Save error:", err);
      setError(t("errors.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddTopic = () => {
    const val = topicInput.trim().replace(/,$/, "");
    if (val && !topics.includes(val)) {
      setTopics((prev) => [...prev, val]);
    }
    setTopicInput("");
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics((prev) => prev.filter((t) => t !== topic));
  };

  const handleChangePhoto = () => {
    Alert.alert(t("common.comingSoon"), t("editProfile.comingSoonMessage"));
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons
                name="arrow-back"
                size={moderateScale(22)}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fonts.bold,
                  fontSize: theme.typography.sizes.lg,
                },
              ]}
            >
              {t("editProfile.title")}
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.saveBtn, { borderRadius: theme.radius.pill }]}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text
                    style={[
                      styles.saveBtnText,
                      {
                        fontFamily: theme.typography.fonts.semiBold,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {t("editProfile.save")}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Avatar */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            style={styles.avatarSection}
          >
            <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.8}>
              <View style={styles.avatarRingWrapper}>
                <LinearGradient
                  colors={theme.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.avatarRing,
                    { borderRadius: moderateScale(52) },
                  ]}
                >
                  {user?.photoURL ? (
                    <Image
                      source={{ uri: user.photoURL }}
                      style={[
                        styles.avatarImage,
                        { borderRadius: moderateScale(46) },
                      ]}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.avatarInitials,
                        {
                          color: "#FFFFFF",
                          fontFamily: theme.typography.fonts.bold,
                          fontSize: theme.typography.sizes.xxl,
                        },
                      ]}
                    >
                      {initials}
                    </Text>
                  )}
                </LinearGradient>
                {/* Camera badge */}
                <LinearGradient
                  colors={theme.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.cameraBadge,
                    {
                      borderRadius: moderateScale(14),
                      borderColor: theme.colors.background,
                    },
                  ]}
                >
                  <Ionicons
                    name="camera"
                    size={moderateScale(12)}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </View>
            </TouchableOpacity>
            <Text
              style={[
                styles.changePhotoText,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fonts.semiBold,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {t("editProfile.changePhoto")}
            </Text>
          </Animated.View>

          {/* Loading */}
          {loading && (
            <ActivityIndicator
              color={theme.colors.primary}
              style={{ marginVertical: verticalScale(20) }}
            />
          )}

          {/* Form card */}
          {!loading && (
            <>
              <Animated.View
                entering={FadeInDown.duration(400).delay(200)}
                style={[
                  styles.formCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderRadius: theme.radius.xl,
                  },
                ]}
              >
                <FormField
                  label={t("editProfile.fullName")}
                  value={displayName}
                  onChangeText={setDisplayName}
                  icon="person-outline"
                  returnKeyType="next"
                  theme={theme}
                />
                <FieldDivider theme={theme} />
                <FormField
                  label={t("editProfile.emailAddress")}
                  value={email}
                  icon="mail-outline"
                  editable={false}
                  keyboardType="email-address"
                  theme={theme}
                />
                <FieldDivider theme={theme} />
                <FormField
                  label={t("editProfile.bio")}
                  value={bio}
                  onChangeText={setBio}
                  icon="document-text-outline"
                  multiline
                  numberOfLines={4}
                  theme={theme}
                />
                <FieldDivider theme={theme} />
                <FormField
                  label={t("editProfile.titleField")}
                  value={title}
                  onChangeText={setTitle}
                  icon="briefcase-outline"
                  placeholder={t("editProfile.titlePlaceholder")}
                  returnKeyType="next"
                  theme={theme}
                />
                <FieldDivider theme={theme} />
                <FormField
                  label={t("editProfile.industry")}
                  value={industry}
                  onChangeText={setIndustry}
                  icon="business-outline"
                  placeholder={t("editProfile.industryPlaceholder")}
                  returnKeyType="next"
                  theme={theme}
                />
                <FieldDivider theme={theme} />
                <FormField
                  label={t("editProfile.audience")}
                  value={audience}
                  onChangeText={setAudience}
                  icon="people-outline"
                  placeholder={t("editProfile.audiencePlaceholder")}
                  returnKeyType="next"
                  theme={theme}
                />
                <FieldDivider theme={theme} />
                {/* Topics tag input */}
                <View style={styles.fieldWrapper}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      {
                        color: theme.colors.textSecondary,
                        fontFamily: theme.typography.fonts.medium,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    {t("editProfile.topics")}
                  </Text>
                  {topics.length > 0 && (
                    <View style={styles.topicPills}>
                      {topics.map((topic) => (
                        <TouchableOpacity
                          key={topic}
                          activeOpacity={0.7}
                          onPress={() => handleRemoveTopic(topic)}
                          style={[
                            styles.topicPill,
                            {
                              backgroundColor: theme.colors.surfaceHigh,
                              borderColor: theme.colors.border,
                              borderRadius: theme.radius.pill,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.topicPillText,
                              {
                                color: theme.colors.primary,
                                fontFamily: theme.typography.fonts.medium,
                                fontSize: theme.typography.sizes.xs,
                              },
                            ]}
                          >
                            {topic}
                          </Text>
                          <Ionicons
                            name="close"
                            size={moderateScale(12)}
                            color={theme.colors.primary}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <View style={styles.fieldRow}>
                    <Ionicons
                      name="pricetag-outline"
                      size={moderateScale(16)}
                      color={theme.colors.textSecondary}
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      value={topicInput}
                      onChangeText={(v) => {
                        if (v.endsWith(",")) {
                          handleAddTopic();
                        } else {
                          setTopicInput(v);
                        }
                      }}
                      onSubmitEditing={handleAddTopic}
                      placeholder={t("editProfile.topicsPlaceholder")}
                      placeholderTextColor={theme.colors.textSecondary + "80"}
                      returnKeyType="done"
                      underlineColorAndroid="transparent"
                      style={[
                        styles.textInput,
                        {
                          color: theme.colors.textPrimary,
                          fontFamily: theme.typography.fonts.regular,
                          fontSize: theme.typography.sizes.md,
                        },
                      ]}
                    />
                  </View>
                </View>
              </Animated.View>

              {/* AI Writing Style (read-only) */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(260)}
                style={[
                  styles.formCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderRadius: theme.radius.xl,
                    marginTop: verticalScale(16),
                  },
                ]}
              >
                <View style={styles.fieldWrapper}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      {
                        color: theme.colors.textSecondary,
                        fontFamily: theme.typography.fonts.medium,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    {t("editProfile.writingStyleSection")}
                  </Text>
                  {profile.writingStyle ? (
                    <Text
                      style={[
                        styles.writingStyleText,
                        {
                          color: theme.colors.textPrimary,
                          fontFamily: theme.typography.fonts.regular,
                          fontSize: theme.typography.sizes.sm,
                        },
                      ]}
                    >
                      {profile.writingStyle}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.writingStyleText,
                        {
                          color: theme.colors.textSecondary,
                          fontFamily: theme.typography.fonts.regular,
                          fontSize: theme.typography.sizes.sm,
                          fontStyle: "italic",
                        },
                      ]}
                    >
                      {t("editProfile.writingStylePending")}
                    </Text>
                  )}
                </View>
              </Animated.View>
            </>
          )}

          {/* Error */}
          {error && (
            <Text
              style={[
                styles.errorText,
                {
                  color: theme.colors.error,
                  fontFamily: theme.typography.fonts.regular,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {error}
            </Text>
          )}

          {/* Delete Profile */}
          <Animated.View entering={FadeInDown.duration(400).delay(320)}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/modals/delete-account")}
              style={[
                styles.deleteBtn,
                {
                  backgroundColor: theme.colors.error + "15",
                  borderColor: theme.colors.error + "40",
                  borderRadius: theme.radius.xl,
                },
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={moderateScale(18)}
                color={theme.colors.error}
              />
              <View style={styles.deleteBtnContent}>
                <Text
                  style={[
                    styles.deleteBtnTitle,
                    {
                      color: theme.colors.error,
                      fontFamily: theme.typography.fonts.semiBold,
                      fontSize: theme.typography.sizes.md,
                    },
                  ]}
                >
                  {t("editProfile.deleteProfile")}
                </Text>
                <Text
                  style={[
                    styles.deleteBtnWarning,
                    {
                      color: theme.colors.error,
                      fontFamily: theme.typography.fonts.regular,
                      fontSize: theme.typography.sizes.xs,
                      opacity: 0.7,
                    },
                  ]}
                >
                  {t("editProfile.deleteWarning")}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function FieldDivider({ theme }: { theme: AppTheme }) {
  return (
    <View
      style={[styles.fieldDivider, { backgroundColor: theme.colors.border }]}
    />
  );
}

function FormField({
  label,
  value,
  onChangeText,
  editable = true,
  multiline = false,
  numberOfLines,
  placeholder,
  icon,
  keyboardType,
  returnKeyType,
  theme,
}: {
  label: string;
  value: string;
  onChangeText?: (t: string) => void;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  placeholder?: string;
  icon: IconName;
  keyboardType?: "default" | "email-address";
  returnKeyType?: "next" | "done";
  theme: AppTheme;
}) {
  return (
    <View style={[styles.fieldWrapper, !editable && styles.fieldDisabled]}>
      <Text
        style={[
          styles.fieldLabel,
          {
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fonts.medium,
            fontSize: theme.typography.sizes.xs,
          },
        ]}
      >
        {label}
      </Text>
      <View style={multiline ? styles.fieldRowMultiline : styles.fieldRow}>
        <Ionicons
          name={icon}
          size={moderateScale(16)}
          color={theme.colors.textSecondary}
          style={multiline ? styles.fieldIconMultiline : styles.fieldIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary + "80"}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          underlineColorAndroid="transparent"
          style={[
            multiline ? styles.textInputMultiline : styles.textInput,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.regular,
              fontSize: theme.typography.sizes.md,
            },
          ]}
        />
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(120),
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  saveBtn: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    minWidth: scale(56),
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
  },
  // Avatar
  avatarSection: {
    alignItems: "center",
    marginVertical: verticalScale(24),
  },
  avatarRingWrapper: {
    position: "relative",
  },
  avatarRing: {
    width: moderateScale(104),
    height: moderateScale(104),
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(3),
  },
  avatarImage: {
    width: moderateScale(98),
    height: moderateScale(98),
  },
  avatarInitials: {},
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: moderateScale(28),
    height: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  changePhotoText: {
    letterSpacing: 1.2,
    marginTop: verticalScale(10),
  },
  // Form
  formCard: {
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(8),
    elevation: 2,
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: scale(40),
  },
  fieldWrapper: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(10),
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  fieldLabel: {
    letterSpacing: 1.0,
    marginBottom: verticalScale(6),
    textTransform: "uppercase",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldRowMultiline: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  fieldIcon: {
    marginRight: scale(8),
  },
  fieldIconMultiline: {
    marginRight: scale(8),
    marginTop: verticalScale(3),
  },
  textInput: {
    flex: 1,
  },
  textInputMultiline: {
    flex: 1,
    textAlignVertical: "top",
    minHeight: verticalScale(90),
  },
  // Topics
  topicPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(6),
    marginBottom: verticalScale(10),
  },
  topicPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderWidth: 1,
  },
  topicPillText: {},
  // Writing style
  writingStyleText: {
    lineHeight: moderateScale(22),
    marginTop: verticalScale(4),
  },
  // Error
  errorText: {
    textAlign: "center",
    marginTop: verticalScale(12),
  },
  // Delete
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    borderWidth: 1,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
  },
  deleteBtnContent: {
    flex: 1,
    gap: verticalScale(2),
  },
  deleteBtnTitle: {},
  deleteBtnWarning: {},
});
