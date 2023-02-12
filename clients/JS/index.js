let HOST = "http://localhost:5000";

let signupName = document.querySelector("#signupName");
let signupEmail = document.querySelector("#signupEmail");
let signupPassword = document.querySelector("#signupPassword");

let loginEmail = document.querySelector("#loginEmail");
let loginPassword = document.querySelector("#loginPassword");
let todoInput = document.querySelector("#todoInput");
let todoList = document.querySelector("#todoList");
let todolistemptyPrompt = document.querySelector("#todolistempty");
let userOut = document.querySelector("#userOut");
let userIns = Array.from(document.getElementsByClassName("userIn"));
let noUserIn = document.querySelector("#mainPage");
let loginBtn = document.querySelector("#loginModalBtn");
let showAlert = document.querySelector("#showAlert");

function makeAnAlert(alertMessage, alertColor) {
  showAlert.classList.add("alert",`alert-${alertColor}`);
  showAlert.innerHTML = `
        <span class="fs-6 pfont" id="alertMessage">${alertMessage}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
}

// Registration of New User...
async function registerSubmit(event) {
  event.preventDefault();

  let newUser;

  if (signupPassword.value.length >= 8) {
    newUser = {
      fullName: signupName.value,
      email: signupEmail.value,
      password: signupPassword.value,
    };
  }

  try {
    let response = await fetch(`${HOST}/api/v1/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();

    const { alertMsg, success:s, token } = data;

    if (token) {
      document.location.reload(true);
      localStorage.setItem("token", token);
    }

  } 
  catch (error) {
    makeAnAlert(error,'danger');
  }
}

// Login of a Registered User...
async function loginSubmit(event) {
  event.preventDefault();

  let loginUserDetails = {
    email: loginEmail.value,
    password: loginPassword.value,
  };

  try {
    let response = await fetch(`${HOST}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginUserDetails),
    });

    let data = await response.json();

    const { success:s, alertMsg, token } = data;
    
    if (token) {
        document.location.reload(true);
        localStorage.setItem("token", token);
    }

  } catch (error) {
    makeAnAlert(error,'danger');
  }
}

let authToken = localStorage.getItem("token") ;

if (authToken) {
  userIns.forEach((userIn) => {
    userIn.classList.add("d-none");
  });
  userOut.classList.remove("d-none");
} else {
  userIns.forEach((userIn) => {
    userIn.classList.remove("d-none");
  });
  userOut.classList.add("d-none");
}

function logout() {
  localStorage.removeItem("token");
  document.location.reload(true);
  noUserIn.innerHTML = 
  `<div class="w-100 height d-flex flex-column gap-3 justify-content-center align-items-center">
      <h3 class="text-white w-100 py-4 px-3 fs-3 text-center pfont fst-italic">Login OR Signup for using Application.</h3>
  </div>`;
}

// Fetching all user specific TODO...
async function fetchTODO() {
  try {
    let response = await fetch(`${HOST}/api/v1/todos/alltodos`, {
      method: "GET",
      headers: {
        token: authToken,
      },
    });

    let allTodos = await response.json();
    let { todos } = allTodos;

    if (todos.length === 0) {
      todoList.innerHTML =
        '<span id="todolistempty" class="pfont text-danger fs-3">Empty! Add new TODO\'s...</span>';
    } else {
      todolistemptyPrompt.classList.add("d-none");

      todoList.innerHTML = "";
      todos.map((todoItem) => {
        let { _id, todo, completed } = todoItem;

        let todoDiv = document.createElement("div");
        todoDiv.classList.add(
          "card",
          "d-flex",
          "pb-2",
          "flex-column",
          "justify-content-between",
          "align-items-start",
          "w-auto",
          "border-1",
          "border-white",
          "backgroundN",
          "text-white"
        );

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.textContent = todo;

        let buttonsTextDiv = document.createElement("div");
        buttonsTextDiv.classList.add(
          "d-flex",
          "flex-row",
          "justify-content-between",
          "w-100",
          "flex-wrap",
          "align-items-center",
          "px-3",
          "gap-3"
        );

        let cardButtons = document.createElement("div");
        cardButtons.classList.add(
          "card-buttons",
          "d-flex",
          "flex-row",
          "gap-2",
          "my-1"
        );

        let completeBtn = document.createElement("button");
        let incompleteBtn = document.createElement("button");
        let deleteBtn = document.createElement("button");

        incompleteBtn.classList.add("btn", "btn-outline-success");
        completeBtn.classList.add("btn", "btn-outline-warning");
        deleteBtn.classList.add("btn", "btn-outline-danger");

        incompleteBtn.innerHTML = `<i class="fa-solid fa-check fs-6"></i>`;
        completeBtn.innerHTML = `<i class="fa-solid fa-xmark fs-6"></i>`;
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash fs-6"></i>`;

        incompleteBtn.type = "button";
        incompleteBtn.title = "Completed";
        completeBtn.type = "button";
        completeBtn.title = "Not Completed";
        deleteBtn.type = "button";
        deleteBtn.title = "Delete";

        incompleteBtn.addEventListener("click", () => {
          console.log("incomplete");
          toggleComplete(_id, true);
        });

        completeBtn.addEventListener("click", () => {
          console.log("complete");
          toggleComplete(_id, false);
        });

        deleteBtn.addEventListener("click", async () => {
          await deleteTODO(_id);
        });

        cardButtons.append(completed ? completeBtn : incompleteBtn, deleteBtn);

        let spanText = document.createElement("span");
        spanText.classList.add(
          "pfont",
          `${completed ? "text-success" : "text-warning"}`
        );
        spanText.textContent = completed ? "Completed" : "Incomplete";

        buttonsTextDiv.append(cardButtons, spanText);

        todoDiv.append(cardBody, buttonsTextDiv);

        todoList.append(todoDiv);
      });
    }
  } catch (error) {
    makeAnAlert("Error Occured...! Try Reloading Page.", "danger");
  }
}

