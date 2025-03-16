// init whole dashboard(fix!)
// init dashboard btn onli
window.InitSeeAllButton = function() {
    const seeRequestHistoryBtn = document.querySelector('.seerequesthistory-btn');
    if (seeRequestHistoryBtn) {
        seeRequestHistoryBtn.addEventListener('click', function() {
            showSection('request_history');
        });
    }

    const seeOngoingSchedule = document.querySelector('.seeongoingschedule-btn');
    if (seeOngoingSchedule) {
        seeOngoingSchedule.addEventListener('click', function(){
            showSection('ongoing_schedule')
        })
    }
};