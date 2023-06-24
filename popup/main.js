const form = document.getElementById("submit-form");
const listTasks = document.getElementById("list-tasks");
const maxConstraintTask = document.getElementById("maxConstraintTask");

const tasks = [];

form.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    console.log("inside the form submit");
    const formFields = e.target.elements;

    const inText = formFields.inputTask;
    const _tasks = await getStorage("tasks");
    const _config = await getStorage("config");

    console.log({
      inText: inText.value,
      length: _tasks.tasks.length,
      config: _config?.config ?? 5,
    });

    if (inText.value != "" && _tasks.tasks.length < (_config?.config ?? 5)) {
      tasks.push(inText.value);
      setStorage({ tasks: [..._tasks.tasks, inText.value] });
    }

    getListTasks();

    inText.value = "";
  } catch (error) {
    console.log(error);
  }
});

/**
 *
 * @param {string} text
 * @param {number} index
 * @returns {HTMLLIElement}
 */
function ListElementsComponent(text, index) {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex align-content-center border-0 p-0 pe-3";

  const span = document.createElement("span");
  span.className = "text-truncate d-inline-block w-100";
  span.innerText = text;
  li.appendChild(span);

  const button = document.createElement("button");
  button.className = "btn btn-danger";
  button.innerText = "Delete";
  button.onclick = async () => {
    const result = await getStorage("tasks");

    result.tasks.splice(index, 1);

    setStorage({ tasks: result.tasks });
    getListTasks();
  };

  li.appendChild(button);

  return li;
}

async function getListTasks() {
  const result = await getStorage("tasks");

  listTasks.innerHTML = "";

  if (result.hasOwnProperty("tasks")) {
    result.tasks.map((task, indx) => {
      const li = ListElementsComponent(task, indx);
      listTasks.appendChild(li);
    });
  } else {
    setStorage({ tasks: [] });
  }
}

/**
 * @param {string} key
 */
async function getStorage(key) {
  return await chrome.storage.local.get([key]);
}

function setStorage(value) {
  chrome.storage.local.set(value);
}

async function main() {
  getListTasks();

  const configs = await getStorage("config");
  maxConstraintTask.innerText = configs.config ?? 5;
}

main();
