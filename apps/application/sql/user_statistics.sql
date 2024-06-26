WITH
-- 用户数
user_count AS (
    SELECT COUNT(DISTINCT main_account) AS user_count
    FROM application_chat
),

-- 月用户访问量 (uv)
monthly_uv AS (
    SELECT COUNT(DISTINCT main_account) AS uv
    FROM application_chat
    WHERE create_time >= date_trunc('month', current_date)
),

-- 月点击访问量 (pv)
monthly_pv AS (
    SELECT COUNT(*) AS pv
    FROM application_chat
    WHERE create_time >= date_trunc('month', current_date)
),

-- 近24小时活跃用户数
daily_active AS (
    SELECT
        array_agg(hour) AS x,
        array_agg(active_users) AS y
    FROM (
        SELECT
            extract(hour FROM create_time) AS hour,
            COUNT(DISTINCT main_account) AS active_users
        FROM application_chat
        WHERE create_time >= now() - interval '1 day'
        GROUP BY extract(hour FROM create_time)
    ) sub
),

-- 近七天活跃用户数
week_active AS (
    SELECT
        array_agg(date::date) AS x,
        array_agg(active_users) AS y
    FROM (
        SELECT
            date_trunc('day', create_time) AS date,
            COUNT(DISTINCT main_account) AS active_users
        FROM application_chat
        WHERE create_time >= now() - interval '7 days'
        GROUP BY date_trunc('day', create_time)
    ) sub
),

-- 近30天活跃用户数
month_active AS (
    SELECT
        array_agg(date::date) AS x,
        array_agg(active_users) AS y
    FROM (
        SELECT
            date_trunc('day', create_time) AS date,
            COUNT(DISTINCT main_account) AS active_users
        FROM application_chat
        WHERE create_time >= now() - interval '30 days'
        GROUP BY date_trunc('day', create_time)
    ) sub
)

-- 合并所有结果
SELECT
    (SELECT user_count FROM user_count) AS user_count,
    (SELECT uv FROM monthly_uv) AS uv,
    (SELECT pv FROM monthly_pv) AS pv,
    (SELECT json_build_object('x', x, 'y', y) FROM daily_active LIMIT 1) AS daily_active,
    (SELECT json_build_object('x', x, 'y', y) FROM week_active LIMIT 1) AS week_active,
    (SELECT json_build_object('x', x, 'y', y) FROM month_active LIMIT 1) AS month_active;