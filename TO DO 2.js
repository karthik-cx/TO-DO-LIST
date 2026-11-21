
// Get HTML Elements

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

// Load saved tasks from localStorage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Display Current Date

document.getElementById("currentDate").textContent =
    new Date().toDateString();

// Save Tasks

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add New Task

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") return;

    const newTask = {
        id: Date.now(),
        name: taskName,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
});

// Display Tasks

function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(function(task) {

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        const matchesSearch =
            task.name.toLowerCase().includes(searchText);

        return matchesFilter && matchesSearch;
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(function(task) {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        // Task Information

        const left = document.createElement("div");
        left.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.name;

        const priority = document.createElement("span");
        priority.className = "priority " + task.priority;
        priority.textContent = task.priority;

        left.append(checkbox, name, priority);

        // Action Buttons

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editTask(task.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        actions.append(editButton, deleteButton);

        taskItem.append(left, actions);

        taskList.appendChild(taskItem);

    });

    updateStats();
}

// Mark Task as Completed

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Edit Task

function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    const newName = prompt("Edit your task:", task.name);

    if (newName === null) return;

    if (newName.trim() === "") {
        alert("Task name cannot be empty!");
        return;
    }

    task.name = newName.trim();

    saveTasks();
    renderTasks();
}

// Delete Task

function deleteTask(id) {

    const confirmDelete = confirm("Delete this task?");

    if (!confirmDelete) return;

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

// Filter Tasks

const filterButtons = document.querySelectorAll(".nav-item");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Search Tasks

searchInput.addEventListener("input", renderTasks);

// Update Dashboard Statistics

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressText").textContent =
        percentage + "% completed";

    document.getElementById("progressFill").style.width =
        percentage + "%";
}

// Initial Display

renderTasks();
