

export function initOngoingSchedule() {
        const tableData = document.querySelector(".table-data");
    
        // Fake data array
        const fakeRooms = [
            { name: "Room 101", block: "1", teacher: "Mr. Smith", time: "08:00 AM - 10:00 AM" },
            { name: "Room 102", block: "3", teacher: "Ms. Johnson", time: "10:00 AM - 12:00 PM" },
            { name: "Room 103", block: "2", teacher: "Dr. Brown", time: "01:00 PM - 03:00 PM" },
            { name: "Room 104", block: "6", teacher: "Prof. Wilson", time: "03:00 PM - 05:00 PM" },
            { name: "Room 105", block: "5", teacher: "Mrs. Taylor", time: "08:00 AM - 10:00 AM" },
            { name: "Room 106", block: "8", teacher: "Mr. Anderson", time: "10:00 AM - 12:00 PM" },
            { name: "Room 107", block: "2", teacher: "Dr. Martinez", time: "01:00 PM - 03:00 PM" },
            { name: "Room 108", block: "7", teacher: "Ms. Garcia", time: "03:00 PM - 05:00 PM" },
            { name: "Room 109", block: "1", teacher: "Mr. Lee", time: "08:00 AM - 10:00 AM" },
            { name: "Room 109", block: "1", teacher: "Mr. Lee", time: "08:00 AM - 10:00 AM" },
            { name: "Room 109", block: "1", teacher: "Mr. Lee", time: "08:00 AM - 10:00 AM" },
            { name: "Room 109", block: "1", teacher: "Mr. Lee", time: "08:00 AM - 10:00 AM" },
            { name: "Room 110", block: "4", teacher: "Prof. White", time: "10:00 AM - 12:00 PM" }
        ];
    
        // Insert fake data into table
        fakeRooms.forEach(room => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${room.name}</td>
                <td>${room.block}</td>
                <td>${room.teacher}</td>
                <td>${room.time}</td>
            `;
            tableData.appendChild(row);
        });
}