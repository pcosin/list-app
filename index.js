
import  apiUrl  from "./config.js";

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const logoutEl = document.getElementById("logout")

window.onload = function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    window.currentUser = user;
  } else {
    window.location.href = "./index.html";
  }
};

logoutEl.addEventListener('click', logout);

function logout() {
  localStorage.clear();
  location.reload();
}



function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function addTask(inputValue) {
  const user = getUser()
  fetch(`${apiUrl}/users/${user.username}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: window.currentUser.username,
      task: inputValue,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al agregar tarea");
      }
      return response.json();
    })
    .then((newTask) => {
      appendItemToShoppingListEl(newTask);
      clearInputFieldEl();
    })
    .catch((error) => console.error("Error al agregar tarea:", error.message));
}

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  if (inputValue !== "") {
    addTask(inputValue);
  }
});

inputFieldEl.addEventListener("keydown", function (event) {
  let inputValue = inputFieldEl.value;
  if (inputValue !== "" && event.key === "Enter") {
    addTask(inputValue);
  }
});

function snap() {
  const user = getUser();
  fetch(`${apiUrl}/tasks/${user.username}`)
    .then((response) => response.json())
    .then((tasks) => {
      clearShoppingListEl();
      tasks.forEach((task) => appendItemToShoppingListEl(task));
    })
    .catch((error) => console.error("Error al obtener tareas:", error));
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(task) {
  const user = getUser()

  let taskId = task._id;
  let taskTitle = task.task;

  let newEl = document.createElement("li");

  newEl.textContent = taskTitle;

  newEl.addEventListener("click", function () {
    fetch(`${apiUrl}/users/${user.username}/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
        newEl.remove();
      })
      .catch((error) => console.error("Error al eliminar tarea:", error));
  });

  shoppingListEl.append(newEl);
}
snap();
