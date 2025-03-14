INSERT INTO `room_request`(
    `id`,
    `room_id`,
    `student_id`,
    `block`,
    `purpose`,
    `starting_time`,
    `ending_time`,
    `receiver`,
    `status`
)
VALUES(
    1,
    5,
    11,
    '5',
    'for Practice',
    '20:00:00',
    '22:00:00',
    'Admin',
    'Approved'
);

INSERT INTO `room_request`(
    `id`,
    `room_id`,
    `student_id`,
    `block`,
    `purpose`,
    `starting_time`,
    `ending_time`,
    `receiver`,
    `status`
)
VALUES
(2, 3, 11, '3', 'Study Session', '18:00:00', '20:00:00', 'Admin', 'Pending'),
(3, 4, 11, '2', 'Group Meeting', '15:30:00', '17:00:00', 'Admin', 'Rejected'),
(4, 2, 11, '1', 'Project Discussion', '14:00:00', '16:00:00', 'Admin', 'Approved'),
(5, 6, 11, '4', 'Club Activity', '10:00:00', '12:00:00', 'Admin', 'Pending'),
(6, 7, 11, '5', 'Presentation Rehearsal', '13:00:00', '15:00:00', 'Admin', 'Approved'),
(7, 8, 11, '6', 'Workshop', '09:00:00', '11:00:00', 'Admin', 'Rejected'),
(8, 9, 11, '3', 'Guest Lecture', '16:00:00', '18:00:00', 'Admin', 'Approved'),
(9, 10, 11, '2', 'Exam Preparation', '19:00:00', '21:00:00', 'Admin', 'Pending'),
(10, 1, 11, '1', 'Music Practice', '17:00:00', '19:00:00', 'Admin', 'Approved'),
(11, 5, 11, '4', 'Seminar', '11:00:00', '13:00:00', 'Admin', 'Rejected');