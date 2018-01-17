var todos = new Array();
var count = 100;
var window = window;
var todosUl = window.document.getElementById('ul');
var fragment = window.document.createDocumentFragment();

//Constructor to add each item
function addTodo(todoText){
    this.todoText = todoText;
    this.delete =  false;
    this.id= count;
}

//Handlers for functions
var handlers = {
    addTodo: function () {
        var addTodoTextInput = window.document.getElementById('addTodoTextInput');
        if (addTodoTextInput.value == false) 
        {
            addTodoTextInput.classList.add('focus');
            window.alert('Empty field');
            addTodoTextInput.classList.remove('focus');
        }
        else {
            todos.push(new addTodo(addTodoTextInput.value));
            todoList.addTodosToPage(-1, addTodoTextInput.value);
            addTodoTextInput.value = '';
        }
    },
    deleteTodo: function (position) {
        todoList.deleteTodo(position);
    }
};

var todoList = {
    deleteTodo: function (position) {
     var idOfDiv = window.document.querySelector('div[data-id="'+position+'"]').remove();
      for(var i=0 ; i<todos.length ; i++){
            if(todos[i].id == position)
                todos.splice(i, 1);
        }
        console.log(todos);
    },
    addTodosToPage: function(position,todos){
        if(position >= 0){
        for(var i=position ;i<todos.length;i++){
            var todoItem = todos[i];
            view.createUIItem(todoItem);   
           todosUl.appendChild(fragment);
        }
    } 
        else {
            view.createUIItem(todos);
            todosUl.insertBefore(fragment,todosUl.childNodes[0]);
        }
    } 
};

//Create an element in the UI 
var view = {
    createDelButton: function () {
        var delButton = window.document.createElement('button');
        delButton.textContent = 'Delete';
        delButton.className = 'deleteButton';
        delButton.setAttribute("data-delete-id",count);
        return delButton;
    },
    createStrikeButton: function () {
        var strikeButton = window.document.createElement('button');
        strikeButton.textContent = 'Completed';
        strikeButton.className = 'strikeButton';
        return strikeButton;
    },
    createUIItem: function(todoItem){
        var li = window.document.createElement('li');
        var todoDiv = window.document.createElement('div');
        var id = count++;
        todoDiv.setAttribute('data-id',''+count+'');
        fragment.appendChild(todoDiv);
        todoDiv.appendChild(li);
        todoDiv.appendChild(view.createDelButton());
        todoDiv.appendChild(view.createStrikeButton());
        li.innerHTML = todoItem.title || todoItem.todoText || todoItem;  
    }
};

//Using AJAX REQUEST to get from the JSON 
var XMLHttpRequest = XMLHttpRequest;
window.document.getElementById('retrieveData').addEventListener('click', function(){
    var request = new XMLHttpRequest();
    request.open('GET','https://jsonplaceholder.typicode.com/posts');
    request.onreadystatechange = function(){
        if(this.readyState == this.DONE && this.status ==200){
            if(this.responseText){
                var n=todos.length;
                parseTodoItems(this.responseText);
                todoList.addTodosToPage(n, todos);
            }
        }
    };
    request.send();
});

function parseTodoItems(todoJSON){
    if(todoJSON == null || todoJSON.trim() == '')
        return;

    var todoArray = JSON.parse(todoJSON);
    if(todoArray.length == 0){
        return;
    }
    for(var i = 0;i<todoArray.length;i++){
        var todoItem = todoArray[i];
        todos.push(todoItem);
    }
}


function setUpEventListeners() {
    var todoUl = window.document.querySelector('ul');
    todoUl.addEventListener('click', function (event) {
        var elementClicked = event.target;
        if (elementClicked.className === 'deleteButton') {
            var contentToDel = elementClicked.parentNode.firstChild.textContent;
            var confirmDel = window.confirm('Delete item '+contentToDel+'?');
            if(confirmDel == true){
                var buttonPlace = event.target;
                var buttonId= buttonPlace.getAttribute('data-delete-id');
                handlers.deleteTodo(buttonId);
            }
        }
        if(elementClicked.className === 'strikeButton'){
            var del = event.target.parentNode.firstChild;
            del.classList.toggle('strikethrough');
            event.target.parentNode.classList.remove('strikethrough');
        }
    });
}

setUpEventListeners();

