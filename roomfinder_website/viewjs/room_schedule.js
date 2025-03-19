


export function InitRoomSchedule() {

    const tableData = document.querySelector(".table-data");

    // Fake data array
    const fakeRooms = [
        { name: "Room 101", dateTime: "Jan. 11, 2025 <br /> 08:00am - 09:30am", teacher: "Mr. Smith", status: "Available" },
        { name: "Room 102", dateTime: "Jan. 11, 2025 <br /> 09:30am - 11:00am", teacher: "Ms. Johnson", status: "Occupied" },
        { name: "Room 103", dateTime: "Jan. 11, 2025 <br /> 11:00am - 12:30pm", teacher: "Dr. Brown", status: "Closed" },
        { name: "Room 104", dateTime: "Jan. 11, 2025 <br /> 01:00pm - 02:30pm", teacher: "Prof. Wilson", status: "Available" },
        { name: "Room 105", dateTime: "Jan. 11, 2025 <br /> 02:30pm - 04:00pm", teacher: "Mrs. Taylor", status: "Occupied" },
        { name: "Room 106", dateTime: "Jan. 11, 2025 <br /> 04:00pm - 05:30pm", teacher: "Mr. Anderson", status: "Closed" },
        { name: "Room 107", dateTime: "Jan. 11, 2025 <br /> 05:30pm - 07:00pm", teacher: "Dr. Martinez", status: "Available" },
        { name: "Room 108", dateTime: "Jan. 11, 2025 <br /> 07:00pm - 08:30pm", teacher: "Ms. Garcia", status: "Occupied" },
        { name: "Room 109", dateTime: "Jan. 11, 2025 <br /> 08:30pm - 10:00pm", teacher: "Mr. Lee", status: "Closed" },
        { name: "Room 110", dateTime: "Jan. 11, 2025 <br /> 10:00pm - 11:30pm", teacher: "Prof. White", status: "Available" }
    ];

    // Insert fake data into table
    fakeRooms.forEach(room => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${room.name}</td>
            <td>${room.dateTime}</td>
            <td>${room.teacher}</td>
            <td>${room.status}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        tableData.appendChild(row);
    });



    console.log('funcition triggered')
        let statuses = document.querySelectorAll("td:nth-child(4)");
        statuses.forEach((statusCell) => {
            let text = statusCell.textContent.trim().toLowerCase();
            statusCell.innerHTML = `<span class="status ${text}">${statusCell.textContent}</span>`;
        });
}