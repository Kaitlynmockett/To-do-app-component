/* Select items */ 
const alert = document.querySelector('.alert');
const form = document.querySelector('.todo-form');
const todo = document.getElementById('to-do');
const container = document.querySelector('.todo-container');
const list = document.querySelector('.todo-list');
const clearBtn = document.querySelector('.clear-btn');

// stuff that doesnt work yet
const numItems = document.querySelector('.items-active');
const activeBtn = document.querySelector('.active-btn');
const completedBtn = document.querySelector('.completed-btn');
const toggleStateBtn = document.querySelector('.toggle-state-btn');

let counter = 0;
// Edit options - Constants
let editElement;
let editFlag = false;
let editID = "";

// State constant
let active = true;

// Event listeners
form.addEventListener('submit', addItem);

clearBtn.addEventListener('click', clearItems);

activeBtn.addEventListener('click', activeFilter);

completedBtn.addEventListener('click', completedFilter);
toggleStateBtn.addEventListener('click', completedFilter);
// Functions
// add item to list
function addItem(e) {
    e.preventDefault();
    const value = todo.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
        // create new element for page
        const element = document.createElement('article');
        // add class of todo-item
        element.classList.add('todo-item');
        // add ID
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
            </button>
        </div>`;
        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);
        // append child (add new todo (element) to container/list)
        list.appendChild(element)
        // display alert
        displayAlert('new todo item added to the list', 'success');
        // increment number of items active
        counter++;
        // add class to display container
        container.classList.add('show-container');
        showActive()
        // add item to local storage
        addToLocalStorage(id, value);
        // reset states to default
        setBackToDefault();
    }
    // when value = true and editFlag = true
    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('value changed', 'success');
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    // else displays alert
    else {
        displayAlert('please enter a value', 'danger')
    }
}

function clearItems() {
    // select all todo items
    const items = document.querySelectorAll('.todo-item');

    // if there are any items
    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item)
        })
    }

    container.classList.remove('show-container');
    displayAlert('list has been emptied', 'success');
    setBackToDefault();
    localStorage.removeItem('list');
}

function editItem(e) {
    // selecting the new todo element
    const element = e.currentTarget.parentElement.parentElement;
    // selecting the item to be editted
    editElement = e.currentTarget.parentElement.previousElementSibling;
    todo.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    displayAlert('editting item', 'danger')
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }

    displayAlert('todo item removed', 'success');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

function showActive(){
    if (counter >= 1) {
        numItems.innerHTML = `${counter} items left`
    }
    else if (counter === 0) {
        numItems.innerHTML = `No list items`
    }
    else {
        displayAlert('Internal Error', 'danger')
    }
}
// toggle todo icon state // not working
function setState () {

}

function activeFilter() {

}

function completedFilter() {

}


// DISPLAY ALERT
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function (action) {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
    }, 1000);
}

// set edit options back to default state
function setBackToDefault() {
    todo.value = "";
    editFlag = false;
    editID = "";
}

// ****** LOCAL STORAGE ****** 
// add to local storage
function addToLocalStorage(id, value) {
    const todo = {id, value}
    let items = localStorage.getItem('list')
        ? JSON.parse(localStorage.getItem('list'))
        : []
    items.push(todo);
    localStorage.setItem('list', JSON.stringify(items));
}
// remove from local storage
function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items))
}
// edit local storage
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}

// get local storage
function getLocalStorage(){
    return localStorage.getItem('list')
        ? JSON.parse(localStorage.getItem('list'))
        : [];
}
