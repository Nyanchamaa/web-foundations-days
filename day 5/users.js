const loadUsersButton = document.querySelector('#load-users');
const filterInput = document.querySelector('#filter-input');
const statusMessage = document.querySelector('#status');
const usersList = document.querySelector('#users-list');

const API_URL = 'https://jsonplaceholder.typicode.com/users';

let users = [];


// === RENDER USERS ===
function renderUsers(list) {
    usersList.innerHTML = '';

    if (list.length === 0) {
        const message = document.createElement('li');
        message.textContent = 'No users match your filter.';
        usersList.appendChild(message);
        return;
    }

    list.forEach(user => {
        const li = document.createElement('li');

        const name = document.createElement('h2');
        name.textContent = user.name;

        const email = document.createElement('p');
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement('p');
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement('p');
        company.textContent = `Company: ${user.company.name}`;

        li.appendChild(name);
        li.appendChild(email);
        li.appendChild(city);
        li.appendChild(company);

        usersList.appendChild(li);
    });
}


// === LOAD USERS ===
async function loadUsers() {
    loadUsersButton.disabled = true;
    statusMessage.textContent = 'Loading users...';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        users = await response.json();

        renderUsers(users);

        statusMessage.textContent = `Loaded ${users.length} users.`;

    } catch (error) {
        statusMessage.textContent =
            'Unable to load users. Please try again.';
        console.error('Error loading users:', error);

    } finally {
        loadUsersButton.disabled = false;
    }
}


// === FILTER USERS ===
filterInput.addEventListener('input', () => {
    const searchTerm = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
    );

    renderUsers(filteredUsers);
});


// === BUTTON EVENT ===
loadUsersButton.addEventListener('click', loadUsers);