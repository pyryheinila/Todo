import { generateSelectorHTML } from "./fileselector.js";



let nowClicked;
let editClicked2 = false;
let nowClickedIndex;
let editClicked = false;




export function generateHTML(todoList, subjectIndex, subjects, subjectName, completed, completedsubjects) {



    let todoHTML = "";
    if (todoList.length === 0) {
        todoHTML = "Todolist is empty - Add new todos."
    }
    

    todoList.forEach((element, index) => {
        const elementName = element.name[0].toUpperCase() + element.name.slice(1);
        let elementInfo = element.info;
        let testElementInfo = elementInfo.split("\n");
        let currentPosition = 0;
        let tooMuchLetters = true;
        testElementInfo.forEach(text => {
            while (tooMuchLetters) {
                if (text.length > 90) {
                    let before = elementInfo.slice(0, currentPosition + 90);
                    let after = elementInfo.slice(currentPosition + 90);
                    text = after;
                    elementInfo = before + '\n' + after;
                    currentPosition += 91;
                } else {
                    tooMuchLetters = false;
                    currentPosition += text.length + 1;
                }
            }
            
        })
        
        elementInfo = elementInfo.split('\n');
        
        let links = element.links;
        let linkHTML = '';
        let linkHref;
        let linkName;
        let deleteBorderStyle = ''
        let linkMargin = 0;
        if (links && links.length !== 0) {
            linkMargin += 14
            links.linkNames.forEach((name, ind) => {
                linkHTML += `<a href="${links.linkHrefs[ind]}" target="_blank">${links.linkNames[ind]}</a>`
                linkMargin += 18.5;
            })
            linkHref = links.linkHrefs;
            linkName = links.linkNames;
        } else {
            deleteBorderStyle = `
            border: none;
            height: 0px;
            `
        }
        
        
        
        if (!elementInfo) {
            elementInfo = 'No info available. Edit to add new.';
        }
        let newElementInfo = "";
        elementInfo.forEach(e => {
            newElementInfo += `<p class="element-info">${e}</p>`;
        })
        const bottomMargin = 80 + (elementInfo.length - 1) * 21 + linkMargin;
        
        let donebuttonHTML = '<div class="done-button"><img src="./black-check-mark-md.png"></div>'
        let editButtonHTML = `<div class="todo-edit-button" data-return="false"  data-link-href="${linkHref}" data-link-name="${linkName}"  data-info="${element.info}" data-name="${elementName}" data-imp="${element.importance}"><img src="./pencil.png" class="pencil-icon"></div>`
        if (completed) {
            donebuttonHTML = '';
            editButtonHTML = `<div class="todo-edit-button" data-link-href="${linkHref}" data-return="true" data-link-name="${linkName}"  data-info="${element.info}" data-name="${elementName}" data-imp="${element.importance}"><img src="./images/return.png" class="pencil-icon"></div>`
        }




        todoHTML += `
        <div class="todo" data-margin-bottom="${bottomMargin}">
        <div class="todo-flex-container">
        <p class="todo-header">${elementName}</p>
        <div class="todo-line"></div>
        ${editButtonHTML}
        
        </div>
        <div class="todo-expand-section">
        <div class="todo-expand-container">
        <div  class="todo-info">${newElementInfo}</div>
        ${donebuttonHTML}
        </div>
        <div class="todo-links" style="${deleteBorderStyle}"><div class="todo-link">${linkHTML}</div></div>
        </div>
        </div>
        `
    });
    document.querySelector('.todo-list').innerHTML = todoHTML;
    
    
    
    document.querySelectorAll('.todo-edit-button').forEach((element, index) => {
        element.addEventListener("click", () => {
            let returnButton = element.dataset.return;
            editClicked = true;
            if (returnButton == 'true') {
                subjects.forEach((sub, ind) => {
                    if (sub.name === subjectName) {
                        sub.todoList.forEach((s, i) => {
                            if (s.name[0].toUpperCase() + s.name.slice(1) === element.dataset.name) {
                                let ogSubjects = getSubjects(false);
                                let todoListFound = false;
                                ogSubjects.forEach((a) => {
                                    if (a.name === sub.name) {
                                        todoListFound = true;
                                        a.todoList.push({
                                            name: s.name,
                                            links: {
                                                linkNames: [element.dataset.linkName],
                                                linkHrefs: [element.dataset.linkHref]
                                            },
                                            clickCount: 0,
                                            importance: element.dataset.imp,
                                            info: element.dataset.info
                                        })
                                    }
                                })
                                if (!todoListFound) {
                                    ogSubjects.push({
                                        name: sub.name,
                                        todoList: [
                                            {
                                                name: s.name,
                                                links: {
                                                    linkNames: [element.dataset.linkName],
                                                    linkHrefs: [element.dataset.linkHref]
                                                },
                                                clickCount: 0,
                                                importance: element.dataset.imp,
                                                info: element.dataset.info                                                    
                                            }
                                        ]
                                    })
                                }
                                if (window.confirm('Todo returned')) {
                                    setSubjects(subjects, false);
                                    sub.todoList.splice(i, 1);
                                    setSubjects(subjects, true);
                                    generateHTML(todoList, subjectIndex, subjects, subjectName, true, completedsubjects)
                                }
                            }
                        })
                    }
                }) 
            } else {
            let linkHtml = '';
            if (element.dataset.linkHref && element.dataset.linkHref !== 'undefined') {
                let hrefs = [];
                element.dataset.linkHref.split(',').forEach(elem => {
                    hrefs.push(elem)
                })
                let names = [];
                element.dataset.linkName.split(',').forEach(elem => {
                    names.push(elem)
                })
                hrefs.forEach((href, ind) => {
                    
                    linkHtml += `<div class="link">
                    <div class="delete-button-container"></div>
                    <a href="${href}" target="_blank">${names[ind]}</a>
                    <div class="delete-button-container">
                    <button  class="delete-link-button">x</button>
                    </div>
                    </div>`
                })
            }

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
            <div class="link-container">
            ${linkHtml}
            </div>
            <button class="submit">Save and close</button>  
            `;
            document.querySelectorAll('.delete-link-button').forEach((button, ind) => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.link')[ind].remove();
                })
            })

            let ctrlkeyPressed = false;
            document.querySelector('.textarea').addEventListener('keydown', (event) => {
                if (event.ctrlKey && event.key === "q") {
                    let cont = document.querySelector('.link-popup-cont');
                    cont.style.zIndex = '200';
                    ctrlkeyPressed = true;
                }

            })

            document.querySelector('.popup-close-button').addEventListener('click', () => {
                document.querySelector('.link-popup-cont').style.zIndex = '-20';
            })


            document.querySelector('.popup-submit').addEventListener('click', () => {
                let text = document.querySelector('.link-text-input').value;
                let href = document.querySelector('.link-href-input').value;
                if (!ctrlkeyPressed) {}
                else if (href.slice(0, 8) !== 'https://' || !href.includes('.') || href.includes(' ')) {
                    alert('invalid href');
                } else {
                    document.querySelector('.link-popup-cont').style.zIndex = '-20';
                    document.querySelector('.link-container').innerHTML += `<div class="link">
                    <a href="${href}" target="_blank">${text}</a>
                    <button  class="delete-link-button">x</button>
                    </div>`
                    ctrlkeyPressed = false;
                    document.querySelectorAll('.delete-link-button').forEach((button, ind) => {
                        button.addEventListener('click', () => {
                            document.querySelectorAll('.link')[ind].remove();
                        })
                    })
                }
            })

            
            document.querySelector('.go-back-arrow-container').innerHTML = '<img class="go-back-arrow" alt="go-back-arrow" src="images/go-back-2.png">'
            document.querySelector('.go-back-arrow').addEventListener('click', () => {
                document.querySelector('.todo-list-container').innerHTML = `
                <h1 class="todo-list-text">${subjectName}</h1>
                <button class="add-new-button">+</button>
                <div class="todo-list"></div>
                `
                generateHTML(todoList, subjectIndex, subjects, subjectName, false, completedsubjects);
            })

            document.querySelector('.submit').addEventListener("click", () => {
                const name = document.querySelector('.header-input').value;
                const info = document.querySelector('.textarea').value;
                const imp = document.querySelector('.header-i-input').value;
                let linkNames = [];
                let linkHrefs = [];
                document.querySelectorAll('.link').forEach((link) => {
                    linkNames.push(link.querySelector('a').innerHTML)
                    linkHrefs.push(link.querySelector('a').getAttribute('href'));
                })
                

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
                        elem.links = {
                            linkNames,
                            linkHrefs
                        }
                    }
                })
                todoList = sortList(todoList);
                subjects[subjectIndex].todoList = todoList;
                setSubjects(subjects, false);
                document.querySelector('.todo-list-container').innerHTML = `
                <h1 class="todo-list-text">${subjectName}</h1>
                <button class="add-new-button">+</button>
                <div class="todo-list"></div>
                `
                generateHTML(todoList, subjectIndex, subjects, subjectName, false, completedsubjects);
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
                setSubjects(subjects, false);
                document.querySelector('.todo-list-container').innerHTML = `
                <h1 class="todo-list-text">${subjectName}</h1>
                <button class="add-new-button">+</button>
                <div class="todo-list"></div>
                `
                generateHTML(todoList, subjectIndex, subjects, subjectName, false, completedsubjects);
            })
            }
        })
    })
    
    
    document.querySelectorAll('.todo').forEach((element, index) => {
        
        
        element.addEventListener("click", () => {
            
            
            if (!editClicked) {
                let elementName = document.querySelectorAll('.todo-header')[index].innerHTML || undefined;
                let clickCount;
                let clickIndex;
                todoList.forEach((e, i) => {
                    if (e.name[0].toUpperCase() + e.name.slice(1) === elementName) {
                        clickCount = e.clickCount;
                        clickIndex = i;
                    }
                })
                if (editClicked2) {
                    element.classList.add('todo-expanded');
                    document.querySelector('.todo-expanded').style.marginBottom = `${element.dataset.marginBottom}px`;
                    nowClickedIndex = clickIndex;
                    nowClicked = element;
                    editClicked2 = false;
                } else {    
                    if (nowClicked && nowClicked !== element) {
                        nowClicked.classList.remove('todo-expanded');
                        nowClicked.style.marginBottom = '0px'
                        todoList[nowClickedIndex].clickCount++;
                    }
                    if (clickCount % 2 === 0) {
                        element.classList.add('todo-expanded');
                        document.querySelector('.todo-expanded').style.marginBottom = `${element.dataset.marginBottom}px`;
                        nowClicked = element;
                        nowClickedIndex = clickIndex;
                    } else {
                        element.classList.remove('todo-expanded');
                        element.style.marginBottom = '0px';
                        nowClicked = undefined;
                    }
                }
                todoList[nowClickedIndex].clickCount++;
            } else {
                subjects.forEach(e => {
                    e.todoList.forEach(element => {
                        element.clickCount = 0;
                    })
                })
                editClicked = false;
                editClicked2 = true;
            }
        })
    })
    if (!completed) {
    document.querySelector('.add-new-button').addEventListener('click', () => {
        subjects.forEach(e => {
            e.todoList.forEach(element => {
                element.clickCount = 0;
            })
        })
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
        <div class="link-container"></div>
        <button class="submit">Save and close</button>
        `;
        

        let ctrlkeyPressed = false;
        document.querySelector('.textarea').addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === "q") {
                let cont = document.querySelector('.link-popup-cont');
                cont.style.zIndex = '200';
                ctrlkeyPressed = true;
            }

        })

        document.querySelector('.popup-close-button').addEventListener('click', () => {
            document.querySelector('.link-popup-cont').style.zIndex = '-20';
        })


        document.querySelector('.popup-submit').addEventListener('click', () => {
            let text = document.querySelector('.link-text-input').value;
            let href = document.querySelector('.link-href-input').value;
            if (!ctrlkeyPressed) {}
            else if (href.slice(0, 8) !== 'https://' || !href.includes('.') || href.includes(' ')) {
                alert('invalid href');
            } else {
                document.querySelector('.link-popup-cont').style.zIndex = '-20';
                document.querySelector('.link-container').innerHTML += `<div class="link">
                <a href="${href}" target="_blank">${text}</a>
                <button  class="delete-link-button">x</button>
                </div>`
                ctrlkeyPressed = false;
                document.querySelectorAll('.delete-link-button').forEach((button, ind) => {
                    button.addEventListener('click', () => {
                        document.querySelectorAll('.link')[ind].remove();
                    })
                })
            }
        })






        document.querySelector('.submit').addEventListener("click", () => {
            const name = document.querySelector('.header-input').value;
            const info = document.querySelector('.textarea').value;
            const imp = document.querySelector('.header-i-input').value;
            let linkNames = [];
            let linkHrefs = [];
            document.querySelectorAll('.link').forEach((link) => {
                linkNames.push(link.querySelector('a').innerHTML)
                linkHrefs.push(link.querySelector('a').getAttribute('href'));
            })


            if (!name || !imp) {
                alert('Name or importance shouldnt be left empty');
                return 132322;
            }
            
            
            todoList.push({
                name: name,
                info: info,
                importance: imp,
                clickCount: 0,
                links: {
                    linkNames,
                    linkHrefs
                }
                
            });
            
            todoList = sortList(todoList);
            subjects[subjectIndex].todoList = todoList;
            setSubjects(subjects, false);
            document.querySelector('.todo-list-container').innerHTML = `
            <h1 class="todo-list-text">${subjectName}</h1>
            <button class="add-new-button">+</button>
            <div class="todo-list"></div>
            `
            generateHTML(todoList, subjectIndex, subjects, subjectName, false, completedsubjects);
        })

        document.querySelector('.go-back-arrow-container').innerHTML = '<img class="go-back-arrow" alt="go-back-arrow" src="images/go-back-2.png">'
        document.querySelector('.go-back-arrow').addEventListener('click', () => {
            document.querySelector('.todo-list-container').innerHTML = `
            <h1 class="todo-list-text">${subjectName}</h1>
            <button class="add-new-button">+</button>
            <div class="todo-list"></div>
            `
            generateHTML(todoList, subjectIndex, subjects, subjectName, false, completedsubjects);
        })

        document.querySelector('.delete-button').addEventListener("click", () => {
            document.querySelector('.todo-list-container').innerHTML = `
            <h1 class="todo-list-text">${subjectName}</h1>
            <button class="add-new-button">+</button>
            <div class="todo-list"></div>
            `
            generateHTML(todoList, subjectIndex, subjects, subjectName, false, completedsubjects);
        })
    })
    }
    document.querySelector('.header-name').addEventListener("click", () => {
        document.querySelector('.todo-list-container').innerHTML = `
        <h1 class="todo-list-text">Todo lists</h1>
        <button class="add-new-button">+</button>
        <div class="todo-list"></div>
        `
        let ogSubjects = getSubjects(false);
        generateSelectorHTML(ogSubjects, false);
    })

    document.querySelectorAll('.done-button').forEach((button, index) => {
        button.addEventListener('click', () => {
            
            let subjectFound = false
            completedsubjects.forEach((subject) => {
                if (subject.name === todoList[index].name) {
                    subjects.forEach((list, i) => {
                        if (list.name === subjectName) {
                            completedsubjects[i].todoList.push(
                                {
                                    name: todoList[index].name,
                                    info: todoList[index].info,
                                    links: todoList[index].links,
                                    clickCount: 0
                                }
                            )
                        }
                    })
                    subjectFound = true;
                }
            })
            if (!subjectFound) {
                completedsubjects.push(
                    {
                        name: subjectName,
                        todoList: [
                            {
                                name: todoList[index].name,
                                info: todoList[index].info,
                                links: todoList[index].links,
                                clickCount: 0
                            }
                        ]
                    }
                )
            }

            setSubjects(subjects, true);
            todoList.splice(index, 1);
            todoList.forEach(item => {
                item.clickCount = 0;
            })
            editClicked = true;
            setSubjects(subjects, false);
            generateHTML(todoList, subjectIndex, subjects, subjectName, false, completedsubjects);
        })
    })


    document.querySelector('.go-back-arrow-container').innerHTML = '<img class="go-back-arrow" alt="go-back-arrow" src="images/go-back-2.png">'
    document.querySelector('.go-back-arrow').addEventListener('click', () => {
        generateSelectorHTML(subjects, completed)
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



export function getSubjects(completed) {
    const username = localStorage.getItem('login')
    let subjects;
    if (completed) {
        if (username) {
            const cookies = document.cookie.split('; ');
            cookies.forEach((cookie) => {
                const [cookieName, cookieValue] = cookie.split('=');
                if (cookieName === `completedsubjects-${username}`) {
                    subjects = JSON.parse(cookieValue);
                }
            })
        } else {
            subjects = JSON.parse(localStorage.getItem('completedsubjects')) || [];
        }
    } else {
        if (username) {
            const cookies = document.cookie.split('; ');
            cookies.forEach((cookie) => {
                const [cookieName, cookieValue] = cookie.split('=');
                if (cookieName === `subjects-${username}`) {
                    subjects = JSON.parse(cookieValue);
                }
            })
        }  else {
            subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        }
    }

    return subjects;
}

export function setSubjects(subjects, completed) {
    const username = localStorage.getItem('login');
    if (username) {
        if (completed) {
            document.cookie = `completedsubjects-${username}=${JSON.stringify(subjects)}; expires=Thu, 2 Dec 2032 12:00:00 UTC; path=/`;
        } else {
            document.cookie = `subjects-${username}=${JSON.stringify(subjects)}; expires=Thu, 2 Dec 2032 12:00:00 UTC; path=/`;
        }
    } else {
        if (completed) {
            localStorage.setItem('completedsubjects', JSON.stringify(subjects))
        } else {
            localStorage.setItem('subjects', JSON.stringify(subjects))
        }
    }
    
}
