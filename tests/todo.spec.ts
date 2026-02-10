import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todoPage';

test.describe('Todo App (POM)', () => {
  let todo: TodoPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    await todo.goto();
  });

  test('adds a todo item', async () => {
    await todo.addTodo('Learn to code better');
    const items = await todo.getTodos();
    expect(items).toContain('Learn to code better');
  });

  test('edits a todo item', async () => {
    await todo.addTodo('New todo item added with a default text');
    await todo.editTodo(-1, 'Edited the new todo item with new text');
    const items = await todo.getTodos();
    expect(items).toContain('Edited the new todo item with new text');
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