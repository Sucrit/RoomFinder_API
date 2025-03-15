

// ADD USER VIEW JS

import AdminViewModel from '/roomfinder_website/viewmodel/adminViewModel.js';

    document.addEventListener('DOMContentLoaded', function () {
        const addUserBtn = document.getElementById('addBtn');
        const addAnotherUserBtn = document.getElementById('addAnotherUserBtn');

        // bind form submission to view model
        addUserBtn.addEventListener('click', function() {
            AdminViewModel.handleAddUserForm();
        });

        // bind the "Add another" button to reset the form
        addAnotherUserBtn.addEventListener('click', function() {
            document.querySelector('.roleform').reset();
        });
    });