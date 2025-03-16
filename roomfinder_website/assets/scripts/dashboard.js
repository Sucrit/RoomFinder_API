

// dashboard request history and ongoing schedule button event listeners

document.addEventListener('DOMContentLoaded', function () {

    function addEventListenersToButtons() {
        const seeOngoingScheduleBtn = document.querySelector('.seeongoingschedule-btn');
        const seeRequestHistoryBtn = document.querySelector('.seerequesthistory-btn');

        if (seeOngoingScheduleBtn) {
            seeOngoingScheduleBtn.addEventListener('click', function () {
                showSection('ongoing_schedule');
            });
        }
        if (seeRequestHistoryBtn) {
            seeRequestHistoryBtn.addEventListener('click', function () {
                showSection('request_history');
            });
        }
    }

    // mutationobserver to observe changes to DOM
    const observer = new MutationObserver(function (mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {

                addEventListenersToButtons();
            }
        }
    });

    // observing body for changes
    observer.observe(document.body, { childList: true, subtree: true });
    
    // event listener for button 
    addEventListenersToButtons();

    // get section
    const ongoingScheduleSection = document.getElementById('ongoing_schedule');
    const requestHistorySection = document.getElementById('request_history');

    // initially hidden
    if (ongoingScheduleSection) {
        ongoingScheduleSection.classList.add('hidden');
    }
    if (requestHistorySection) {
        requestHistorySection.classList.add('hidden');
    }
});
