export type ArtistStatus = "lead" | "onboarding" | "active" | "paused" | "cancelled";

export type ReleaseStatus =
  | "draft"
  | "collecting_assets"
  | "distribution"
  | "pre_save"
  | "released"
  | "archived";

export type ContentChannel = "instagram" | "tiktok" | "youtube" | "whatsapp";

export type RagDocumentCategory =
  | "company_process"
  | "artist_profile"
  | "release_checklist"
  | "social_media_guide"
  | "whatsapp_script"
  | "campaign_template"
  | "playlist_pitch"
  | "contract_info"
  | "report"
  | "faq";

export type Artist = {
  id: string;
  artisticName: string;
  legalName?: string;
  city?: string;
  state?: string;
  genre?: string;
  audience?: string;
  toneOfVoice?: string;
  goals?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  status: ArtistStatus;
  createdAt: string;
};

export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "threads"
  | "spotify"
  | "whatsapp";

export type SocialAccountStatus =
  | "not_connected"
  | "connected"
  | "needs_reauth"
  | "disabled";

export type SocialAccount = {
  id: string;
  artistId: string;
  platform: SocialPlatform;
  accountLabel: string;
  username?: string;
  loginEmail?: string;
  status: SocialAccountStatus;
  scopes: string[];
  expiresAt?: string;
  connectedAt?: string;
  createdAt: string;
};

export type PlannedPostStatus =
  | "draft"
  | "waiting_design"
  | "waiting_approval"
  | "approved"
  | "scheduled"
  | "published";

export type DesignAssetStatus =
  | "not_requested"
  | "briefing_ready"
  | "in_design"
  | "received"
  | "approved";

export type PlannedPost = {
  id: string;
  artistId: string;
  releaseId?: string;
  socialAccountId?: string;
  channel: ContentChannel;
  format: string;
  title: string;
  caption?: string;
  script?: string;
  cta?: string;
  hashtags?: string[];
  designBrief?: string;
  designStatus: DesignAssetStatus;
  artworkUrl?: string;
  scheduledFor?: string;
  status: PlannedPostStatus;
  createdAt: string;
};

export type MusicRelease = {
  id: string;
  artistId: string;
  title: string;
  releaseType: "single" | "ep" | "album" | "remix" | "live_session";
  targetDate?: string;
  status: ReleaseStatus;
  audioStatus: "pending" | "received" | "approved";
  coverStatus: "pending" | "received" | "approved";
  technicalSheetStatus: "pending" | "received" | "approved";
  notes?: string;
  createdAt: string;
};
