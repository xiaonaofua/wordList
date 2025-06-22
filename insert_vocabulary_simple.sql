-- =====================================================
-- 简化版：为用户添加日文词汇数据
-- =====================================================
-- 
-- 使用步骤：
-- 1. 先执行：SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com';
-- 2. 将获取的 UUID 替换下面的 'YOUR_USER_UUID_HERE'
-- 3. 执行插入语句
--
-- =====================================================

-- 第一步：获取用户ID（复制结果中的UUID）
SELECT id, email FROM auth.users WHERE email = 'co2sou@gmail.com';

-- 第二步：将上面查询结果的UUID替换下面的 'YOUR_USER_UUID_HERE'，然后执行插入
INSERT INTO words (user_id, original_text, pronunciation, translation, example) VALUES

('YOUR_USER_UUID_HERE', '希死念慮', 'きしねんりょ', '轻生念头', NULL),
('YOUR_USER_UUID_HERE', '絡れ', 'もつれ', '纠葛 纠缠不清', NULL),
('YOUR_USER_UUID_HERE', '困難に怯む', 'こんなんにひるむ', '不惧困难', NULL),
('YOUR_USER_UUID_HERE', 'ガールズ', 'Girls', '少女', NULL),
('YOUR_USER_UUID_HERE', 'パンツァー', 'Panzer', '战车', NULL),
('YOUR_USER_UUID_HERE', '街とその不確かな壁', 'まちとそのふたしかなかべ', '小城与不确定性的墙', NULL),
('YOUR_USER_UUID_HERE', '強要', 'きょうよう', '强迫', NULL),
('YOUR_USER_UUID_HERE', 'オワコン', NULL, '已經結束的内容', NULL),
('YOUR_USER_UUID_HERE', '枯山水', 'かれさんすい', '枯山水', NULL),
('YOUR_USER_UUID_HERE', '渡り鳥', 'わたりどり', '候鳥', NULL),
('YOUR_USER_UUID_HERE', '帆布キャンバスバッグ', 'はんぷキャンバスバッグ', '帆布', NULL),
('YOUR_USER_UUID_HERE', 'ダイヤログ', 'dialogue', '对话', NULL),
('YOUR_USER_UUID_HERE', 'ダイア／ダイヤ', 'diagram / diamond', '時刻表,💎', NULL),
('YOUR_USER_UUID_HERE', '力がみなぎっている', 'ちからがみなぎっている（漲る）', '力量充满全身', NULL),
('YOUR_USER_UUID_HERE', 'マスカレード', NULL, '假面 僞裝', NULL),
('YOUR_USER_UUID_HERE', 'ひょっこりする', NULL, '突然冒出來 突然出現', NULL),
('YOUR_USER_UUID_HERE', 'パーカーおじさん', NULL, '過四十歲 连帽衫（パーカー）的男性', NULL),
('YOUR_USER_UUID_HERE', '祈りを込める', 'いのりをこめる', '倾注祈愿　怀着祈祷的心', NULL),
('YOUR_USER_UUID_HERE', '恐れ恐れ', 'おそれおそれ', '战战兢兢 小心翼翼 心怀忐忑 毕恭毕敬', NULL),
('YOUR_USER_UUID_HERE', 'あさぎ', '浅葱', '浅葱色 浅蓝绿色、淡青色', NULL),
('YOUR_USER_UUID_HERE', 'せいぜい', NULL, '充其量', NULL),
('YOUR_USER_UUID_HERE', '委ねる', 'ゆだねる', '托付', NULL),
('YOUR_USER_UUID_HERE', 'エゴ', 'ego', '自我 自我意识 执着 执念 自私的欲望', NULL),
('YOUR_USER_UUID_HERE', 'ハグキをしっかりと引き締める', NULL, '确实地收紧牙龈', NULL),
('YOUR_USER_UUID_HERE', 'ハグキ', '歯茎', '牙龈', NULL),
('YOUR_USER_UUID_HERE', '魔が刺す', 'まがさす', '一时失去理智 一时鬼迷心窍', NULL),
('YOUR_USER_UUID_HERE', '情報格差', 'じょうほうかくさ', '信息差', NULL),
('YOUR_USER_UUID_HERE', '沉浸式翻译', 'Immersive Translate', '双语对照的网页翻译', NULL),
('YOUR_USER_UUID_HERE', 'ためらう', '躊躇う', '犹豫、踌躇、拿不定主意', NULL),
('YOUR_USER_UUID_HERE', 'ためらわずに', NULL, '毫不犹豫地', NULL),
('YOUR_USER_UUID_HERE', 'まるで飛び込み選手がためらうことなくプールに飛び込むように', NULL, '像跳水运动员义无反顾跳到泳池一样', 'まるで飛び込み選手がためらうことなくプールに飛び込むように'),
('YOUR_USER_UUID_HERE', '夏のバカンスを楽しむ', 'なつのバカンス（法语vacances）をたのしむ', '享受夏天的假期，度假', NULL),
('YOUR_USER_UUID_HERE', 'ほうじ茶', '焙じ茶', '焙茶 经过烘焙的日本绿茶', NULL),
('YOUR_USER_UUID_HERE', 'しゃもじ', 'shamoji', '饭铲', NULL),
('YOUR_USER_UUID_HERE', '天動説と地動説', 'てんどうせつとちどうせつ', '天动说（地球是世界的中心）与地动说', NULL),
('YOUR_USER_UUID_HERE', 'アレンジ', NULL, '安排 调整 搭配', NULL),
('YOUR_USER_UUID_HERE', 'ひっくり腰 ぎっくり腰', NULL, '急性腰痛 闪腰 腰扭伤', NULL),
('YOUR_USER_UUID_HERE', '言い聞かせる', 'いいきかせる', '告诉自己', NULL),
('YOUR_USER_UUID_HERE', 'プルーン', 'prune', '干西梅', NULL),
('YOUR_USER_UUID_HERE', 'VAM ギャンブル', 'Valuation Adjustment Mechanism', '対賭協議 対賭', NULL),
('YOUR_USER_UUID_HERE', '沙門', 'しゃもん', '出家僧', NULL),
('YOUR_USER_UUID_HERE', '数え年', 'かぞえどし', '出生时为1岁（而不是现代"满岁"计算的0岁）。每逢新年（1月1日）增加1岁，无论生日是否已过。虚岁。現代日常生活主要使用满岁（満年齢）。', NULL),
('YOUR_USER_UUID_HERE', '奢る人ほど失敗招きやすい', 'おごるひとほどしっぱいまねきやすい', '傲慢な態度を取る人は、注意力が散漫になり、思わぬミスを犯しやすいという', NULL),
('YOUR_USER_UUID_HERE', '君たちはどう生きるか', 'きみたちはどういきるか', '《你想活出怎样的人生》', NULL),
('YOUR_USER_UUID_HERE', '値打ちのない', 'ねうちのない', '価値のない', NULL),
('YOUR_USER_UUID_HERE', '他のためにし、然して後、自らのためになせ', 'たのためにし、しかしてのち、みずからのためになせ', '為他人而行，然後，才為自己而行。先為他人付出，再回過頭來利益自己。若欲自利，當利一切眾生', NULL),
('YOUR_USER_UUID_HERE', '彼はなかなかの曲者だね', 'かれはなかなかのくせものだね', '他是个相当棘手的人啊。', NULL),
('YOUR_USER_UUID_HERE', '盲腸炎', 'もうちょうえん', '阑尾炎', NULL),
('YOUR_USER_UUID_HERE', '縁石', 'えんせき', '马路与人行道之间的石质或混凝土制的边缘　马路牙子', NULL),
('YOUR_USER_UUID_HERE', '縁', 'ふち', '边缘', NULL),
('YOUR_USER_UUID_HERE', '鍬入れの儀式', 'くわいれのぎしき', '动工的仪式', NULL),
('YOUR_USER_UUID_HERE', '救いでやまじ', NULL, '「やまじ」来源于「やむ（止む）」＋「じ（否定推量）」，意思是"不会停止"或"不会作罢"。不救度完衆生就不会罢休。', NULL),
('YOUR_USER_UUID_HERE', '肩の凝らない話です', 'かたのこらないはなしです', '轻松的话题。「肩の凝らない」字面意思是"肩膀不僵硬"，引申为"不紧张、轻松、无压力"', NULL),
('YOUR_USER_UUID_HERE', 'あくたがわ りゅうのすけ', NULL, '芥川龙之介', NULL),
('YOUR_USER_UUID_HERE', '強引に受け入れる', 'ごういんにうけいれる', '强迫自己接受', NULL),
('YOUR_USER_UUID_HERE', 'スムージー', NULL, '水果沙冰', NULL),
('YOUR_USER_UUID_HERE', '学問をするには日々に増え、道を行うには日々に減らす', 'がくもんをするにはひびにふえ、みちをおこなうにはひびにへらす', '为学日益 为道日损。学习世间知识，是每天都在增加（知识、技巧）；修道则是每天减少（欲望、执念、杂念等），以至于"无为"。', NULL),
('YOUR_USER_UUID_HERE', 'よもぎ', '蓬・艾', '艾草', NULL),
('YOUR_USER_UUID_HERE', 'マムシ', NULL, '蝮蛇', NULL),
('YOUR_USER_UUID_HERE', '剥き氷下魚', 'むきこまい', '魚乾', NULL),
('YOUR_USER_UUID_HERE', 'ガラパゴス', NULL, '加拉帕戈斯群岛', NULL),
('YOUR_USER_UUID_HERE', 'ガラパゴス化', NULL, '日本孤岛进化', NULL);

-- 验证插入结果
SELECT COUNT(*) as inserted_words FROM words WHERE user_id = 'YOUR_USER_UUID_HERE';
