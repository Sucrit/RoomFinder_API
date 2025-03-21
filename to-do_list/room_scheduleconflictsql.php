"SELECT * 
FROM room_schedule 
WHERE room_id = 9 
  AND date = '2025-03-21' 
  AND (
    (starting_time < '11:00:00' AND ending_time > '12:00:00') 
    OR 
    (
      ('11:00:00' BETWEEN starting_time AND ending_time) 
      AND ('12:00:00' BETWEEN starting_time AND ending_time)
    )
    OR 
    ('11:00:00' = starting_time)  
    OR 
    ('12:00:00' = ending_time)
  );
"