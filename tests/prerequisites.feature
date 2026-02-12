Scenario 1: The user opens the homepage
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I see a title with the following header "todos"
    And I take a screenshot of the page with the name "default_homepage"


Scenario 2: The user shrinks and expands the todo list accordion
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I see a title with the following header "todos"
    Then I shrink the todo list by clicking on the "toggle-all" button
    And I take a screenshot of the page with the name "todo_list_shrinked"
    Then I expand the todo list by clicking on the "toggle-all" button
    And I take a screenshot of the page with the name "todo_list_expanded"


Scenario 3: The user adds a new todo item in the list
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then in the "new-todo" field I add the following text "Learn to code better"
    And in the table I see a new item with the following label "Learn to code better"
    And select the unfinished todos by clicking on the button with text "Active" and there I see the new todo with the following text "Learn to code better"
    Then I take a screenshot of the page with the name "new_todo_item"


Scenario 4: The user reviews the list of active items
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I select the unfinished todos by clicking on the button with text "Active"
    And I see the URL of the page as "http://localhost:8080/todo#/active"
    Then I take a screenshot of the page with the name "unfinished_todos"


Scenario 5: The user edits an active todo item
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I select the unfinished todos by clicking on the button with text "Active"
    And I see the URL of the page as "http://localhost:8080/todo#/active"
    And I take a screenshot of the page with the name "unfinished_todos_prior_to_an_update"
    Then I double click on a "Todo" item and I change the todo text to "Pay electric bill ASAP"
    Then in the table I see a new item with the following label "Pay electric bill ASAP"
    And I take a screenshot of the page with the name "a_todo_updated"


Scenario 6: The user edits the second todo item from the list of all todos
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I select the unfinished todos by clicking on the button with text "All"
    And I see the URL of the page as "http://localhost:8080/todo#/"
    And I take a screenshot of the page with the name "all_todos_prior_to_an_update"
    Then I select the second "Todo" item from the list and I change the todo text to "Walk the dog twice a day"
    Then in the table I see a new item with the following label "Walk the dog twice a day"
    And I take a screenshot of the page with the name "the_second_todo_updated"


Scenario 7: The user edits an item from the completed list
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I select the completed todos by clicking on the button with text "Completed"
    And I see the URL of the page as "http://localhost:8080/todo#/completed"
    And I take a screenshot of the page with the name "all_completed_todos_prior_to_an_update"
    Then I select a "Todo" item from the list and I change the todo text to "Pay electric bill is completed"
    And I see the todo item with text "Pay electricity bill is completed" strikedthrough and with a checkmark
    And I take a screenshot of the page with the name "the_second_todo_updated"


Scenario 8: The user sets a todo as completed
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then in the lsit of todos with the class "todo-list" I select an item as completed
    Then I select the finished todos by clicking on the button with text "completed"
    And I see the URL of the page as "http://localhost:8080/todo#/completed"
    And I see the todo item with text "Pay electricity bill" strikedthrough and with a checkmark
    Then I take a screenshot of the page with the title "todo_item_completed"


Scenario 9: The user sets all todos as completed
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I take a screenshot of the page with the name "all_todo_items_prior_to_being_set_as_completed"
    Then in the lsit of todos with the class "todo-list" I select all of the items as completed
    Then I select the finished todos by clicking on the button with text "completed"
    And I see the URL of the page as "http://localhost:8080/todo#/completed"
    And I see the todo items strikedthrough and with a checkmark
    Then I take a screenshot of the page with the name "all_todo_items_completed"


Scenario 10: The user moves a todo from completed back to active
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I take a screenshot of the page with the name "all_todo_items_prior_to_being_set_as_completed"
    Then in the lsit of todos with the class "todo-list" I select an items as completed
    And I take a screenshot of the page with the name "a_todo_set_as_completed"
    Then I select the finished todos by clicking on the button with text "completed"
    And I see the URL of the page as "http://localhost:8080/todo#/completed"
    And I see the todo items strikedthrough and with a checkmark
    Then I unchek the finished todo by clicking on the checkmark with class "toggle"
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the previously finished todo item in the active list
    Then I take a screenshot of the page with the name "all_todo_items_completed"


Scenario 11: The user reviews the list of completed todos
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then I select the finished todos by clicking on the button with text "Completed"
    And I see the URL of the page as "http://localhost:8080/todo#/completed"
    Then I take a screenshot of the page with the name "all_finished_todos"


Scenario 12: The user deletes all todos which are completed
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then in the lsit of todos with the class "todo-list" I select all of the items as completed
    Then I select the finished todos by clicking on the button with text "completed"
    And I see the URL of the page as "http://localhost:8080/todo#/completed"
    And I see the todo items strikedthrough and with a checkmark
    Then I delete the completed todos by clicking on the "clear-completed" button
    And I expect the table with the "todo-list" to be empty
    Then I take a screenshot of the page with the name "all_completed_todo_items_cleared"


Scenario 13: The user deletes an unfinished todo
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then in the lsit of todos with the class "todo-list" I select an unfinished item by clicking on the "Active" button
    And I see the URL of the page as "http://localhost:8080/todo#/active"
    Then I delete an item from the list "todo-list"
    And I expect the "todo-list" to have one less item
    Then I take a screenshot of the page with the name "unfinished_todo_item_cleared"


Scenario 14: The user deletes all unfinished todos
    Given that I visit the homepage on the URL "http://localhost:8080/todo"
    And I see the title of the page as "Cypress.io: Kitchen Sink"
    Then in the lsit of todos with the class "todo-list" I select all unfinished item by clicking on the "Active" button
    And I see the URL of the page as "http://localhost:8080/todo#/active"
    Then I delete all the items from the list "todo-list" one by one
    And I expect the "todo-list" to have one less item
    Then I take a screenshot of the page with the name "all_unfinished_todo_items_cleared"