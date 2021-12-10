$(document).ready(function () {
  var todoList = $('#todo-list');
  var todoInput = $('#todo-input');
  var addButton = $('#add-button');
  var displayList = $('#display-list');

  // Function to add item to local DOM list
  var addItem = function (input, itemNumber, isComplete) {
    // Create column
    var itemCol = $('<div></div>');
    itemCol.attr('class', 'col-xs-12 item');

    // Create row
    var itemRow = $('<div></div>');
    itemRow.attr('class', 'row');

    // Create remove button
    var removeButton = $('<button>X</button>');
    removeButton.attr('class', 'btn btn-danger remove-button col-xs-1');
    removeButton.click(function () {
      var target = $(this).parent().parent();
      target.remove();
      deleteFromList(target.find('.item-id').attr('id'));
    });

    // Create item name
    var itemName = $('<h5></h5>');
    itemName.attr('class', 'col-xs-8 item-name');

    // Create completed checkbox
    var completedWrapper = $('<div></div>');
    completedWrapper.attr('class', 'col-xs-2 text-center');
    var itemCompleted = $('<input></input>');
    itemCompleted.attr('class', 'item-completed');
    itemCompleted.attr('type', 'checkbox');
    itemCompleted.click(function () {
      var target = $(this).parent().parent();
      if ($(this).is(':checked')) {
        markItemComplete(target.find('.item-id').attr('id'));
        target.find('.item-name').css('text-decoration', 'line-through');
      } else {
        markItemIncomplete(target.find('.item-id').attr('id'));
        target.find('.item-name').css('text-decoration', '');
      }
    });

    // Create item id number holder (Note: Not displayed to user)
    var itemNum = $('<div></div>');
    itemNum.attr('class', 'col-xs-1 item-id');
    var itemID = 0;

    // Determins whether added item is retrieved from server or new to list from DOM entry
    if (input) {
      itemName.text(input);
      if (isComplete) {
        itemName.css('text-decoration', 'line-through');
      }
      itemID = itemNumber;
      itemCompleted.attr('checked', isComplete);
    } else {
      itemName.text(todoInput.val());
      itemID = postToList(todoInput.val());
    }

    // Add item number to div
    itemNum.attr('id', itemID);

    // Append checkbox to wrapper
    completedWrapper.append(itemCompleted);

    // Append item attributes to item row
    itemRow.append(itemName);
    itemRow.append(removeButton);
    itemRow.append(completedWrapper);
    itemRow.append(itemNum);

    // Append item row to item col
    itemCol.append(itemRow);

    // Append item col to todo list
    todoList.append(itemCol);

    // Clear input value
    todoInput.val('');
  };

  // Function to remove all items from the DOM (Note: Does not remove from server)
  var removeAll = function () {
    var items = $('.item');
    for (var i = 0; i < items.length; i++) {
      items[i].remove();
    }
  };

  // Function to retrieve entire list from API and filter by selection
  var getList = function (isCompleteFilter) {
    $.ajax({
      type: 'GET',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=217',
      dataType: 'json',
      success: function (response, textStatus) {
        console.log(response);
        response.tasks.forEach(element => {
          switch (isCompleteFilter) {
            case 'all':
              addItem(element.content, element.id, element.completed);
              break;
            case 'completed':
              if (element.completed) {
                addItem(element.content, element.id, element.completed);
              }
              break;
            case 'incomplete':
              if (!element.completed) {
                addItem(element.content, element.id, element.completed);
              }
              break;
            default:
              console.log("Switch didn't work");
          }
        });
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Function to POST item to API server
  var postToList = function (input) {
    $.ajax({
      type: 'POST',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=217',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: input
        }
      }),
      success: function (response, textStatus) {
        console.log(response);
        return response.task.id;
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Function to mark item complete
  var markItemComplete = function (postID) {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + postID + '/mark_complete?api_key=217',
      success: function (response, textStatus) {
        console.log(response);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Function to mark item incomplete
  var markItemIncomplete = function (postID) {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + postID + '/mark_active?api_key=217',
      success: function (response, textStatus) {
        console.log(response);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Function to DELETE item from API
  var deleteFromList = function (postID) {
    $.ajax({
      type: 'DELETE',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + postID + '?api_key=217',
      success: function (response, textStatus) {
        console.log(response);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Function to enable add button click functionality
  addButton.click(function () {
    addItem();
  });

  // Function to enable adding to the list using the Enter key
  todoInput.keyup(function (event) {
    if (event.key === "Enter") {
      addItem();
    }
  });

  // Function to enable list filtering by completion status
  displayList.change(function () {
    removeAll();
    getList(displayList.val());
  });

  // Retrieve initial list
  getList('all');
});
