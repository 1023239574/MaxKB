WITH RECURSIVE days AS (
  SELECT date_trunc('day', %s::date) AS day
  UNION ALL
  SELECT day + interval '1 day'
  FROM days
  WHERE day < date_trunc('day', %s::date)
),
document_stats AS (
  SELECT
    COUNT(*) AS total_documents,
    d.id AS dataset_id,
    d.name AS dataset_name,
    COUNT(*) AS doc_count,
    SUM(doc.char_length) AS total_chars
  FROM dataset d
  JOIN document doc ON d.id = doc.dataset_id
  GROUP BY d.id, d.name
),
dataset_distribution AS (
  SELECT
    dataset_id,
    dataset_name,
    doc_count,
    ROUND(doc_count * 100.0 / SUM(doc_count) OVER(), 2) AS percentage
  FROM document_stats
),
dataset_app_stats AS (
  SELECT
    d.id AS dataset_id,
    d.name AS dataset_name,
    COUNT(DISTINCT adm.application_id) AS associated_apps_count
  FROM dataset d
  LEFT JOIN application_dataset_mapping adm ON d.id = adm.dataset_id
  GROUP BY d.id, d.name
),
question_stats AS (
  SELECT
    days.day,
    COALESCE(COUNT(acr.id), 0) AS question_count
  FROM days
  LEFT JOIN application_chat_record acr
    ON date_trunc('day', acr.create_time) = days.day
    AND acr.create_time >= %s
    AND acr.create_time < %s + INTERVAL '1 day'
  GROUP BY days.day
  ORDER BY days.day
),
overall_stats AS (
  SELECT
    (SELECT COUNT(*) FROM dataset) AS total_knowledge_bases,
    SUM(doc_count) AS total_documents,
    SUM(total_chars) AS total_chars
  FROM document_stats
)
SELECT
  json_build_object(
    'overall_stats', (SELECT json_build_object(
      'total_knowledge_bases', total_knowledge_bases,
      'total_documents', total_documents,
      'total_chars', total_chars
    ) FROM overall_stats),
    'document_stats', (SELECT json_build_object(
      'total_documents', SUM(doc_count),
      'dataset_distribution', json_agg(json_build_object(
        'dataset_name', dataset_name,
        'document_count', doc_count,
        'percentage', percentage
      ))
    ) FROM dataset_distribution),
    'dataset_app_stats', (SELECT json_agg(json_build_object(
      'dataset_id', dataset_id,
      'dataset_name', dataset_name,
      'associated_apps_count', associated_apps_count
    )) FROM dataset_app_stats),
    'question_stats', (SELECT json_agg(json_build_object(
      'day', to_char(day, 'YYYY-MM-DD'),
      'question_count', question_count
    ) ORDER BY day) FROM question_stats)
  ) AS combined_stats;