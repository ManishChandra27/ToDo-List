const inputField = document.querySelector('input');
const clearBtn = document.querySelector('.clear-button');
const pendingNo = document.querySelector(".pending-no");
const list = document.querySelector('.todoList');

// LOAD saved tasks on startup
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let count = 0;

// Render all saved tasks
window.addEventListener("DOMContentLoaded", () => {
    tasks.forEach(task => {
        addTaskToUI(task.text, task.completed);
    });

    count = tasks.filter(t => !t.completed).length;
    updateNo();
});

// Add new task
inputField.addEventListener("keyup", (e) => {
    let task = inputField.value.trim();

    if (e.key == "Enter" && task.length > 0) {
        
        addTaskToUI(task, false);

        tasks.push({
            text: task,
            completed: false
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        inputField.value = "";
        count++;
        updateNo();
    }
});

function addTaskToUI(taskText, completed){
    list.insertAdjacentHTML("beforeend", `
        <li class="list">
            <input class="checkBox" type="checkbox" ${completed ? "checked" : ""}>
            <span class="task">${taskText}</span>
            <i class="uil uil-trash"></i>
        </li>
    `);
}

// CLICK actions
list.addEventListener("click", (e) => {

    const li = e.target.closest(".list");
    if (!li) return;

    const index = [...list.children].indexOf(li);
    const checkBox = li.querySelector(".checkBox");

    // DELETE
    if (e.target.classList.contains("uil-trash")) {
        if (!checkBox.checked) count--;  // only pending tasks count--

        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        li.remove();
        updateNo();
        return;
    }

    // TASK TEXT / LI BACKGROUND CLICK (toggle)
    if (e.target.classList.contains("task") || e.target.classList.contains("list")) {
        checkBox.checked = !checkBox.checked;
    }

    // UPDATE task completed state
    tasks[index].completed = checkBox.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    if (checkBox.checked) {
        count--;
    } else {
        count++;
    }

    updateNo();
});

// CLEAR ALL
clearBtn.addEventListener("click", () => {
    list.innerHTML = "";
    tasks = [];
    count = 0;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateNo();
});

function updateNo() {
    pendingNo.innerHTML = count + " ";
}
