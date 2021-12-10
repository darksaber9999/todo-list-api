$(document).ready(function () {
  var todoList = $('#todo-list');
  var todoInput = $('#todo-input');
  var addButton = $('#add-button');

  var addItem = function () {
    var itemCol = $('<div></div>');
    itemCol.attr('class', 'col-xs-12 item');

    var itemRow = $('<div></div>');
    itemRow.attr('class', 'row');

    var removeButton = $('<button>X</button>');
    removeButton.attr('class', 'btn btn-danger remove-button col-xs-1');
    removeButton.click(function () {
      var target = $(this).parent().parent();
      target.remove();
    });

    var h5 = $('<h5></h5>');
    h5.attr('class', 'col-xs-4');

    var itemName = h5.clone();
    itemName.addClass('item-name');

    itemName.text(todoInput.val());

    itemRow.append(itemName);
    itemRow.append(removeButton);

    itemCol.append(itemRow);

    todoList.append(itemCol);

    todoInput.val('');
  };

  addButton.click(addItem);

  todoInput.keyup(function (event) {
    if (event.key === "Enter") {
      addItem();
    }
  });

});

