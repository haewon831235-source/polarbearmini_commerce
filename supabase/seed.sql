-- Sample catalog for the Phase B prototype. Idempotent (safe to re-run).
-- amount_minor: KRW/JPY exponent 0, USD/CNY exponent 2.

-- Products -------------------------------------------------------------------
insert into product (handle, ip_franchise) values
  ('aot-acrylic-stand', 'Attack on Titan'),
  ('jjk-tshirt',        'Jujutsu Kaisen'),
  ('ff-piano-score',    'Final Fantasy'),
  ('lionking-tote',     'The Lion King')
on conflict (handle) do nothing;

-- Prices ---------------------------------------------------------------------
insert into product_price (product_id, currency, amount_minor)
select p.id, v.currency, v.amount_minor
from product p
join (values
  ('aot-acrylic-stand','KRW',18000),('aot-acrylic-stand','JPY',1800),('aot-acrylic-stand','USD',1500),('aot-acrylic-stand','CNY',9800),
  ('jjk-tshirt','KRW',32000),('jjk-tshirt','JPY',3200),('jjk-tshirt','USD',2800),('jjk-tshirt','CNY',18000),
  ('ff-piano-score','KRW',45000),('ff-piano-score','JPY',4500),('ff-piano-score','USD',3900),('ff-piano-score','CNY',25000),
  ('lionking-tote','KRW',25000),('lionking-tote','JPY',2500),('lionking-tote','USD',2200),('lionking-tote','CNY',14000)
) as v(handle, currency, amount_minor) on v.handle = p.handle
on conflict (product_id, currency) do nothing;

-- Translations ---------------------------------------------------------------
insert into product_translation (product_id, locale, title, subtitle)
select p.id, v.locale, v.title, v.subtitle
from product p
join (values
  -- Attack on Titan acrylic stand
  ('aot-acrylic-stand','ko','진격의 거인 아크릴 스탠드','공식 라이선스 굿즈'),
  ('aot-acrylic-stand','en','Attack on Titan Acrylic Stand','Officially licensed goods'),
  ('aot-acrylic-stand','ja','進撃の巨人 アクリルスタンド','公式ライセンスグッズ'),
  ('aot-acrylic-stand','zh','进击的巨人 亚克力立牌','官方授权周边'),
  -- Jujutsu Kaisen t-shirt
  ('jjk-tshirt','ko','주술회전 티셔츠','공연 한정판'),
  ('jjk-tshirt','en','Jujutsu Kaisen T-Shirt','Show-limited edition'),
  ('jjk-tshirt','ja','呪術廻戦 Tシャツ','公演限定版'),
  ('jjk-tshirt','zh','咒术回战 T恤','演出限定版'),
  -- Final Fantasy piano score
  ('ff-piano-score','ko','파이널 판타지 피아노 악보집','콘서트 공식 악보'),
  ('ff-piano-score','en','Final Fantasy Piano Score Book','Official concert score'),
  ('ff-piano-score','ja','ファイナルファンタジー ピアノ楽譜集','コンサート公式楽譜'),
  ('ff-piano-score','zh','最终幻想 钢琴谱集','音乐会官方乐谱'),
  -- Lion King tote
  ('lionking-tote','ko','라이온 킹 에코백','30주년 기념'),
  ('lionking-tote','en','The Lion King Tote Bag','30th anniversary'),
  ('lionking-tote','ja','ライオン・キング トートバッグ','30周年記念'),
  ('lionking-tote','zh','狮子王 帆布袋','30周年纪念')
) as v(handle, locale, title, subtitle) on v.handle = p.handle
on conflict (product_id, locale) do nothing;

-- Variants for the t-shirt (sizes) -------------------------------------------
insert into product_variant (product_id, sku, position)
select p.id, v.sku, v.position
from product p
join (values
  ('jjk-tshirt','JJK-TEE-S',0),
  ('jjk-tshirt','JJK-TEE-M',1),
  ('jjk-tshirt','JJK-TEE-L',2)
) as v(handle, sku, position) on v.handle = p.handle
on conflict (sku) do nothing;

insert into variant_translation (variant_id, locale, label)
select pv.id, v.locale, v.label
from product_variant pv
join (values
  ('JJK-TEE-S','ko','S'),('JJK-TEE-S','en','S'),('JJK-TEE-S','ja','S'),('JJK-TEE-S','zh','S'),
  ('JJK-TEE-M','ko','M'),('JJK-TEE-M','en','M'),('JJK-TEE-M','ja','M'),('JJK-TEE-M','zh','M'),
  ('JJK-TEE-L','ko','L'),('JJK-TEE-L','en','L'),('JJK-TEE-L','ja','L'),('JJK-TEE-L','zh','L')
) as v(sku, locale, label) on v.sku = pv.sku
on conflict (variant_id, locale) do nothing;
