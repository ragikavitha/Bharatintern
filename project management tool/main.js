document.addEventListener("DOMContentLoaded", function () {
    const projectForm = document.getElementById("create-project-form");
    const projectNameInput = document.getElementById("project-name");
    const projectList = document.getElementById("projects");

    projectForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const projectName = projectNameInput.value.trim();
        if (projectName) {
            createProject(projectName);
            projectNameInput.value = "";
        }
    });

    function createProject(projectName) {
        const projectItem = document.createElement("li");
        projectItem.textContent = projectName;
        projectList.appendChild(projectItem);
    }
});
