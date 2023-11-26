import { generateSelectorHTML, completedTodos } from "./fileselector.js";
import { getSubjects } from "./todo.js";
export let info = false;
export function addSidebarOnclick() {
  let sidebarClicked = false;
	document.querySelector('.sidebar-button').addEventListener('click', () => {
    if (!sidebarClicked) {
			let loginButtonHTML = '<a class="sidebar-link log-in-button"><p>Log in</p><div class="info-icon info-icon">+</div></a>'
			let login = localStorage.getItem('login');
			
			if (login) {
				loginButtonHTML = '<a class="sidebar-link log-in-button"><p>Log out</p><div class="info-icon info-icon">x</div></a>'
			}



      let cont = document.querySelector('.sidebar-cont');
			cont.style.zIndex = '200';
			cont.style.border = '2px solid var(--text-color)'
			cont.style.height = '200px'
			document.querySelector('.sidebar-button').paddingBottom = '5px';
			document.querySelector('.sidebar-button').innerHTML = `<div class="sidebar-animation-line"></div>
			<div class="sidebar-animation-line-2"></div><p class="close-sidebar">x</p>`
			cont.innerHTML += `
			<a onclick="notInfo="false" class="sidebar-link info-link" href="info.html"><p>Info</p><div class="info-icon">i</div></a>
			<a class="sidebar-link completed-todos-button"><p>Completed todos</p><img class="info-icon" src="./black-check-mark-md.png" alt="check-mark"></a>
			${loginButtonHTML}
			<a class="sidebar-link"><p>Main page</p><div class="info-icon info-icon">?</div></a>
			`
			sidebarClicked = true;
			if (!login) {
				document.querySelector('.log-in-button').addEventListener('click', () => {
					addSignupEventListener();
				})
			} else {
				localStorage.removeItem('login');
			}
			

			document.querySelector('.completed-todos-button').addEventListener('click', () => {
				if (document.title === 'Todo List info') {
					window.location.href = "index.html";
				}
				generateSelectorHTML(completedTodos, true)
			})
		} else {
			let cont = document.querySelector('.sidebar-cont');
			sidebarClicked = false;
			cont.style.zIndex = '-2';
			cont.style.border = 'none'
			document.querySelector('.sidebar-button').paddingBottom = '0px';
			cont.style.height = '0px'
			document.querySelector('.sidebar-button').innerHTML = `<div class="sidebar-animation-line"></div>
			<div class="sidebar-animation-line-2"></div><div class="sidebar-line"></div>
			<div class="sidebar-line"></div>
			<div class="sidebar-line"></div>`
			cont.innerHTML = '';
		}
			
	})
	
}

function addSignupEventListener() {
	
	document.querySelector('.todo-list-container').innerHTML = `
	<h1 class="todo-list-text log-in-header">Log in:</h1>
	<div class="sign-up-cont">
		<p class="edit-header">Username:</p>
		<input class="username-input" type="text" placeholder="username">
	</div>
	<div class="sign-up-cont">
		<p class="edit-header">Password:</p>
		<input type="text" class="password-input" placeholder="password" autocomplete="off" style="background-color: transparent;">
	</div>
	<button class="submit">Log in</button>
	<p class="sign-up-text">Don't have an account? <button class="sign-up">Sign up</button></p>
	`

	document.querySelector('.go-back-arrow-container').innerHTML = '<img class="go-back-arrow" alt="go-back-arrow" src="images/go-back-2.png">'
	document.querySelector('.go-back-arrow').addEventListener('click', () => {
		let ogSubjects = getSubjects(false);
		generateSelectorHTML(ogSubjects, false);
	})

	document.querySelector('.sign-up').addEventListener('click', () => {
		document.querySelector('.todo-list-container').innerHTML = `
		<h1 class="todo-list-text log-in-header">Sign up:</h1>
		<div class="sign-up-cont">
			<p class="edit-header">Username:</p>
			<input class="username-input" type="text" placeholder="username">
		</div>
		<div class="sign-up-cont">
			<p class="edit-header">Password:</p>
			<input type="text" class="password-input" placeholder="password" autocomplete="off" style="background-color: transparent;">
		</div>
		<button class="submit">Sign up</button>
		`
		document.querySelector('.go-back-arrow-container').innerHTML = '<img class="go-back-arrow" alt="go-back-arrow" src="images/go-back-2.png">'
		document.querySelector('.go-back-arrow').addEventListener('click', () => {
			addSignupEventListener();
		})
		
		document.querySelector('.password-input').addEventListener('keydown', (key) => {
			if (key.key === 'Enter') {
				signupSubmit();
			}
		})

		document.querySelector('.submit').addEventListener('click', () => {
			signupSubmit();
		})
	})
	
	document.querySelector('.password-input').addEventListener('keydown', (key) => {
		if (key.key === 'Enter') {
			loginSubmit();
		}
	})

	document.querySelector('.submit').addEventListener('click', () => {
		loginSubmit();
	})
	
}

function loginSubmit() {
	const username = document.querySelector('.username-input').value;
	const password = document.querySelector('.password-input').value;
	const cookies = document.cookie.split(';');
	let passwordFound;
	cookies.forEach(cookie => {
		if (cookie.split('=')[1] === username) {
			cookies.forEach((c) => {
				if (c.split('=')[1] === password) {
					passwordFound = true;
				}
			})
		}
	})
	
	if (!passwordFound) {
		alert('Wrong password or username!');
	} else {
		alert("You're in!")
		localStorage.setItem('login', username);
	}
}


function signupSubmit() {
	const username = document.querySelector('.username-input').value;
	const password = document.querySelector('.password-input').value;	
	let error = false;
	let errormsg = '';
	if (username.length < 1) {
		error = true;
		errormsg = 'Username should be at least one character';
	} else if (password.length < 1) {
		error = true;
		errormsg = 'Password should be at least one character';
	} else if (password.includes(' ')) {
		error = true;
		errormsg = "Password shouldn't contain any spaces"
	} else if (username.includes(' ')) {
		error = true;
		errormsg = "Username shouldn't contain any spaces"
	}
	if (error) {
		alert(errormsg)
	} else {
		let subjects = JSON.parse(localStorage.getItem('subjects')) || []
		let completedSubjects =  JSON.parse(localStorage.getItem('completedsubjects')) || []
		document.cookie = `username=${username}; expires=Thu, 2 Dec 2032 12:00:00 UTC; path=/`
		document.cookie = `password-${username}=${password}; expires=Thu, 2 Dec 2032 12:00:00 UTC; path=/`
		document.cookie = `subjects-${username}=${JSON.stringify(subjects)}; expires=Thu, 2 Dec 2032 12:00:00 UTC; path=/`;
		document.cookie = `completedsubjects-${username}=${JSON.stringify(completedSubjects)}; expires=Thu, 2 Dec 2032 12:00:00 UTC; path=/`;
		addSignupEventListener();
	}
}