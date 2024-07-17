SELECT p.content
FROM paragraph p
JOIN document d ON p.document_id = d.id
JOIN dataset ds ON p.dataset_id = ds.id AND d.dataset_id = ds.id
JOIN application a ON ds.user_id = a.user_id
WHERE a.id = %s
  AND ds.id = %s
  AND d.name = %s
  AND p.title LIKE CONCAT('%%', %s, '%%')
  limit 1;
