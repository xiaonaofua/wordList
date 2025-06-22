-- =====================================================
-- 管理员用户删除脚本
-- =====================================================
-- 
-- 使用说明：
-- 1. 将 'USER_EMAIL_HERE' 替换为要删除的用户邮箱
-- 2. 在 Supabase SQL Editor 中执行此脚本
-- 3. 按步骤执行，确认每步结果
--
-- 警告：此操作不可逆，请谨慎执行！
-- =====================================================

-- 设置要删除的用户邮箱（请修改此处）
-- 示例：'co2sou@gmail.com'
\set user_email 'USER_EMAIL_HERE'

-- =====================================================
-- 第一步：验证用户存在并获取信息
-- =====================================================

-- 查找用户信息
SELECT 
    id as user_id,
    email,
    created_at as account_created,
    last_sign_in_at,
    raw_user_meta_data->>'username' as username
FROM auth.users 
WHERE email = :'user_email';

-- 统计用户词汇数据
SELECT 
    COUNT(*) as total_words,
    MIN(created_at) as first_word_created,
    MAX(updated_at) as last_word_updated
FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = :'user_email');

-- =====================================================
-- 第二步：备份用户数据（可选）
-- =====================================================

-- 如果需要备份，可以创建临时表
-- CREATE TABLE deleted_users_backup AS
-- SELECT 
--     u.id,
--     u.email,
--     u.created_at,
--     u.raw_user_meta_data,
--     CURRENT_TIMESTAMP as backup_time
-- FROM auth.users u
-- WHERE u.email = :'user_email';

-- CREATE TABLE deleted_words_backup AS
-- SELECT 
--     w.*,
--     CURRENT_TIMESTAMP as backup_time
-- FROM words w
-- WHERE w.user_id = (SELECT id FROM auth.users WHERE email = :'user_email');

-- =====================================================
-- 第三步：删除用户词汇数据
-- =====================================================

-- 删除前再次确认
SELECT 
    'About to delete ' || COUNT(*) || ' words for user: ' || :'user_email' as confirmation_message
FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = :'user_email');

-- 执行词汇数据删除
DELETE FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = :'user_email');

-- 验证词汇数据删除结果
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ 词汇数据删除成功'
        ELSE '❌ 词汇数据删除失败，还有 ' || COUNT(*) || ' 条记录'
    END as words_deletion_status
FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = :'user_email');

-- =====================================================
-- 第四步：删除用户账户
-- =====================================================

-- 获取用户ID用于最终验证
SELECT id as user_id_to_delete 
FROM auth.users 
WHERE email = :'user_email';

-- 注意：用户账户删除需要在 Supabase Dashboard 的 Authentication > Users 中手动执行
-- 或者使用 Supabase Admin API

-- 如果有 Admin API 访问权限，可以使用以下方式：
-- DELETE FROM auth.users WHERE email = :'user_email';

-- =====================================================
-- 第五步：最终验证
-- =====================================================

-- 验证用户账户是否已删除
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ 用户账户删除成功'
        ELSE '❌ 用户账户仍然存在'
    END as account_deletion_status
FROM auth.users 
WHERE email = :'user_email';

-- 验证没有残留的词汇数据
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ 无残留词汇数据'
        ELSE '❌ 发现 ' || COUNT(*) || ' 条残留词汇数据'
    END as data_cleanup_status
FROM words 
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = :'user_email'
);

-- =====================================================
-- 第六步：记录删除操作
-- =====================================================

-- 创建操作日志表（如果不存在）
CREATE TABLE IF NOT EXISTS admin_operation_logs (
    id SERIAL PRIMARY KEY,
    operation_type VARCHAR(50) NOT NULL,
    target_email VARCHAR(255),
    target_user_id UUID,
    admin_user_id UUID,
    operation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details JSONB,
    status VARCHAR(20) DEFAULT 'completed'
);

-- 记录删除操作
INSERT INTO admin_operation_logs (
    operation_type,
    target_email,
    admin_user_id,
    details
) VALUES (
    'user_deletion',
    :'user_email',
    auth.uid(), -- 当前管理员用户ID
    jsonb_build_object(
        'deletion_time', CURRENT_TIMESTAMP,
        'deleted_by', 'admin_script',
        'notes', 'User account and data deleted via admin script'
    )
);

-- =====================================================
-- 删除完成报告
-- =====================================================

SELECT 
    '🎯 用户删除操作完成报告' as title,
    :'user_email' as deleted_email,
    CURRENT_TIMESTAMP as completion_time;

-- 显示操作摘要
SELECT 
    'User: ' || :'user_email' as summary,
    '✅ 请在 Supabase Dashboard 中手动删除用户账户' as next_action,
    '📧 请向用户发送删除确认邮件' as notification_required;

-- =====================================================
-- 清理备份数据（30天后执行）
-- =====================================================

-- 设置备份数据的自动清理（可选）
-- 
-- CREATE OR REPLACE FUNCTION cleanup_old_backups()
-- RETURNS void AS $$
-- BEGIN
--     DELETE FROM deleted_users_backup 
--     WHERE backup_time < CURRENT_TIMESTAMP - INTERVAL '30 days';
--     
--     DELETE FROM deleted_words_backup 
--     WHERE backup_time < CURRENT_TIMESTAMP - INTERVAL '30 days';
-- END;
-- $$ LANGUAGE plpgsql;

-- 创建定时任务清理备份（需要 pg_cron 扩展）
-- SELECT cron.schedule('cleanup-deleted-user-backups', '0 2 * * *', 'SELECT cleanup_old_backups();');

-- =====================================================
-- 紧急恢复脚本（仅在误删除时使用）
-- =====================================================

-- 如果需要恢复误删除的数据：
-- 
-- -- 恢复用户账户（需要重新创建）
-- INSERT INTO auth.users (id, email, created_at, raw_user_meta_data)
-- SELECT id, email, created_at, raw_user_meta_data
-- FROM deleted_users_backup
-- WHERE email = :'user_email';
-- 
-- -- 恢复词汇数据
-- INSERT INTO words (user_id, original_text, pronunciation, translation, example, created_at, updated_at)
-- SELECT user_id, original_text, pronunciation, translation, example, created_at, updated_at
-- FROM deleted_words_backup
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = :'user_email');

-- =====================================================
-- 脚本执行完成
-- =====================================================

SELECT '🎉 管理员删除脚本执行完成！' as final_message;
