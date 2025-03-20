export function InitOngoingScheduleSection() {
    const tableData = document.querySelector('.table-data');

    const fakeRooms = [
        {name: "PTC 206", block: "1", teacher: "Mr. Smith", time: "08:00 AM - 10:00 AM"},
        {name: "PTC 207", block: "2", teacher: "Ms. Johnson", time: "10:00 AM - 12:00 PM"},
        {name: "PTC 211", block: "3", teacher: "Dr. Brown", time: "01:00 AM - 03:00 PM"},
        {name: "PTC 265", block: "4", teacher: "Prof. Wilson", time: "03:00 AM - 05:00 PM"},
        {name: "PTC 326", block: "5", teacher: "Mrs. Taylor", time: "08:00 AM - 10:00 AM"},
        {name: "PTC 398", block: "6", teacher: "Mr. Anderson", time: "10:00 AM - 12:00 PM"},
        {name: "PTC 423", block: "7", teacher: "Dr. Martinez", time: "01:00 AM - 03:00 PM"},
        {name: "PTC 445", block: "8", teacher: "Ms. Garcia", time: "03:00 AM - 05:00 PM"},
        {name: "PTC 561", block: "8", teacher: "Mr. Lee", time: "08:00 AM - 10:00 AM"},
        {name: "PTC 574", block: "10", teacher: "Prof. White", time: "10:00 AM - 12:00 PM"}
    ];
    
    fakeRooms.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.name}</td>
            <td>${room.block}</td>
            <td>${room.teacher}</td>
            <td>${room.time}</td>
        `;
        tableData.appendChild(row);
    });
}