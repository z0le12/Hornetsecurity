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
      console.warn('There were no todos found, therefore, we created an automated one.');
    }
    await todo.page.screenshot({ path: 'all_active_todo_items.png', fullPage: true });

    const randomTodo = Math.floor(Math.random() * allUnfinishedTodos.length);
    const unEditedTodo = allUnfinishedTodos[randomTodo];

    const newText = `${unEditedTodo}, has been edited`;
    await todo.editTodo(randomTodo, newText);

    const items = await todo.getTodos();
    expect(items).toContain(newText);

  await todo.page.screenshot({ path: 'all_active_todo_items_after_editing.png', fullPage: true });
  });


  test('edits the second active todo item', async () => {
    await todo.page.goto('http://localhost:8080/todo#/active');

    let allUnfinishedTodos = await todo.getTodos();
    await todo.page.screenshot({ path: 'all_active_todo_items_before_the_second_item_being_edited.png', fullPage: true });

    const secondTodo = allUnfinishedTodos[1];

    const newTextForTheSecondTodo = `${secondTodo}, has been edited`;
    await todo.editTodo(1, newTextForTheSecondTodo);

    const items = await todo.getTodos();
    expect(items).toContain(newTextForTheSecondTodo);
    await todo.page.screenshot({ path: 'all_active_todo_items_after_editing_the_second_item.png', fullPage: true });
  });


  test('edits a completed todo item', async () => {
    await todo.page.goto('http://localhost:8080/todo#/completed');
    await todo.page.screenshot({ path: 'all_completed_todo_items_before_editing.png', fullPage: true });

    let allFinishedTodos = await todo.getTodos();
    if (allFinishedTodos.length === 0) {
      await todo.addTodo('Automated todo item');
      console.warn('There were no todos found, therefore, we created an automated one.');
      await todo.goto();
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
    await todo.page.screenshot({ path: 'all_completed_todo_items_after_editing.png', fullPage: true });
  });


  test('sets a todo item to completed', async () => {
    let allUnfinishedTodos = await todo.getTodos();

    if (allUnfinishedTodos.length === 0) {
      await todo.addTodo('Automated todo item');
      console.warn('There were no todos found, therefore, we created an automated one.');
      allUnfinishedTodos = await todo.getTodos();
    };

    const randomTodo = Math.floor(Math.random() * allUnfinishedTodos.length);
    const completedTodo = allUnfinishedTodos[randomTodo];

    await todo.page.screenshot({ path: 'unfinished_todo_list_expanded.png', fullPage: true });
    await todo.toggleTodo(randomTodo);
    await todo.page.screenshot({ path: 'a_todo_marked_as_completed.png', fullPage: true });
    await todo.page.goto('http://localhost:8080/todo#/completed');
    const items = await todo.getTodos();
    expect(items).toContain(completedTodo);
    await todo.page.screenshot({ path: 'finished_todo_list_expanded.png', fullPage: true });
  });


  test('sets all todo items as completed', async () => {
    let allUnfinishedTodos = await todo.getTodos();

    if (allUnfinishedTodos.length === 0) {
      await todo.addTodo('Automated todo item');
      console.warn('There were no todos found, therefore, we created an automated one.');
      allUnfinishedTodos = await todo.getTodos();
    };

    const numberOfUnfinishedTodos = allUnfinishedTodos.length;
    await todo.page.screenshot({ path: 'all_unfinished_todos.png', fullPage: true });

  for (let i = 0; i < allUnfinishedTodos.length; i++) {
    const itemLocator = todo.page.locator('.todo-list li').nth(i);
    await todo.toggleTodo(i);
    await todo.page.waitForTimeout(500);
    await expect(itemLocator).toHaveClass(/completed/);
  };

    await todo.page.goto('http://localhost:8080/todo#/completed');
    const items = await todo.getTodos();
    expect(items.length).toBe(numberOfUnfinishedTodos);
    await todo.page.screenshot({ path: 'all_finished_todos.png', fullPage: true });
  });


    test('moves a todo from completed back to active', async () => {
    let allUnfinishedTodos = await todo.getTodos();

    if (allUnfinishedTodos.length === 0) {
      await todo.addTodo('Automated todo item');
      console.warn('There were no todos found, therefore, we created an automated one.');
      allUnfinishedTodos = await todo.getTodos();
    };

    const randomTodo = Math.floor(Math.random() * allUnfinishedTodos.length);
    const todoText = allUnfinishedTodos[randomTodo];
    const itemLocator = todo.page.locator('.todo-list li').nth(randomTodo);

    await todo.page.screenshot({ path: 'all_unfinished_todos.png', fullPage: true });

    await todo.toggleTodo(randomTodo);
    await todo.page.waitForTimeout(500);
    await expect(itemLocator).toHaveClass(/completed/);

    await todo.page.screenshot({ path: 'an_unfinished_todo_marked_completed.png', fullPage: true });

    await todo.page.goto('http://localhost:8080/todo#/completed');

    const completedItem = todo.page.locator('.todo-list li', { hasText: todoText }).first();
    await expect(completedItem).toHaveClass(/completed/);

    const completedList = await todo.getTodos();
    const newlyCompletedTodo = completedList.indexOf(todoText);
    if (newlyCompletedTodo === -1) throw new Error(`Could not find completed todo: ${todoText}`);

    await todo.toggleTodo(newlyCompletedTodo);
    await todo.page.waitForTimeout(500);

    await expect(todo.page.locator('.todo-list li', { hasText: todoText })).toHaveCount(0);

    await todo.page.goto('http://localhost:8080/todo#/active');
    await todo.page.waitForTimeout(200);
    const activeItems = await todo.getTodos();
    expect(activeItems).toContain(todoText);
    await todo.page.screenshot({ path: 'all_unfinished_todos_once_again.png', fullPage: true });
  });


  test('reviews the list of completed items', async () => {
    await todo.page.goto('http://localhost:8080/todo#/completed');

    await todo.page.screenshot({ path: 'all_finished_todos.png', fullPage: true });
  });

  
  test('toggles and clears completed todos', async () => {
    let allUnfinishedTodos = await todo.getTodos();

    if (allUnfinishedTodos.length === 0) {
      await todo.addTodo('Automated todo item');
      console.warn('There were no todos found, therefore, we created an automated one.');
      allUnfinishedTodos = await todo.getTodos();
    };

    await todo.page.screenshot({ path: 'all_unfinished_todos.png', fullPage: true });

  for (let i = 0; i < allUnfinishedTodos.length; i++) {
    const itemLocator = todo.page.locator('.todo-list li').nth(i);
    await todo.toggleTodo(i);
    await todo.page.waitForTimeout(500);
    await expect(itemLocator).toHaveClass(/completed/);
  };

    await todo.page.goto('http://localhost:8080/todo#/completed');
    await todo.page.screenshot({ path: 'all_finished_todos.png', fullPage: true });
    await todo.clearCompleted();
    const allFinishedTodos = await todo.getTodos();
    expect(allFinishedTodos.length).toBe(0);
    await todo.page.screenshot({ path: 'all_finished_todos_cleared.png', fullPage: true });
  });


  test('deletes an unfinished todo', async () => {
    let allUnfinishedTodos = await todo.getTodos();
    await todo.page.screenshot({ path: 'all_unfinished_todos.png', fullPage: true });

    const randomTodo = Math.floor(Math.random() * allUnfinishedTodos.length);
    const completedTodo = allUnfinishedTodos[randomTodo];

    await todo.deleteTodo(randomTodo);
    await todo.page.screenshot({ path: 'a_todo_deleted.png', fullPage: true });
    const items = await todo.getTodos();
    expect(items).not.toContain(completedTodo);
  });


  test('deletes all unfinished todos', async () => {
    let allUnfinishedTodos = await todo.getTodos();
    await todo.page.screenshot({ path: 'all_unfinished_todos.png', fullPage: true });

  // Iterate backwards so deleting items doesn't shift subsequent indices
  for (let i = allUnfinishedTodos.length - 1; i >= 0; i--) {
    await todo.deleteTodo(i);
    await todo.page.waitForTimeout(150);
  }
    const items = await todo.getTodos();
    expect(items.length).toBe(0);
    await todo.page.screenshot({ path: 'all_unfinished_todos_deleted.png', fullPage: true });
  });
});