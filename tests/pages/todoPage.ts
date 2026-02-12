import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoList: Locator;
  readonly todoItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.locator('.new-todo');
    this.todoList = page.locator('.todo-list');
    this.todoItems = this.todoList.locator('li');
  }

  async goto() {
    await this.page.goto('http://localhost:8080/todo');
  }

  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');

    await this.page.waitForTimeout(100);
  }

  async getTodos(): Promise<string[]> {
    const count = await this.todoItems.count();
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      const label = this.todoItems.nth(i).locator('label');
      results.push((await label.innerText()).trim());
    }
    return results;
  }

  async toggleTodo(index: number) {
    await this.todoItems.nth(index).locator('.toggle').click();
  }

  async editTodo(index: number, newText: string) {
    const item = this.todoItems.nth(index);
    await item.dblclick();
    const edit = item.locator('.edit');
    await edit.fill(newText);
    await edit.press('Enter');
  }

  async deleteTodo(index: number) {
    let resolvedIndex = index;
    const count = await this.todoItems.count();
    if (index < 0) resolvedIndex = count - 1;

    if (resolvedIndex < 0 || resolvedIndex >= count) {
      throw new Error(`deleteTodo: index ${index} out of bounds (count=${count})`);
    }

    const item = this.todoItems.nth(resolvedIndex);
    const itemCount = await item.count();
    if (itemCount === 0) {
      throw new Error(`deleteTodo: no item found at resolved index ${resolvedIndex}`);
    }

    try {
      await item.scrollIntoViewIfNeeded();
    } catch (err) {
    }

    if (!(await item.isVisible())) {
      await item.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
    }

    try {
      await item.hover();
    } catch (err) {
      const box = await item.boundingBox();
      if (box) {
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
    }

    const destroy = item.locator('.destroy');
    await destroy.click({ force: true });
  }

  async clearCompleted() {
    const clear = this.page.locator('.clear-completed');
    if (await clear.count()) await clear.click();
  };
}