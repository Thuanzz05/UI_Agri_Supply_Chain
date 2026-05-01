const FACEBOOK_KEYS = [
  'facebook',
  'Facebook',
  'facebookUrl',
  'FacebookUrl',
  'linkFacebook',
  'LinkFacebook',
  'facebookNguoiBan',
  'FacebookNguoiBan',
  'facebookNguoiMua',
  'FacebookNguoiMua',
  'facebookNongDan',
  'FacebookNongDan',
  'facebookDaiLy',
  'FacebookDaiLy',
  'facebookSieuThi',
  'FacebookSieuThi',
];

const TIKTOK_KEYS = [
  'tiktok',
  'Tiktok',
  'tikTok',
  'TikTok',
  'tiktokUrl',
  'TiktokUrl',
  'tikTokUrl',
  'TikTokUrl',
  'linkTiktok',
  'LinkTiktok',
  'linkTikTok',
  'LinkTikTok',
  'tiktokNguoiBan',
  'TiktokNguoiBan',
  'tikTokNguoiBan',
  'TikTokNguoiBan',
  'tiktokNguoiMua',
  'TiktokNguoiMua',
  'tikTokNguoiMua',
  'TikTokNguoiMua',
  'tiktokNongDan',
  'TiktokNongDan',
  'tikTokNongDan',
  'TikTokNongDan',
  'tiktokDaiLy',
  'TiktokDaiLy',
  'tikTokDaiLy',
  'TikTokDaiLy',
  'tiktokSieuThi',
  'TiktokSieuThi',
  'tikTokSieuThi',
  'TikTokSieuThi',
];

const readFirstString = (source: unknown, keys: string[]) => {
  if (!source || typeof source !== 'object') return '';

  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
};

export const normalizeSocialUrl = (value: unknown) => {
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

export const getSocialLinks = (source: unknown) => ({
  facebook: normalizeSocialUrl(readFirstString(source, FACEBOOK_KEYS)),
  tiktok: normalizeSocialUrl(readFirstString(source, TIKTOK_KEYS)),
});

export const buildSocialUpdatePayload = <T extends Record<string, unknown>>(values: T) => {
  const facebook = normalizeSocialUrl(values.facebook);
  const tiktok = normalizeSocialUrl(values.tiktok);

  return {
    ...values,
    facebook,
    Facebook: facebook,
    facebookUrl: facebook,
    FacebookUrl: facebook,
    linkFacebook: facebook,
    LinkFacebook: facebook,
    tiktok,
    Tiktok: tiktok,
    TikTok: tiktok,
    tiktokUrl: tiktok,
    TiktokUrl: tiktok,
    TikTokUrl: tiktok,
    linkTiktok: tiktok,
    LinkTiktok: tiktok,
    linkTikTok: tiktok,
    LinkTikTok: tiktok,
  };
};

export const validateOptionalSocialUrl = (_: unknown, value: unknown) => {
  const url = normalizeSocialUrl(value);
  if (!url) return Promise.resolve();

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return Promise.resolve();
    }
  } catch {
    // Fall through to reject below.
  }

  return Promise.reject(new Error('Vui lòng nhập đường dẫn hợp lệ!'));
};
