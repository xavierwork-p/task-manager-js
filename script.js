// Selección de elementos del DOM
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

// Selecciona todos los botones de filtro
const filterButtons =
  document.querySelectorAll(".filter-btn");

// Recupera tareas guardadas en LocalStorage
let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

// Filtro actual
let currentFilter = "all";

// Guarda las tareas en LocalStorage
function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}

// Renderiza las tareas en pantalla
function renderTasks() {

  // Limpia la lista antes de renderizar
  taskList.innerHTML = "";

  // Filtra tareas según el filtro activo
  let filteredTasks = tasks.filter(task => {

    if (currentFilter === "pending") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;

  });

  // Recorre tareas filtradas
  filteredTasks.forEach((task, index) => {

    // Crea elemento li dinámicamente
    const li = document.createElement("li");

    // Agrega clase si está completada
    if (task.completed) {
      li.classList.add("completed");
    }

    // Inserta contenido HTML
    li.innerHTML = `
      <span>${task.text}</span>

      <div class="task-actions">

        <button class="complete-btn">
          ${task.completed ? "↩" : "✓"}
        </button>

        <button class="delete-btn">
          X
        </button>

      </div>
    `;

    // Selecciona botones internos
    const completeBtn =
      li.querySelector(".complete-btn");

    const deleteBtn =
      li.querySelector(".delete-btn");

    // Evento para completar tarea
    completeBtn.addEventListener("click", () => {

      task.completed = !task.completed;

      saveTasks();
      renderTasks();

    });

    // Evento para eliminar tarea
    deleteBtn.addEventListener("click", () => {

      tasks.splice(index, 1);

      saveTasks();
      renderTasks();

    });

    // Inserta tarea en el DOM
    taskList.appendChild(li);

  });

  // Cuenta tareas pendientes
  const pendingTasks =
    tasks.filter(task => !task.completed).length;

  // Muestra cantidad pendiente
  taskCount.textContent =
    `${pendingTasks} tarea(s) pendientes`;

}

// Evento para agregar tareas
addBtn.addEventListener("click", () => {

  // Elimina espacios vacíos
  const text = taskInput.value.trim();

  // Evita tareas vacías
  if (text === "") return;

  // Agrega nueva tarea al array
  tasks.push({
    text,
    completed: false
  });

  // Limpia input
  taskInput.value = "";

  // Guarda y renderiza
  saveTasks();
  renderTasks();

});

// Eventos de filtros
filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    // Remueve clase activa anterior
    document
      .querySelector(".filter-btn.active")
      .classList.remove("active");

    // Agrega nueva clase activa
    button.classList.add("active");

    // Cambia filtro actual
    currentFilter = button.dataset.filter;

    // Renderiza nuevamente
    renderTasks();

  });

});

// Render inicial
renderTasks();