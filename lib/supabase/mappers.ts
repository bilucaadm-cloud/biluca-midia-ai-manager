import type { Artist, MusicRelease, PlannedPost, SocialAccount } from "@/lib/domain";

type ArtistRow = {
  id: string;
  artistic_name: string;
  legal_name: string | null;
  city: string | null;
  state: string | null;
  genre: string | null;
  audience: string | null;
  tone_of_voice: string | null;
  goals: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  spotify_url: string | null;
  status: Artist["status"];
  created_at: string;
};

type ReleaseRow = {
  id: string;
  artist_id: string;
  title: string;
  release_type: MusicRelease["releaseType"];
  target_date: string | null;
  status: MusicRelease["status"];
  audio_status: MusicRelease["audioStatus"];
  cover_status: MusicRelease["coverStatus"];
  technical_sheet_status: MusicRelease["technicalSheetStatus"];
  notes: string | null;
  created_at: string;
};

type SocialAccountRow = {
  id: string;
  artist_id: string;
  platform: SocialAccount["platform"];
  account_label: string;
  username: string | null;
  login_email: string | null;
  status: SocialAccount["status"];
  scopes: string[] | null;
  expires_at: string | null;
  connected_at: string | null;
  created_at: string;
};

type PlannedPostRow = {
  id: string;
  artist_id: string;
  release_id: string | null;
  social_account_id: string | null;
  channel: PlannedPost["channel"];
  format: string;
  title: string;
  caption: string | null;
  script: string | null;
  cta: string | null;
  hashtags: string[] | null;
  design_brief: string | null;
  design_status: PlannedPost["designStatus"];
  artwork_url: string | null;
  scheduled_for: string | null;
  status: PlannedPost["status"];
  created_at: string;
};

export function mapArtistRow(row: ArtistRow): Artist {
  return {
    id: row.id,
    artisticName: row.artistic_name,
    legalName: row.legal_name ?? undefined,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    genre: row.genre ?? undefined,
    audience: row.audience ?? undefined,
    toneOfVoice: row.tone_of_voice ?? undefined,
    goals: row.goals ?? undefined,
    instagramUrl: row.instagram_url ?? undefined,
    tiktokUrl: row.tiktok_url ?? undefined,
    youtubeUrl: row.youtube_url ?? undefined,
    spotifyUrl: row.spotify_url ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapReleaseRow(row: ReleaseRow): MusicRelease {
  return {
    id: row.id,
    artistId: row.artist_id,
    title: row.title,
    releaseType: row.release_type,
    targetDate: row.target_date ?? undefined,
    status: row.status,
    audioStatus: row.audio_status,
    coverStatus: row.cover_status,
    technicalSheetStatus: row.technical_sheet_status,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapSocialAccountRow(row: SocialAccountRow): SocialAccount {
  return {
    id: row.id,
    artistId: row.artist_id,
    platform: row.platform,
    accountLabel: row.account_label,
    username: row.username ?? undefined,
    loginEmail: row.login_email ?? undefined,
    status: row.status,
    scopes: row.scopes ?? [],
    expiresAt: row.expires_at ?? undefined,
    connectedAt: row.connected_at ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapPlannedPostRow(row: PlannedPostRow): PlannedPost {
  return {
    id: row.id,
    artistId: row.artist_id,
    releaseId: row.release_id ?? undefined,
    socialAccountId: row.social_account_id ?? undefined,
    channel: row.channel,
    format: row.format,
    title: row.title,
    caption: row.caption ?? undefined,
    script: row.script ?? undefined,
    cta: row.cta ?? undefined,
    hashtags: row.hashtags ?? [],
    designBrief: row.design_brief ?? undefined,
    designStatus: row.design_status,
    artworkUrl: row.artwork_url ?? undefined,
    scheduledFor: row.scheduled_for ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapArtistToInsert(artist: Partial<Artist>) {
  return {
    artistic_name: artist.artisticName,
    legal_name: artist.legalName ?? null,
    city: artist.city ?? null,
    state: artist.state ?? null,
    genre: artist.genre ?? null,
    audience: artist.audience ?? null,
    tone_of_voice: artist.toneOfVoice ?? null,
    goals: artist.goals ?? null,
    instagram_url: artist.instagramUrl ?? null,
    tiktok_url: artist.tiktokUrl ?? null,
    youtube_url: artist.youtubeUrl ?? null,
    spotify_url: artist.spotifyUrl ?? null,
    status: artist.status ?? "onboarding",
  };
}

export function mapReleaseToInsert(release: Partial<MusicRelease>) {
  return {
    artist_id: release.artistId,
    title: release.title,
    release_type: release.releaseType ?? "single",
    target_date: release.targetDate ?? null,
    status: release.status ?? "collecting_assets",
    audio_status: release.audioStatus ?? "pending",
    cover_status: release.coverStatus ?? "pending",
    technical_sheet_status: release.technicalSheetStatus ?? "pending",
    notes: release.notes ?? null,
  };
}

export function mapSocialAccountToInsert(account: Partial<SocialAccount>) {
  return {
    artist_id: account.artistId,
    platform: account.platform,
    account_label: account.accountLabel,
    username: account.username ?? null,
    login_email: account.loginEmail ?? null,
    status: account.status ?? "not_connected",
    scopes: account.scopes ?? [],
    expires_at: account.expiresAt ?? null,
    connected_at: account.connectedAt ?? null,
  };
}

export function mapPlannedPostToInsert(post: Partial<PlannedPost>) {
  return {
    artist_id: post.artistId,
    release_id: post.releaseId ?? null,
    social_account_id: post.socialAccountId ?? null,
    channel: post.channel ?? "instagram",
    format: post.format,
    title: post.title,
    caption: post.caption ?? null,
    script: post.script ?? null,
    cta: post.cta ?? null,
    hashtags: post.hashtags ?? [],
    design_brief: post.designBrief ?? null,
    design_status: post.designStatus ?? "briefing_ready",
    artwork_url: post.artworkUrl ?? null,
    scheduled_for: post.scheduledFor ?? null,
    status: post.status ?? "waiting_design",
  };
}
