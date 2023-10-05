import { generateSelectorHTML } from "./fileselector.js";






export function generateHTML(todoList, subjectIndex, subjects, subjectName) {
    let todoHTML = "";
    if (todoList.length === 0) {
        todoHTML = "Todolist is empty - Add new todos."
    }

    todoList.forEach((element, index) => {
        const elementName = element.name[0].toUpperCase() + element.name.slice(1);
        let elementInfo = element.info;
        if (!elementInfo) {
            elementInfo = 'No info available. Edit to add new.';
        }

        todoHTML += `
        <div class="todo">
        <div class="todo-flex-container">
        <p class="todo-header">${elementName}</p>
        <div class="todo-line"></div>
        <div class="todo-edit-button" data-info="${element.info}" data-name="${elementName}" data-imp="${element.importance}">
        <img src="./pencil.png" class="pencil-icon">
        </div>
        </div>
        <div class="todo-expand-section">
        <div class="todo-info">${elementInfo}</div>
        </div>
        </div>
        `
    });
    document.querySelector('.todo-list').innerHTML = todoHTML;
    
    
    document.querySelectorAll('.todo').forEach((element, index) => {
        let elementName = document.querySelectorAll('.todo-header')[index].innerHTML;
        let clickCount;
        todoList.forEach((e) => {
            if (e.name[0].toUpperCase() + e.name.slice(1) === elementName) {
                clickCount = e.clickCount;
            }
        })
        
        element.addEventListener("click", () => {
            if (clickCount % 2 === 0) {
                element.classList.add('todo-expanded');
            } else {
                element.classList.remove('todo-expanded');
            }
            clickCount++;   
        })
    })
    
    document.querySelectorAll('.todo-edit-button').forEach(element => {
        element.addEventListener("click", () => {
            document.querySelector('.todo-list-container').innerHTML = `
            <h1 class="todo-list-text">Edit text:</h1>
            <button class="delete-button">X</button>
            <p class="edit-header">Header: </p>
            <input class="header-input" type="text" value="${element.dataset.name}" required>
            <p class="edit-header">Importance: </p>
            <input class="header-input header-i-input" type="text" value="${element.dataset.imp}" required>
            <br>
            <p class="edit-header">Information: </p>
            <textarea class="textarea" rows="18" cols="120" required>${element.dataset.info}</textarea>
            <button class="submit">Save and close</button>
            `;
            
            document.querySelector('.submit').addEventListener("click", () => {
                const name = document.querySelector('.header-input').value;
                const info = document.querySelector('.textarea').value;
                const imp = document.querySelector('.header-i-input').value;
                
                if (!name || !imp) {
                    alert('Name or importance shouldnt be left empty');
                    return 132322;
                }
                
                if (name.length > 35) {
                    alert('The name is too long. (max 35 characters)');
                    return 74894;
                }
                
                todoList.forEach((elem, index) => {
                    const listName = elem.name[0].toUpperCase() + elem.name.slice(1)
                    if (listName === element.dataset.name) {
                        elem.name = name;
                        elem.info = info;
                        elem.importance = Number(imp);
                        
                    }
                })
                todoList = sortList(todoList);
                subjects[subjectIndex].todoList = todoList;
                localStorage.setItem('subjects', JSON.stringify(subjects))
                document.querySelector('.todo-list-container').innerHTML = `
                <h1 class="todo-list-text">Todo list</h1>
                <button class="add-new-button">+</button>
                <div class="todo-list"></div>`
                generateHTML(todoList, subjectIndex, subjects, subjectName);
            })
            document.querySelector('.delete-button').addEventListener("click", () => {
                let deleteIndex;
                todoList.forEach((e, indexi) => {
                    if (element.dataset.name === e.name[0].toUpperCase() + e.name.slice(1)) {
                        deleteIndex = indexi;
                    }
                })
                todoList.splice(deleteIndex, 1);
                subjects[subjectIndex].todoList = todoList;
                localStorage.setItem('subjects', JSON.stringify(subjects))
                document.querySelector('.todo-list-container').innerHTML = `
                <h1 class="todo-list-text">Todo list</h1>
                <button class="add-new-button">+</button>
                <div class="todo-list"></div>`
                generateHTML(todoList, subjectIndex, subjects, subjectName);
            })
        })
    })
    document.querySelector('.add-new-button').addEventListener("click", () => {
        document.querySelector('.todo-list-container').innerHTML = `
        <h1 class="todo-list-text">Add new:</h1>
        <button class="delete-button">X</button>
        <p class="edit-header">Header: </p>
        <input class="header-input" placeholder="Enter the name" type="text" required>
        <p class="edit-header">Importance: </p>
        <input class="header-input header-i-input" type="text" placeholder="Enter importancy" required>
        <br>
        <p class="edit-header">Information: </p>
        <textarea class="textarea" placeholder="Enter notes" rows="18" cols="120" required></textarea>
        <button class="submit">Save and close</button>
        `;
        
        document.querySelector('.submit').addEventListener("click", () => {
            const name = document.querySelector('.header-input').value;
            const info = document.querySelector('.textarea').value;
            const imp = document.querySelector('.header-i-input').value;
            
            if (!name || !imp) {
                alert('Name or importance shouldnt be left empty');
                return 132322;
            }


            todoList.push({
                name: name,
                info: info,
                importance: imp,
                clickCount: 0
            });
            
            todoList = sortList(todoList);
            subjects[subjectIndex].todoList = todoList;
            localStorage.setItem('subjects', JSON.stringify(subjects))
            document.querySelector('.todo-list-container').innerHTML = `
            <h1 class="todo-list-text">Todo list</h1>
            <button class="add-new-button">+</button>
            <div class="todo-list"></div>`
            generateHTML(todoList, subjectIndex, subjects, subjectName);
        })
        document.querySelector('.delete-button').addEventListener("click", () => {
            document.querySelector('.todo-list-container').innerHTML = `
            <h1 class="todo-list-text">Todo list</h1>
            <button class="add-new-button">+</button>
            <div class="todo-list"></div>`
            generateHTML(todoList, subjectIndex, subjects, subjectName);
        })
    })

    document.querySelector('.header-name').addEventListener("click", () => {
        document.querySelector('.todo-list-container').innerHTML = `
        <h1 class="todo-list-text">Todo lists</h1>
      <button class="add-new-button">+</button>
      <div class="todo-list"></div>
        `

        generateSelectorHTML();
    })
}

function sortList(list) {
    let newList = [];
    const len = list.length;
    for (let i = 0; i < len; i++){
        let smallNum;
        let smallElement;
        let smallIndex;
        list.forEach((element, index) => {
            const imp = element.importance;
            if (!smallNum) {
                smallNum = imp;
                smallElement = element;
                smallIndex = index;
            } else if (imp < smallNum) {
                smallNum = imp;
                smallElement = element;
                smallIndex = index;
            }
        })
        newList.push(smallElement);
        list.splice(smallIndex, 1);
    }
    return newList;
}

