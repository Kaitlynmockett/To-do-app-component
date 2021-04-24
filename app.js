/* Select items */ 
const alert = document.querySelector('.alert');
const form = document.querySelector('.todo-form');
const todo = document.getElementById('to-do');
const container = document.querySelector('.todo-container');
const list = document.querySelector('.todo-list');
const clearBtn = document.querySelector('.clear-btn');
const numItems = document.querySelector('.items-active');
const switchModeBtn = document.querySelector('.toggle-light-mode');

// stuff that doesnt work yet
const activeBtn = document.querySelector('.active-btn');
const completedBtn = document.querySelector('.completed-btn');
const toggleStateBtn = document.querySelector('.toggle-state-btn');

// active items counter
let counter = 0;
let mode = 'light';
// Edit options - Constants
let editElement;
let editFlag = false;
let editID = "";

// State constant
let state = "active";

// Event listeners
form.addEventListener('submit', addItem);

clearBtn.addEventListener('click', clearItems);

activeBtn.addEventListener('click', activeFilter);

completedBtn.addEventListener('click', completedFilter);

toggleStateBtn.addEventListener('click', completedFilter);

switchModeBtn.addEventListener('click', switchMode);

toggleStateBtn.addEventListener('click', toggleState);
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
        element.innerHTML = `<button type="button" class="toggle-state-btn"><img src="https://img.icons8.com/ios/50/000000/checked-2--v3.png"/></button>
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
            </button>
        </div>`;
        let state = "active";
        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        const toggleStateBtn = document.querySelector('.toggle-state-btn');
        toggleStateBtn.addEventListener('click', toggleItemState);
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
        // show number of items in list active
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
            list.removeChild(item);
            counter--;
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
    counter--;
    showActive()
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

function switchMode () {
    if (mode === 'light') {
        switchModeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/></svg>`;
        mode = 'dark';
        // change class of bg-img to show correct bg img
    }
    else if (mode === 'dark') {
        switchModeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/></svg>`;
        mode = 'light';
        // change class of bg-img to show correct bg img
    }
    else {
        displayAlert('error', 'danger')
    }
   
}
// toggle todo icon state // not working
function toggleState () {
    if (state === 'active') {
        toggleStateBtn.innerHTML = `<img src="https://img.icons8.com/ios/50/000000/checked-2--v1.png"/>`;
        state = 'completed';
        // add class to title so text effects apply
    }
    else if (state === 'completed') {
        toggleStateBtn.innerHTML = `<img src="https://img.icons8.com/ios/50/000000/checked-2--v3.png"/>`;
        state = 'active';
        // remove class to title so text effects apply
    }
    else {
        displayAlert('state switching error - todo item', 'danger');
    }
}
function toggleItemState (e) {
    const element = e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
    console.log(element);
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
