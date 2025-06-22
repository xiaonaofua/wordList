-- =====================================================
-- Supabase 用户删除函数
-- =====================================================
-- 
-- 此函数需要在 Supabase SQL Editor 中执行
-- 用于支持客户端的账户删除功能
--
-- =====================================================

-- 创建用户删除函数
CREATE OR REPLACE FUNCTION delete_user_account(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- 使用函数定义者的权限执行
AS $$
DECLARE
    result JSON;
    word_count INTEGER;
BEGIN
    -- 检查用户是否存在
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;

    -- 检查是否是当前用户（安全检查）
    IF user_id != auth.uid() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Unauthorized: Can only delete own account'
        );
    END IF;

    -- 统计要删除的词汇数量
    SELECT COUNT(*) INTO word_count
    FROM words
    WHERE words.user_id = delete_user_account.user_id;

    -- 删除用户的词汇数据
    DELETE FROM words WHERE words.user_id = delete_user_account.user_id;

    -- 删除用户账户（需要超级用户权限）
    -- 注意：这可能需要额外的权限配置
    BEGIN
        DELETE FROM auth.users WHERE id = user_id;
        
        RETURN json_build_object(
            'success', true,
            'message', 'Account deleted successfully',
            'deleted_words', word_count
        );
    EXCEPTION WHEN OTHERS THEN
        -- 如果无法删除用户，至少标记为已删除
        UPDATE auth.users 
        SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
            json_build_object(
                'deleted', true,
                'deleted_at', NOW()::text,
                'status', 'deleted'
            )::jsonb
        WHERE id = user_id;
        
        RETURN json_build_object(
            'success', true,
            'message', 'Account marked as deleted, admin action required',
            'deleted_words', word_count,
            'requires_admin', true
        );
    END;
END;
$$;

-- 设置函数权限（允许认证用户调用）
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;

-- =====================================================
-- 创建 RLS 策略确保用户只能删除自己的数据
-- =====================================================

-- 确保 words 表有正确的 RLS 策略
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- 创建或更新删除策略
DROP POLICY IF EXISTS "Users can delete own words" ON words;
CREATE POLICY "Users can delete own words" ON words
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 测试函数（可选）
-- =====================================================

-- 测试函数是否正常工作（不会实际删除数据）
-- SELECT delete_user_account('00000000-0000-0000-0000-000000000000');

-- =====================================================
-- 备用方案：如果上述函数权限不足
-- =====================================================

-- 创建一个简化版本，只处理数据清理和标记
CREATE OR REPLACE FUNCTION mark_user_deleted()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    word_count INTEGER;
BEGIN
    -- 获取当前用户ID
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not authenticated'
        );
    END IF;

    -- 统计词汇数量
    SELECT COUNT(*) INTO word_count
    FROM words
    WHERE user_id = current_user_id;

    -- 删除用户词汇数据
    DELETE FROM words WHERE user_id = current_user_id;

    -- 标记用户为已删除
    UPDATE auth.users 
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        json_build_object(
            'deleted', true,
            'deleted_at', NOW()::text,
            'status', 'deleted'
        )::jsonb
    WHERE id = current_user_id;

    RETURN json_build_object(
        'success', true,
        'message', 'User data deleted and account marked for deletion',
        'deleted_words', word_count,
        'requires_admin', true
    );
END;
$$;

-- 设置备用函数权限
GRANT EXECUTE ON FUNCTION mark_user_deleted() TO authenticated;

-- =====================================================
-- 管理员清理函数
-- =====================================================

-- 管理员用于完全删除标记为删除的用户
CREATE OR REPLACE FUNCTION admin_cleanup_deleted_users()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- 只有超级用户或特定角色可以执行此函数
    -- 这里可以添加额外的权限检查
    
    -- 查找所有标记为删除的用户
    FOR user_record IN 
        SELECT id, email 
        FROM auth.users 
        WHERE raw_user_meta_data->>'deleted' = 'true'
    LOOP
        -- 删除用户（如果有权限）
        BEGIN
            DELETE FROM auth.users WHERE id = user_record.id;
            deleted_count := deleted_count + 1;
        EXCEPTION WHEN OTHERS THEN
            -- 记录无法删除的用户
            RAISE NOTICE 'Could not delete user: % (%)', user_record.email, user_record.id;
        END;
    END LOOP;

    RETURN json_build_object(
        'success', true,
        'deleted_users', deleted_count,
        'message', format('Cleaned up %s deleted user accounts', deleted_count)
    );
END;
$$;

-- =====================================================
-- 使用说明
-- =====================================================

/*
使用方法：

1. 在 Supabase SQL Editor 中执行此脚本创建函数

2. 客户端调用方式：
   const { data, error } = await supabase.rpc('delete_user_account', {
     user_id: user.id
   })

3. 备用方案调用：
   const { data, error } = await supabase.rpc('mark_user_deleted')

4. 管理员清理：
   const { data, error } = await supabase.rpc('admin_cleanup_deleted_users')

注意事项：
- 函数会检查用户权限，确保只能删除自己的账户
- 如果无法完全删除用户，会标记为已删除状态
- 管理员需要定期运行清理函数来完全删除标记的用户
*/
