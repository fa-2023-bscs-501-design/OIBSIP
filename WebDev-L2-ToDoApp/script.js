const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];


// ================================
// SAVE TASKS
// ================================

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


// ================================
// FORMAT TIME
// ================================

function formatTime(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });
}


// ================================
// ADD TASK
// ================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: Date.now(),
        completedAt: null
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
});


// ================================
// RENDER TASKS
// ================================

function renderTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    pendingCount.textContent =
        `${pending.length} ${pending.length === 1 ? "pending" : "pending"}`;

    completedCount.textContent =
        `${completed.length} ${completed.length === 1 ? "completed" : "completed"}`;


    // Pending Empty State

    if (pending.length === 0) {

        pendingTasks.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">○</span>

                <h4>No pending tasks</h4>

                <p>
                    You're all caught up. Add a new task to get started.
                </p>
            </div>
        `;
    }


    // Completed Empty State

    if (completed.length === 0) {

        completedTasks.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">✓</span>

                <h4>No completed tasks</h4>

                <p>
                    Completed tasks will appear here.
                </p>
            </div>
        `;
    }


    pending.forEach(task => {
        pendingTasks.appendChild(createTaskElement(task));
    });


    completed.forEach(task => {
        completedTasks.appendChild(createTaskElement(task));
    });
}


// ================================
// CREATE TASK ELEMENT
// ================================

function createTaskElement(task) {

    const taskItem = document.createElement("article");

    taskItem.className = "task-item";

    taskItem.innerHTML = `
        <button
            class="complete-btn"
            aria-label="${task.completed ? "Mark task as pending" : "Mark task as complete"}"
            title="${task.completed ? "Mark as pending" : "Mark as complete"}"
        >
            ${task.completed ? "✓" : ""}
        </button>

        <div class="task-content">

            <p class="task-text"></p>

            <span class="task-time">
                Added: ${formatTime(task.createdAt)}
                ${task.completedAt ? ` · Completed: ${formatTime(task.completedAt)}` : ""}
            </span>

        </div>

        <div class="task-actions">

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        </div>
    `;


    const taskText = taskItem.querySelector(".task-text");

    taskText.textContent = task.text;


    // Complete / Pending

    const completeButton = taskItem.querySelector(".complete-btn");

    completeButton.addEventListener("click", function () {

        task.completed = !task.completed;

        task.completedAt = task.completed
            ? Date.now()
            : null;

        saveTasks();

        renderTasks();
    });


    // Edit

    const editButton = taskItem.querySelector(".edit-btn");

    editButton.addEventListener("click", function () {

        startEditing(task, taskItem);
    });


    // Delete

    const deleteButton = taskItem.querySelector(".delete-btn");

    deleteButton.addEventListener("click", function () {

        tasks = tasks.filter(item => item.id !== task.id);

        saveTasks();

        renderTasks();
    });


    return taskItem;
}


// ================================
// INLINE EDIT
// ================================

function startEditing(task, taskItem) {

    const taskContent = taskItem.querySelector(".task-content");

    const currentText = task.text;

    taskContent.innerHTML = `
        <input
            type="text"
            class="edit-input"
            value=""
            aria-label="Edit task"
        >

        <span class="task-time">
            Press Enter to save
        </span>
    `;

    const input = taskContent.querySelector(".edit-input");

    input.value = currentText;

    input.focus();

    input.select();


    function saveEdit() {

        const updatedText = input.value.trim();

        if (updatedText !== "") {
            task.text = updatedText;
            saveTasks();
        }

        renderTasks();
    }


    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            saveEdit();
        }

        if (event.key === "Escape") {
            renderTasks();
        }
    });

    input.addEventListener("blur", saveEdit);
}


// ================================
// INITIAL LOAD
// ================================

renderTasks();