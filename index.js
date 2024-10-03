const renderTasksProgressData = (tasks) => {
  let tasksProgress;
  const tasksProgressDOM = document.getElementById("tasks-progress");

  if (tasksProgressDOM) tasksProgress = tasksProgressDOM;
  else {
    const newTasksProgressDOM = document.createElement("div");
    newTasksProgressDOM.id = "tasks-progress";
    document.getElementById("todo-footer").appendChild(newTasksProgressDOM);
    tasksProgress = newTasksProgressDOM;
  }

  const doneTasks = tasks.filter(({ checked }) => checked).length;
  const totalTasks = tasks.length;
  tasksProgress.textContent = `${doneTasks}/${totalTasks} concluídas`;
};

const getTasksFromLocalStorage = () => {
  const localTasks = JSON.parse(window.localStorage.getItem("tasks"));
  return localTasks ? localTasks : [];
};

const setTasksInLocalStorage = (tasks) => {
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
};

const removeTask = (taskId) => {
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.filter(
    ({ id }) => parseInt(id) !== parseInt(taskId)
  );
  setTasksInLocalStorage(updatedTasks);
  renderTasksProgressData(updatedTasks);

  document
    .getElementById("todo-list")
    .removeChild(document.getElementById(taskId));
};

const removeDoneTasks = () => {
  const tasks = getTasksFromLocalStorage();

  const tasksToRemove = tasks
    .filter(({ checked }) => checked)
    .map(({ id }) => id);

  const updatedTasks = tasks.filter(({ checked }) => !checked);

  setTasksInLocalStorage(updatedTasks);
  renderTasksProgressData(updatedTasks);

  tasksToRemove.forEach((taskId) => {
    const taskElement = document.getElementById(taskId);
    if (taskElement) {
      document.getElementById("todo-list").removeChild(taskElement);
    }
  });
};

const createTaskListItem = (task) => {
  const list = document.getElementById("todo-list");
  const toDo = document.createElement("li");

  const concludeTaskButton = document.createElement("button");
  concludeTaskButton.textContent = "Concluir";
  concludeTaskButton.ariaLabel = "Concluir tarefa";

  concludeTaskButton.onclick = () => {
    task.checked = !task.checked;

    if (task.checked) {
      toDo.classList.add("completed");
      concludeTaskButton.innerHTML = '<img src="/RID-187098-Desafio-3/check.svg" alt="Concluído">';
      concludeTaskButton.style.pointerEvents = "none";
      concludeTaskButton.style.background = "transparent";
      concludeTaskButton.style.border = "none"; 
    }

    updateTaskState(task);
  };

  const taskDescription = document.createElement("span");
  taskDescription.textContent = task.description;

  toDo.id = task.id;
  toDo.appendChild(taskDescription);

  if (task.poll) {
    const pollText = document.createElement("p");
    pollText.textContent = `Criado em: ${task.poll}`;
    toDo.appendChild(pollText);
  }

  toDo.appendChild(concludeTaskButton);
  list.appendChild(toDo);

  if (task.checked) {
    toDo.classList.add("completed");
    concludeTaskButton.innerHTML = '<img src="/Desafio-3/check.svg">';
    concludeTaskButton.style.pointerEvents = "none";
    concludeTaskButton.style.background = "transparent";
    concludeTaskButton.style.border = "none";
  }

  return toDo;
};

const updateTaskState = (updatedTask) => {
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  setTasksInLocalStorage(updatedTasks);
  renderTasksProgressData(updatedTasks);
};

const onCheckboxClick = (event) => {
  const [id] = event.target.id.split("-");
  const tasks = getTasksFromLocalStorage();

  const updatedTasks = tasks.map((task) => {
    return parseInt(task.id) === parseInt(id)
      ? { ...task, checked: event.target.checked }
      : task;
  });

  setTasksInLocalStorage(updatedTasks);
  renderTasksProgressData(updatedTasks);
};

const getCheckboxInput = ({ id, description, checked }) => {
  const checkbox = document.createElement("input");
  const label = document.createElement("label");
  const wrapper = document.createElement("div");
  const checkboxId = `${id}-checkbox`;

  checkbox.type = "checkbox";
  checkbox.id = checkboxId;
  checkbox.checked = checked || false;
  checkbox.addEventListener("change", onCheckboxClick);

  label.textContent = description;
  label.htmlFor = checkboxId;

  wrapper.className = "checkbox-label-container";

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  return wrapper;
};

const getNewTaskId = () => {
  const tasks = getTasksFromLocalStorage();
  const lastId = tasks[tasks.length - 1]?.id;
  return lastId ? lastId + 1 : 1;
};

const getNewTaskData = (event) => {
  const description = event.target.elements.description.value;
  const id = getNewTaskId();
  const poll = event.target.elements.poll.value;
  return { description, poll, id };
};

const getCreatedTaskInfo = (event) => getNewTaskData(event);

const createTask = async (event) => {
  event.preventDefault();
  document.getElementById("save-task").setAttribute("disabled", true);
  const newTaskData = await getCreatedTaskInfo(event);

  const checkbox = getCheckboxInput(newTaskData);
  createTaskListItem(newTaskData, checkbox);

  const tasks = getTasksFromLocalStorage();
  const updatedTasks = [
    ...tasks,
    {
      id: newTaskData.id,
      description: newTaskData.description,
      poll: newTaskData.poll,
      checked: false,
    },
  ];
  setTasksInLocalStorage(updatedTasks);
  renderTasksProgressData(updatedTasks);
  const descriptionInput = document.getElementById("description");
  const pollInput = document.getElementById("poll");
  event.target.reset();

  document.getElementById("description").value = "";
  document.getElementById("poll").value = "";
  document.getElementById("save-task").disabled = false;

};

window.onload = function () {
  const form = document.getElementById("create-todo-form");
  form.addEventListener("submit", createTask);

  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    const checkbox = getCheckboxInput(task);
    createTaskListItem(task, checkbox);
  });

  renderTasksProgressData(tasks);

  const removeDoneButton = document.getElementById("remove-done-tasks");
  removeDoneButton.addEventListener("click", removeDoneTasks);
};
