WITH RECURSIVE rebranding AS (
  SELECT id, prev_id, id as root_id, ARRAY[id] as path
  FROM pickup_point
  WHERE branded_since = :targetDate

  UNION

  SELECT pp.id, pp.prev_id, r.root_id, r.path || r.prev_id
  FROM rebranding r
  LEFT JOIN pickup_point pp ON pp.id = r.prev_id
  WHERE r.prev_id != ALL(r.path)
)
SELECT r.root_id
FROM rebranding r
LEFT JOIN brand_data bd ON bd.pickup_point_id = ANY(r.path)
GROUP BY r.root_id
HAVING COUNT(bd.pickup_point_id) = 0;
