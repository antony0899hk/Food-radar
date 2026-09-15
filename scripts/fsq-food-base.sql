-- CEGO Food Radar / Foursquare Open Source Places
-- Run after connecting DuckDB to the Foursquare Places Portal Iceberg catalog.
-- Restaurant parent category is the official Foursquare level-2 Restaurants category.
-- Change the country list to extend CEGO without changing Core code.

WITH food_places AS (
  SELECT DISTINCT p.fsq_place_id
  FROM places p
  CROSS JOIN UNNEST(p.fsq_category_ids) AS u(fsq_category_id)
  JOIN categories c ON c.category_id = u.fsq_category_id
  WHERE c.level2_category_id = '4d4b7105d754a06374d81259'
)
SELECT
  p.fsq_place_id,
  p.name,
  p.latitude,
  p.longitude,
  p.address,
  p.locality,
  p.region,
  p.postcode,
  p.country,
  p.date_created,
  p.date_refreshed,
  p.date_closed,
  p.fsq_category_ids,
  p.fsq_category_labels,
  p.unresolved_flags
FROM places p
JOIN food_places f USING (fsq_place_id)
WHERE p.country IN ('HK','KR','TW')
  AND p.date_closed IS NULL;
