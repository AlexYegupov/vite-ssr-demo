const TODOS_KEY = "todos";

export const uuid = () => Math.random().toString(36).substr(2, 9);


export function saveTodos(todos) {
  if (typeof window === 'undefined') return;
  return localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function initializeTodos() {
  let todos = new Array(10)
    .fill(null)
    .reduce(
      (acc, _, index) =>
        Object.assign(acc, { [index]: `Seeded Todo #${index + 1}` }),
      {}
    );
  saveTodos(todos);
  return todos;
}

export function getTodos() {
  let todos = null;
  try {
    // @ts-expect-error OK to throw here since we're catching
    todos = JSON.parse(localStorage.getItem(TODOS_KEY));
  } catch (e) {}
  if (!todos) {
    todos = initializeTodos();
  }
  console.log(`getTodos`)
  return todos;
}

export function addTodo(todo) {
  if (typeof window === 'undefined') return;
  let newTodos = { ...getTodos() };
  newTodos[uuid()] = todo;
  saveTodos(newTodos);
}

export function deleteTodo(id) {
  if (typeof window === 'undefined') return;
  let newTodos = { ...getTodos() };
  delete newTodos[id];
  saveTodos(newTodos);
}

export function resetTodos() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(TODOS_KEY);
  initializeTodos();
}