if (authToken) {
  fetchTODO()
    .then(() => {
      console.log("Fetching TODOs...");
    })
    .catch(() => {
      console.log("Error fetching TODOs...");
    });
}

// Creating a new TODO...
async function createTODO(event) {
  event.preventDefault();

  if (!authToken) {
    loginBtn.click();
    todoInput.value = ''
    return;
  }

  let newTodo;
  if (todoInput.value) {
    newTodo = {
      todo: todoInput.value,
    };
  }

  try {
    await fetch(`${HOST}/api/v1/todos/newtodo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: authToken,
      },
      body: JSON.stringify(newTodo),
    });
    makeAnAlert('TODO Added...','success');
    todoInput.value = "";
    await fetchTODO();
  } catch (error) {
    makeAnAlert('Error Occured...! Try Reloading Page.','danger');
  }
}

// Deleting a TODO...
async function deleteTODO(todoID) {
  try {
    let response = await fetch(`${HOST}/api/v1/todos/deletetodo/${todoID}`, {
      method: "DELETE",
      headers: {
        token: authToken,
      },
    });

    makeAnAlert('Deleted Succesfully...','success');
    await fetchTODO();

  } catch (error) {
    makeAnAlert("Error Occured...! Try Reloading Page.", "danger");
  }
}

// Toggling TODO completion...
async function toggleComplete(todoID, todoCompletion) {
  let completionToggle = {
    completed: todoCompletion,
  };

  try {
    let response = await fetch(`${HOST}/api/v1/todos/donetodo/${todoID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: authToken,
      },
      body: JSON.stringify(completionToggle),
    });
    let data = await response.json();
    await fetchTODO();

    const { success:s, alertMsg } = data;
    makeAnAlert(alertMsg , 'warning');
  } catch (error) {
    makeAnAlert("Error Occured...! Try Reloading Page.", "danger");
  }
}

/*
    <div class="card d-flex pb-2 flex-column justify-content-between align-items-start w-auto border-1 border-white backgroundN text-white">
        <div class="card-body">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque, animi?
        </div>
        <div class="card-buttons px-3 d-flex flex-row gap-2 my-1">
            <button type="button" title="Completed" class="btn btn-outline-success"><i class="fa-solid fa-check fs-6"></i></button>
            <button type="button" title="Delete" class="btn btn-outline-danger"><i class="fa-solid fa-trash fs-6"></i></button>
        </div>
    </div>
*/
