


export function InitRoomSchedule() {
    console.log('funcition triggered')
        let statuses = document.querySelectorAll("td:nth-child(4)");
        statuses.forEach((statusCell) => {
            let text = statusCell.textContent.trim().toLowerCase();
            statusCell.innerHTML = `<span class="status ${text}">${statusCell.textContent}</span>`;
        });
}