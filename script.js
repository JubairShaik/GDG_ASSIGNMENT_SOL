// DOM Selectors
const taskInput = document.querySelector("#addTaskName");
const dateInput = document.querySelector("#addTaskDate");
const prioritySelect = document.querySelector("#addTaskPriority");
const addTaskButton = document.querySelector("#addTaskBtn");
const upcomingSection = document.querySelector("#upcomingSectionContainer");
const completedSection = document.querySelector("#completedSectionContainer");
const sortFilterSelect = document.querySelector("#sortFilter");

// Modal Open and Close functionality
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const modalOverlay = document.getElementById("modalOverlay");

// Event Listeners
openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);

// Later
sortFilterSelect.addEventListener("change", (event) => {
  sortFilter = event.target.value;
  renderAllTasks();
});

// State/Variables
let upcomingTasks = [
  {
    id: 1,
    name: "JS Study Jam",
    dueDate: "2024-12-08",
    priority: "high",
    completed: false,
  },
  {
    id: 3,
    name: "Python Study Jam",
    dueDate: "2024-12-15",
    priority: "low",
    completed: false,
  },
];
let completedTasks = [
  {
    id: 2,
    name: "HTML Study Jam",
    dueDate: "2024-11-24",
    priority: "medium",
    completed: true,
  },
];
let taskIdToEdit = null;
let sortFilter = "all";

// Event Listeners
addTaskButton.addEventListener("click", handleAddOrEditTask);

// functions
function closeModal() {
  modalOverlay.classList.remove("flex");
  modalOverlay.classList.add("hidden");
  resetInputs();
}

function openModal() {
  // check first if edit mode or add mode
  modalOverlay.classList.add("flex");
  modalOverlay.classList.remove("hidden");
}

function renderTask(task, section) {
    const id = task.id;
    const name = task.name;
    const dueDate = task.dueDate;
    const priority = task.priority;
    const completed = task.completed;
//   const { id, name, dueDate, priority, completed } = task;

  const priorityClass =
    priority === "high"
      ? "text-red-400"
      : priority === "medium"
      ? "text-yellow-400"
      : "text-green-400";

    // traditional way of priorityClass
    // let priorityClass = "";
    // if (priority === "high") {
    //     priorityClass = "text-red
    // } else if (priority === "medium") {
    //     priorityClass = "text-yellow"
    // } else {
    //     priorityClass = "text-green"
    // }

  const taskCard = document.createElement("div");
  taskCard.id = `task-${id}`;
  taskCard.className =
    "bg-[#1E1E1E] flex justify-between min-h-20 rounded-md p-3";

  let priorityColor = "";
  if (priority === "high") {
    priorityColor = "red-border";
  } else if (priority === "medium") {
    priorityColor = "yellow-border";
  } else {
    priorityColor = "green-border";
  }

  taskCard.innerHTML = `
        <div class="task-card ${completed ? "grey-border" : priorityColor}">
            <div class="task-details">
                <div class="task-header">
                    <i class=" fas fa-clipboard"></i>
                    <h2 class="task-title ${
                      completed ? "line-through" : ""
                    }">${name}</h2>
                </div> 
                <p class="task-date ${
                  completed && "line-through"
                }">${dueDate}</p>
            </div>
            <div class="task-actions">
                <button class="${
                  completed && "hidden"
                } color-white edit-btn"><i class="fas fa-edit"></i></button>
                <button class="color-white delete-btn"><i class="fas fa-trash"></i></button>
                <input type="checkbox" ${
                  completed && "checked"
                } class="task-checkbox"/>
            </div>
        </div>
    `;

  section.appendChild(taskCard);

  // Add event listeners
  taskCard
    .querySelector(".edit-btn")
    .addEventListener("click", () => editTask(id));
  taskCard
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteTask(id));
  taskCard
    .querySelector('input[type="checkbox"]')
    .addEventListener("change", () => toggleComplete(id));
}

function renderAllTasks() {
  upcomingSection.innerHTML = "";
  completedSection.innerHTML = "";

  if (sortFilter === "priority") {
    upcomingTasks.sort((a, b) => {
      if (a.priority === "high" && b.priority !== "high") return -1;
      if (a.priority === "medium" && b.priority === "low") return -1;
      if (a.priority === "low" && b.priority !== "low") return 1;
      return 0;
    });
  } else if (sortFilter === "date") {
    upcomingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  upcomingTasks.forEach((task) => renderTask(task, upcomingSection));
  completedTasks.forEach((task) => renderTask(task, completedSection));

  // example of tradional for loop
  // for (let i = 0; i < upcomingTasks.length; i++) {
  //     const task = upcomingTasks[i];
  //     renderTask(task, upcomingSection);
  // }

  // for (let i = 0; i < completedTasks.length; i++) {
  //     const task = completedTasks[i];
  //     renderTask(task, completedSection);
  // }

  // save to local storage
  // localStorage.setItem('GDG_upcomingTasks', JSON.stringify(upcomingTasks));
  // localStorage.setItem('GDG_completedTasks', JSON.stringify(completedTasks));
}

function handleAddOrEditTask(event) {
  event.preventDefault();

  const taskName = taskInput.value.trim();
  const dueDate = dateInput.value;
  const priority = prioritySelect.value;

  if (!taskName || !dueDate) {
    alert("Please fill out all fields.");
    return;
  }

  if (taskIdToEdit !== null) {
    updateTask(taskIdToEdit, taskName, dueDate, priority);
    taskIdToEdit = null;
  } else {
    addTask(taskName, dueDate, priority);
  }

  resetInputs();
}

function addTask(name, dueDate, priority) {
  const taskId = Date.now();
  const task = { id: taskId, name, dueDate, priority, completed: false };
  upcomingTasks.push(task);

  renderTask(task, upcomingSection);
  closeModal();
}

function editTask(taskId) {
  const task = upcomingTasks.find((task) => task.id === taskId);
  if (!task) return;

  taskInput.value = task.name;
  dateInput.value = task.dueDate;
  prioritySelect.value = task.priority;
  taskIdToEdit = taskId;

  modalOverlay.classList.add("flex");
  modalOverlay.classList.remove("hidden");
}

function updateTask(taskId, name, dueDate, priority) {
  const task = upcomingTasks.find((task) => task.id === taskId);
  if (!task) return;

  task.name = name;
  task.dueDate = dueDate;
  task.priority = priority;

  modalOverlay.classList.add("hidden");
  modalOverlay.classList.remove("flex");
  renderAllTasks();
}

function deleteTask(taskId) {;

  upcomingTasks = upcomingTasks.filter((task) => task.id !== taskId);
  completedTasks = completedTasks.filter((task) => task.id !== taskId);

  renderAllTasks();
}

function toggleComplete(taskId) {
  let task = upcomingTasks.find((task) => task.id === taskId);
  if (task) {
    task.completed = true;
    completedTasks.push(task);
    upcomingTasks = upcomingTasks.filter((task) => task.id !== taskId);
  } else {
    task = completedTasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = false;
      upcomingTasks.push(task);
      completedTasks = completedTasks.filter((task) => task.id !== taskId);
    }
  }

  renderAllTasks();
}

function resetInputs() {
    taskInput.value = "";
    dateInput.value = "";
    prioritySelect.value = "low";
}

renderAllTasks();
