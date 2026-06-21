-- Lion King 30th Anniversary × Zootopia 2 MD seed data (2025)
-- Products: 3 Lion King + 5 Zootopia 2 goods, KRW prices only; add other currencies as needed.

do $$
declare
  p_id uuid;
begin

  -- 01. 라이온 킹 금속키링 - 심바와 날라
  insert into product (id, handle, status, ip_franchise)
  values (gen_random_uuid(), 'lk-keyring-simba-nala', 'active', 'The Lion King')
  on conflict (handle) do nothing;
  select id into p_id from product where handle = 'lk-keyring-simba-nala';

  insert into product_translation (product_id, locale, title, subtitle) values
    (p_id, 'ko', '라이온 킹 금속키링 - 심바와 날라', '라이온 킹 30주년 라이브 인 콘서트 MD'),
    (p_id, 'en', 'Lion King Metal Keyring – Simba & Nala', 'Lion King 30th Live in Concert MD'),
    (p_id, 'ja', 'ライオン・キング メタルキーリング – シンバ＆ナラ', 'ライオン・キング 30周年 ライブ・イン・コンサート MD'),
    (p_id, 'zh', '狮子王金属钥匙扣 – 辛巴与娜娜', '狮子王30周年演唱会周边')
  on conflict (product_id, locale) do nothing;

  insert into product_price (product_id, currency, amount_minor) values
    (p_id, 'KRW', 12000), (p_id, 'JPY', 1200), (p_id, 'USD', 950), (p_id, 'CNY', 6200)
  on conflict (product_id, currency) do nothing;

  -- 02. 라이온 킹 금속키링 - 심바와 자주
  insert into product (id, handle, status, ip_franchise)
  values (gen_random_uuid(), 'lk-keyring-simba-purple', 'active', 'The Lion King')
  on conflict (handle) do nothing;
  select id into p_id from product where handle = 'lk-keyring-simba-purple';

  insert into product_translation (product_id, locale, title, subtitle) values
    (p_id, 'ko', '라이온 킹 금속키링 - 심바와 자주', '라이온 킹 30주년 라이브 인 콘서트 MD'),
    (p_id, 'en', 'Lion King Metal Keyring – Simba & Purple', 'Lion King 30th Live in Concert MD'),
    (p_id, 'ja', 'ライオン・キング メタルキーリング – シンバ＆パープル', 'ライオン・キング 30周年 ライブ・イン・コンサート MD'),
    (p_id, 'zh', '狮子王金属钥匙扣 – 辛巴与紫色款', '狮子王30周年演唱会周边')
  on conflict (product_id, locale) do nothing;

  insert into product_price (product_id, currency, amount_minor) values
    (p_id, 'KRW', 12000), (p_id, 'JPY', 1200), (p_id, 'USD', 950), (p_id, 'CNY', 6200)
  on conflict (product_id, currency) do nothing;

  -- 03. 라이온 킹 컵받침 코스터
  insert into product (id, handle, status, ip_franchise)
  values (gen_random_uuid(), 'lk-coaster', 'active', 'The Lion King')
  on conflict (handle) do nothing;
  select id into p_id from product where handle = 'lk-coaster';

  insert into product_translation (product_id, locale, title, subtitle) values
    (p_id, 'ko', '라이온 킹 컵받침 코스터', '라이온 킹 30주년 라이브 인 콘서트 MD'),
    (p_id, 'en', 'Lion King Cup Coaster Set', 'Lion King 30th Live in Concert MD'),
    (p_id, 'ja', 'ライオン・キング コースターセット', 'ライオン・キング 30周年 ライブ・イン・コンサート MD'),
    (p_id, 'zh', '狮子王杯垫套装', '狮子王30周年演唱会周边')
  on conflict (product_id, locale) do nothing;

  insert into product_price (product_id, currency, amount_minor) values
    (p_id, 'KRW', 9500), (p_id, 'JPY', 950), (p_id, 'USD', 750), (p_id, 'CNY', 4900)
  on conflict (product_id, currency) do nothing;

  -- 04. 주토피아2 스티커팩
  insert into product (id, handle, status, ip_franchise)
  values (gen_random_uuid(), 'zootopia2-sticker-pack', 'active', 'Zootopia 2')
  on conflict (handle) do nothing;
  select id into p_id from product where handle = 'zootopia2-sticker-pack';

  insert into product_translation (product_id, locale, title, subtitle) values
    (p_id, 'ko', '주토피아2 스티커팩', '주토피아2 공식 MD'),
    (p_id, 'en', 'Zootopia 2 Sticker Pack', 'Zootopia 2 Official MD'),
    (p_id, 'ja', 'ズートピア2 ステッカーパック', 'ズートピア2 公式 MD'),
    (p_id, 'zh', '疯狂动物城2贴纸包', '疯狂动物城2官方周边')
  on conflict (product_id, locale) do nothing;

  insert into product_price (product_id, currency, amount_minor) values
    (p_id, 'KRW', 12000), (p_id, 'JPY', 1200), (p_id, 'USD', 950), (p_id, 'CNY', 6200)
  on conflict (product_id, currency) do nothing;

  -- 05. 주토피아2 메모지 세트
  insert into product (id, handle, status, ip_franchise)
  values (gen_random_uuid(), 'zootopia2-memo-set', 'active', 'Zootopia 2')
  on conflict (handle) do nothing;
  select id into p_id from product where handle = 'zootopia2-memo-set';

  insert into product_translation (product_id, locale, title, subtitle) values
    (p_id, 'ko', '주토피아2 메모지 세트', '주토피아2 공식 MD'),
    (p_id, 'en', 'Zootopia 2 Memo Note Set', 'Zootopia 2 Official MD'),
    (p_id, 'ja', 'ズートピア2 メモ帳セット', 'ズートピア2 公式 MD'),
    (p_id, 'zh', '疯狂动物城2便利贴套装', '疯狂动物城2官方周边')
  on conflict (product_id, locale) do nothing;

  insert into product_price (product_id, currency, amount_minor) values
    (p_id, 'KRW', 12000), (p_id, 'JPY', 1200), (p_id, 'USD', 950), (p_id, 'CNY', 6200)
  on conflict (product_id, currency) do nothing;

  -- 06. 주토피아2 미니 파우치 - 주디&닉
  insert into product (id, handle, status, ip_franchise)
  values (gen_random_uuid(), 'zootopia2-pouch-judy-nick', 'active', 'Zootopia 2')
  on conflict (handle) do nothing;
  select id into p_id from product where handle = 'zootopia2-pouch-judy-nick';

  insert into product_translation (product_id, locale, title, subtitle) values
    (p_id, 'ko', '주토피아2 미니 파우치 - 주디&닉', '주토피아2 공식 MD'),
    (p_id, 'en', 'Zootopia 2 Mini Pouch – Judy & Nick', 'Zootopia 2 Official MD'),
    (p_id, 'ja', 'ズートピア2 ミニポーチ – ジュディ＆ニック', 'ズートピア2 公式 MD'),
    (p_id, 'zh', '疯狂动物城2迷你收纳袋 – 朱迪&尼克', '疯狂动物城2官方周边')
  on conflict (product_id, locale) do nothing;

  insert into product_price (product_id, currency, amount_minor) values
    (p_id, 'KRW', 12000), (p_id, 'JPY', 1200), (p_id, 'USD', 950), (p_id, 'CNY', 6200)
  on conflict (product_id, currency) do nothing;

  -- 07. 주토피아2 L홀더 - 주디&닉
  insert into product (id, handle, status, ip_franchise)
  values (gen_random_uuid(), 'zootopia2-l-holder-judy-nick', 'active', 'Zootopia 2')
  on conflict (handle) do nothing;
  select id into p_id from product where handle = 'zootopia2-l-holder-judy-nick';

  insert into product_translation (product_id, locale, title, subtitle) values
    (p_id, 'ko', '주토피아2 L홀더 - 주디&닉', '주토피아2 공식 MD'),
    (p_id, 'en', 'Zootopia 2 L-Holder – Judy & Nick', 'Zootopia 2 Official MD'),
    (p_id, 'ja', 'ズートピア2 Lホルダー – ジュディ＆ニック', 'ズートピア2 公式 MD'),
    (p_id, 'zh', '疯狂动物城2 L型文件夹 – 朱迪&尼克', '疯狂动物城2官方周边')
  on conflict (product_id, locale) do nothing;

  insert into product_price (product_id, currency, amount_minor) values
    (p_id, 'KRW', 4000), (p_id, 'JPY', 400), (p_id, 'USD', 320), (p_id, 'CNY', 2000)
  on conflict (product_id, currency) do nothing;

  -- 08. 주토피아2 L홀더 - 주디&닉&피닉
  insert into product (id, handle, status, ip_franchise)
  values (gen_random_uuid(), 'zootopia2-l-holder-all', 'active', 'Zootopia 2')
  on conflict (handle) do nothing;
  select id into p_id from product where handle = 'zootopia2-l-holder-all';

  insert into product_translation (product_id, locale, title, subtitle) values
    (p_id, 'ko', '주토피아2 L홀더 - 주디&닉&피닉', '주토피아2 공식 MD'),
    (p_id, 'en', 'Zootopia 2 L-Holder – Judy, Nick & Finnick', 'Zootopia 2 Official MD'),
    (p_id, 'ja', 'ズートピア2 Lホルダー – ジュディ＆ニック＆フィニック', 'ズートピア2 公式 MD'),
    (p_id, 'zh', '疯狂动物城2 L型文件夹 – 全角色款', '疯狂动物城2官方周边')
  on conflict (product_id, locale) do nothing;

  insert into product_price (product_id, currency, amount_minor) values
    (p_id, 'KRW', 4000), (p_id, 'JPY', 400), (p_id, 'USD', 320), (p_id, 'CNY', 2000)
  on conflict (product_id, currency) do nothing;

end $$;
