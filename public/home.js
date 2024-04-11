document.addEventListener('DOMContentLoaded', function () {
    
    const juzListContainer = document.querySelector('.juz-list-container');
    const dropdownButton = document.querySelector('.dropdown-button');
    dropdownButton.style["boxShadow"] = "0px 0px 100px 70px #33333555";

    dropdownButton.addEventListener('click', function () {
        juzListContainer.classList.toggle('expanded');
        if (juzListContainer.classList.contains('expanded')) {
            dropdownButton.textContent = 'Collapse';
            dropdownButton.style["boxShadow"] = "";
        } else {
            dropdownButton.textContent = 'Expand';
            dropdownButton.style["boxShadow"] = "0px 0px 100px 70px #33333555";
    
        }
    });
});
