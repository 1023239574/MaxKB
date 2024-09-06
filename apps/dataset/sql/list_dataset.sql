SELECT
    *,
    to_json(meta) as meta
FROM
    (
    SELECT
        "temp_dataset".*,
        CASE
            WHEN temp_dataset.doc_type = '1' THEN COALESCE("document_temp"."char_length", 0)
            ELSE 0
        END as char_length,
        CASE
            WHEN "app_dataset_temp"."count" IS NULL THEN 0
            ELSE "app_dataset_temp"."count"
        END AS application_mapping_count,
        COALESCE(
            CASE
                WHEN temp_dataset.doc_type = '1' THEN "document_temp".document_count
                ELSE "other_table_temp".document_count
            END,
            0
        ) as document_count
    FROM (
        SELECT dataset.*
        FROM
            dataset dataset
        WHERE "dataset"."user_id" = %s
             UNION
        SELECT
            *
        FROM
            dataset
        WHERE
            dataset."id" IN (
            SELECT
                team_member_permission.target
            FROM
                team_member team_member
                LEFT JOIN team_member_permission team_member_permission ON team_member_permission.member_id = team_member."id"
            WHERE ("team_member_permission"."auth_target_type" = %s AND "team_member_permission"."operate" @> (ARRAY[%s])::varchar(256)[] AND "user_id" = %s)
            )
        ) temp_dataset
        LEFT JOIN (
            SELECT "count" ( "id" ) AS document_count, "sum" ( "char_length" ) "char_length", dataset_id
            FROM "document"
            GROUP BY dataset_id
        ) "document_temp" ON temp_dataset."id" = "document_temp".dataset_id AND temp_dataset.doc_type = '1'
        LEFT JOIN LATERAL (
            SELECT COALESCE(SUM(count_records(dtm.table_name)), 0) AS document_count
            FROM dataset_table_mapping dtm
            WHERE dtm.dataset_id = temp_dataset.id
        ) "other_table_temp" ON temp_dataset.doc_type != '1'
        LEFT JOIN (SELECT "count"("id"),dataset_id FROM application_dataset_mapping GROUP BY dataset_id) app_dataset_temp  ON temp_dataset."id" = "app_dataset_temp".dataset_id
    ) temp
    ORDER BY ("temp".create_time) DESC