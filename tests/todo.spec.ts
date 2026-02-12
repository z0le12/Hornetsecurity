import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todoPage';

test.describe('Todo App (POM)', () => {
  let todo: TodoPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    await todo.goto();
  });

  test('reaches the home page', async () => {
    await expect(todo.page).toHaveURL('http://localhost:8080/todo');
    await expect(todo.page).toHaveTitle('Cypress.io: Kitchen Sink');

    await todo.page.screenshot({ path: 'default_homepage.png', fullPage: true });
  });

  test('toggles the todos accordion', async () => {
    const toggleAccordion = todo.page.locator('label[for="toggle-all"]');
    const todoList = todo.page.locator('.main');


    await expect(toggleAccordion).toBeVisible();
    await toggleAccordion.click();
    await expect(todoList).toHaveCSS('display', 'none');
    await todo.page.screenshot({ path: 'todo_list_shrinked.png', fullPage: true });
    await toggleAccordion.click();
    await expect(todoList).toHaveCSS('display', 'block');
    await todo.page.screenshot({ path: 'todo_list_expanded.png', fullPage: true });
  });

  test('adds a todo item', async () => {
    await todo.addTodo('Learn to code better');
    const items = await todo.getTodos();
    expect(items).toContain('Learn to code better');
    await todo.page.screenshot({ path: 'new_todo_item.png', fullPage: true });
  });

  test('displays only the active todo items', async () => {
    await todo.page.goto('http://localhost:8080/todo#/active');
    const active = await todo.getTodos();
    const NumberOfActiveTodos = active.length > 0;
    const activeLink = todo.page.locator('ul.filters li a[href="#/active"]', { hasText: 'Active' });

    if (!NumberOfActiveTodos) {
      console.warn('There were no active todos found, therefore, we created an automated one.');
      await todo.addTodo('Automated todo item');
    };

    await expect(activeLink).toHaveClass(/selected/);
    await todo.page.screenshot({ path: 'active_todo_items.png', fullPage: true });
  });


  test('edits an active todo item', async () => {
    await todo.page.goto('http://localhost:8080/todo#/active');

    let allUnfinishedTodos = await todo.getTodos();
    if (allUnfinishedTodos.length === 0) {
      await todo.addTodo('Automated todo item');
      allUnfinishedTodos = await todo.getTodos();
    }

    const randomTodo = Math.floor(Math.random() * allUnfinishedTodos.length);
    const unEditedTodo = allUnfinishedTodos[randomTodo];

    const newText = `${unEditedTodo}, has been edited`;
    await todo.editTodo(randomTodo, newText);

    const items = await todo.getTodos();
    expect(items).toContain(newText);
  });

  test('edits the second active todo item', async () => {
    await todo.page.goto('http://localhost:8080/todo#/active');

    let allUnfinishedTodos = await todo.getTodos();

    const secondTodo = allUnfinishedTodos[1];

    const newTextForTheSecondTodo = `${secondTodo}, has been edited`;
    await todo.editTodo(1, newTextForTheSecondTodo);

    const items = await todo.getTodos();
    expect(items).toContain(newTextForTheSecondTodo);
  });

  test('edits a completed todo item', async () => {
    await todo.page.goto('http://localhost:8080/todo#/completed');

    let allFinishedTodos = await todo.getTodos();
    if (allFinishedTodos.length === 0) {
      await todo.addTodo('Automated todo item');
      await todo.page.goto('http://localhost:8080/todo');
      const item = todo.page.locator('.todo-list li', { hasText: 'Automated todo item' }).first();
      await item.locator('.toggle').click();
      await todo.page.waitForTimeout(500);
      await expect(item).toHaveClass(/completed/);
      await todo.page.goto('http://localhost:8080/todo#/completed');
      allFinishedTodos = await todo.getTodos();
    }

    const randomTodo = Math.floor(Math.random() * allFinishedTodos.length);
    const unEditedTodo = allFinishedTodos[randomTodo];

    const newText = `${unEditedTodo}, has been edited`;
    await todo.editTodo(randomTodo, newText);

    const items = await todo.getTodos();
    expect(items).toContain(newText);
  });

  test('toggles and clears completed items', async () => {
    await todo.addTodo('Task 1');
    await todo.toggleTodo(-1);
    await todo.clearCompleted();
    const items = await todo.getTodos();
    expect(items).not.toContain('Task 1');
  });

  test('deletes a todo item', async () => {
    await todo.addTodo('To delete');
    await todo.deleteTodo(-1);
    const items = await todo.getTodos();
    expect(items).not.toContain('To delete');
  });
});