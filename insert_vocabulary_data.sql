-- =====================================================
-- 为用户 co2sou@gmail.com (maxsou) 添加日文词汇数据
-- =====================================================
--
-- 使用说明：
-- 1. 请先确认用户 co2sou@gmail.com 已在系统中注册
-- 2. 在 Supabase SQL Editor 中执行此脚本
-- 3. 脚本会自动查找用户ID并插入词汇数据
--
-- 备用方案：如果子查询方式不工作，请使用以下步骤：
-- 1. 先执行：SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com';
-- 2. 获取用户UUID后，替换下面所有的子查询为具体的UUID
--
-- 数据统计：共 62 个日文词汇条目
-- =====================================================

-- 检查用户是否存在
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'co2sou@gmail.com') THEN
        RAISE EXCEPTION '用户 co2sou@gmail.com 不存在，请先注册该用户';
    END IF;
END $$;

-- 插入词汇数据
INSERT INTO words (user_id, original_text, pronunciation, translation, example) VALUES

-- 获取用户ID的子查询方式
((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '希死念慮', 'きしねんりょ', '轻生念头', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '絡れ', 'もつれ', '纠葛 纠缠不清', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '困難に怯む', 'こんなんにひるむ', '不惧困难', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ガールズ', 'Girls', '少女', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'パンツァー', 'Panzer', '战车', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '街とその不確かな壁', 'まちとそのふたしかなかべ', '小城与不确定性的墙', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '強要', 'きょうよう', '强迫', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'オワコン', NULL, '已經結束的内容', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '枯山水', 'かれさんすい', '枯山水', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '渡り鳥', 'わたりどり', '候鳥', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '帆布キャンバスバッグ', 'はんぷキャンバスバッグ', '帆布', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ダイヤログ', 'dialogue', '对话', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ダイア／ダイヤ', 'diagram / diamond', '時刻表,💎', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '力がみなぎっている', 'ちからがみなぎっている（漲る）', '力量充满全身', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'マスカレード', NULL, '假面 僞裝', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ひょっこりする', NULL, '突然冒出來 突然出現', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'パーカーおじさん', NULL, '過四十歲 连帽衫（パーカー）的男性', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '祈りを込める', 'いのりをこめる', '倾注祈愿　怀着祈祷的心', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '恐れ恐れ', 'おそれおそれ', '战战兢兢 小心翼翼 心怀忐忑 毕恭毕敬', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'あさぎ', '浅葱', '浅葱色 浅蓝绿色、淡青色', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'せいぜい', NULL, '充其量', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '委ねる', 'ゆだねる', '托付', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'エゴ', 'ego', '自我 自我意识 执着 执念 自私的欲望', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ハグキをしっかりと引き締める', NULL, '确实地收紧牙龈', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ハグキ', '歯茎', '牙龈', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '魔が刺す', 'まがさす', '一时失去理智 一时鬼迷心窍', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '情報格差', 'じょうほうかくさ', '信息差', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '沉浸式翻译', 'Immersive Translate', '双语对照的网页翻译', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ためらう', '躊躇う', '犹豫、踌躇、拿不定主意', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ためらわずに', NULL, '毫不犹豫地', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'まるで飛び込み選手がためらうことなくプールに飛び込むように', NULL, '像跳水运动员义无反顾跳到泳池一样', 'まるで飛び込み選手がためらうことなくプールに飛び込むように'),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '夏のバカンスを楽しむ', 'なつのバカンス（法语vacances）をたのしむ', '享受夏天的假期，度假', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ほうじ茶', '焙じ茶', '焙茶 经过烘焙的日本绿茶', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'しゃもじ', 'shamoji', '饭铲', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '天動説と地動説', 'てんどうせつとちどうせつ', '天动说（地球是世界的中心）与地动说', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'アレンジ', NULL, '安排 调整 搭配', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ひっくり腰 ぎっくり腰', NULL, '急性腰痛 闪腰 腰扭伤', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '言い聞かせる', 'いいきかせる', '告诉自己', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'プルーン', 'prune', '干西梅', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'VAM ギャンブル', 'Valuation Adjustment Mechanism', '対賭協議 対賭', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '沙門', 'しゃもん', '出家僧', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '数え年', 'かぞえどし', '出生时为1岁（而不是现代"满岁"计算的0岁）。每逢新年（1月1日）增加1岁，无论生日是否已过。虚岁。現代日常生活主要使用满岁（満年齢）。', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '奢る人ほど失敗招きやすい', 'おごるひとほどしっぱいまねきやすい', '傲慢な態度を取る人は、注意力が散漫になり、思わぬミスを犯しやすいという', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '君たちはどう生きるか', 'きみたちはどういきるか', '《你想活出怎样的人生》', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '値打ちのない', 'ねうちのない', '価値のない', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '他のためにし、然して後、自らのためになせ', 'たのためにし、しかしてのち、みずからのためになせ', '為他人而行，然後，才為自己而行。先為他人付出，再回過頭來利益自己。若欲自利，當利一切眾生', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '彼はなかなかの曲者だね', 'かれはなかなかのくせものだね', '他是个相当棘手的人啊。', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '盲腸炎', 'もうちょうえん', '阑尾炎', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '縁石', 'えんせき', '马路与人行道之间的石质或混凝土制的边缘　马路牙子', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '縁', 'ふち', '边缘', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '鍬入れの儀式', 'くわいれのぎしき', '动工的仪式', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '救いでやまじ', NULL, '「やまじ」来源于「やむ（止む）」＋「じ（否定推量）」，意思是"不会停止"或"不会作罢"。不救度完衆生就不会罢休。', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '肩の凝らない話です', 'かたのこらないはなしです', '轻松的话题。「肩の凝らない」字面意思是"肩膀不僵硬"，引申为"不紧张、轻松、无压力"', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'あくたがわ りゅうのすけ', NULL, '芥川龙之介', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '強引に受け入れる', 'ごういんにうけいれる', '强迫自己接受', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'スムージー', NULL, '水果沙冰', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '学問をするには日々に増え、道を行うには日々に減らす', 'がくもんをするにはひびにふえ、みちをおこなうにはひびにへらす', '为学日益 为道日损。学习世间知识，是每天都在增加（知识、技巧）；修道则是每天减少（欲望、执念、杂念等），以至于"无为"。', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'よもぎ', '蓬・艾', '艾草', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'マムシ', NULL, '蝮蛇', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), '剥き氷下魚', 'むきこまい', '魚乾', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ガラパゴス', NULL, '加拉帕戈斯群岛', NULL),

((SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1), 'ガラパゴス化', NULL, '日本孤岛进化', NULL);

-- =====================================================
-- 验证和统计查询
-- =====================================================

-- 查看插入结果
SELECT
    COUNT(*) as total_words,
    MIN(created_at) as first_created,
    MAX(created_at) as last_created
FROM words
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1);

-- 查看最近插入的词汇（前10个）
SELECT
    original_text,
    pronunciation,
    translation,
    created_at
FROM words
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1)
ORDER BY created_at DESC
LIMIT 10;

-- 查看用户信息
SELECT
    email,
    raw_user_meta_data->>'username' as username,
    created_at as user_created_at
FROM auth.users
WHERE email = 'co2sou@gmail.com';

-- =====================================================
-- 备用删除脚本（如需重新插入）
-- =====================================================
--
-- 如果需要删除刚插入的数据，请取消注释下面的语句：
--
-- DELETE FROM words
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com' LIMIT 1)
--   AND created_at >= '2025-01-22 00:00:00'::timestamptz;
--
