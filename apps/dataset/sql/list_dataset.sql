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
        COALESCE("document_temp".document_count, "other_table_temp".document_count, 0) as document_count
    FROM (
        SELECT dataset.*
        FROM
            dataset dataset
        ${dataset_custom_sql}
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
            ${team_member_permission_custom_sql}
            )
        ) temp_dataset
        LEFT JOIN (
            SELECT "count" ( "id" ) AS document_count, "sum" ( "char_length" ) "char_length", dataset_id
            FROM "document"
            GROUP BY dataset_id
        ) "document_temp" ON temp_dataset."id" = "document_temp".dataset_id AND temp_dataset.doc_type = '1'
        LEFT JOIN (
            SELECT
                "count" ( t."id" ) AS document_count,
                dtm.dataset_id
            FROM
                dataset_table_mapping dtm
                CROSS JOIN LATERAL (
                    SELECT "id"
                    FROM (SELECT dtm.table_name::regclass) AS x,
                         LATERAL json_populate_record(null::document, json_each_text(dtm.table_name::regclass::text)::json) AS t
                ) t
            GROUP BY dtm.dataset_id
        ) "other_table_temp" ON temp_dataset."id" = "other_table_temp".dataset_id AND temp_dataset.doc_type != '1'
        LEFT JOIN (SELECT "count"("id"),dataset_id FROM application_dataset_mapping GROUP BY dataset_id) app_dataset_temp  ON temp_dataset."id" = "app_dataset_temp".dataset_id
    ) temp
    ${default_sql}