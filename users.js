// Dummy users array for demonstration purposes
let users = JSON.parse(localStorage.getItem('users')) || [];
let editingUserId = null; // Variable to track the ID of the user being edited

// Sidebar toggle functionality
document.querySelector(".toggle-btn").addEventListener("click", function () {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector("#main");
    sidebar.classList.toggle("closed");
    mainContent.classList.toggle("expanded");
});

// Add an event listener to the "CREATE USER" button
document.querySelector(".create-btn button").addEventListener("click", () => {
    const modal = document.querySelector(".modal");
    modal.classList.remove("hidden");
    document.querySelector("#modal-heading").textContent = "CREATE USER"; // Change modal heading
    document.querySelector("#addUser").textContent = "Add User"; // Change button text
    editingUserId = null; // Reset editingUserId to null
    document.querySelector('#addUserForm').reset(); // Reset form fields
});

// Close modal
document.querySelector('#closeModal').addEventListener('click', function () {
    const modal = document.querySelector('.modal');
    modal.classList.add('hidden');
    editingUserId = null; // Reset editingUserId to null
});

// Handle the add/edit user form submission
document.querySelector('#addUser').addEventListener('click', function (event) {
    event.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();
    const firstName = document.querySelector('#firstname').value.trim();
    const lastName = document.querySelector('#lastname').value.trim();
    const formMessage = document.querySelector('#formMessage');
    const modal = document.querySelector('.modal');
    const addUserForm = document.querySelector('#addUserForm');

    // Validation
    if (!username || !email || !firstName || !lastName) {
        formMessage.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i>  Please fill in all fields.';
        formMessage.style.color = '#dc3545'; // Error message color
        setTimeout(() => formMessage.textContent = '', 2000); // Hide message after 2 seconds
        return;
    }

    // Check if email already exists (exclude current user if editing)
    const emailExists = users.some(user => user.email === email && user.id !== editingUserId);
    if (emailExists) {
        formMessage.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i>  Email already exists.';
        formMessage.style.color = '#dc3545'; // Error message color
        setTimeout(() => formMessage.textContent = '', 2000); // Hide message after 2 seconds
        return;
    }

    if (editingUserId === null) {
        // Add new user (ID will be generated based on the array index)
        const newUser = {
            id: users.length + 1, // Assigning sequential ID based on current array length
            username,
            email,
            firstName,
            lastName
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Show success message and hide modal
        const alertDiv = document.querySelector('.alert');
        alertDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i>  User added successfully!';
        alertDiv.style.color = '#28a745'; // Success message color
        setTimeout(() => alertDiv.textContent = '', 2000); // Hide alert message after 2 seconds

        // Hide modal after success message
        setTimeout(() => {
            modal.classList.add('hidden');
            updateUserTable(); // Update the user table
        }, 0); // Modal disappears after 0 seconds

    } else {
        // Update existing user
        const userIndex = users.findIndex(user => user.id === editingUserId);
        if (userIndex !== -1) {
            users[userIndex] = { id: editingUserId, username, email, firstName, lastName };
            localStorage.setItem('users', JSON.stringify(users));

            // Show success message and hide modal
            const alertDiv = document.querySelector('.alert');
            alertDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i>  User updated successfully!';
            alertDiv.style.color = '#28a745'; // Success message color
            setTimeout(() => alertDiv.textContent = '', 2000); // Hide alert message after 2 seconds

            // Hide modal after success message
            setTimeout(() => {
                modal.classList.add('hidden');
                updateUserTable(); // Update the user table
            }, 0); // Modal disappears after 0 seconds
        }
    }

    // Reset the form and editingUserId
    addUserForm.reset();
    editingUserId = null;
});

// Handle the reset form button click
document.querySelector('#resetForm').addEventListener('click', function () {
    const addUserForm = document.querySelector('#addUserForm');
    addUserForm.reset(); // Reset the form fields
    document.querySelector('#formMessage').textContent = ''; // Clear any form messages
    editingUserId = null; // Reset editingUserId to null
});

function updateUserTable() {
    const tbody = document.querySelector('.user-table tbody');
    tbody.innerHTML = ''; // Clear existing table rows

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td class="no-users" colspan="6">No users found</td></tr>';
        return;
    }

    users.forEach((user, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.id}</td> <!-- Sequential ID -->
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>
                <div class="actions">
                    <div class="edit">
                        <button class="edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i><span>Edit</span></button>
                    </div>
                    <div class="delete">
                        <button class="delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i><span>Delete</span></button>
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Reattach event listeners
    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const userId = parseInt(this.dataset.id);
            const user = users.find(user => user.id === userId);

            if (user) {
                // Pre-fill form fields with the user's details
                document.querySelector('#username').value = user.username;
                document.querySelector('#email').value = user.email;
                document.querySelector('#firstname').value = user.firstName;
                document.querySelector('#lastname').value = user.lastName;

                // Set modal heading and button text for editing
                document.querySelector("#modal-heading").textContent = "UPDATE USER";
                document.querySelector("#addUser").textContent = "Update User";

                // Show the modal
                const modal = document.querySelector(".modal");
                modal.classList.remove("hidden");

                // Store the ID of the user being edited
                editingUserId = userId;
            }
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const userId = parseInt(this.dataset.id);
            if (confirm('Are you sure you want to delete this user?')) {
                // Remove the user
                users = users.filter(user => user.id !== userId);
                localStorage.setItem('users', JSON.stringify(users));

                // Show success message
                const alertDiv = document.querySelector('.alert');
                alertDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i>  User deleted successfully!';
                alertDiv.style.color = '#28a745'; // Success message color
                setTimeout(() => alertDiv.textContent = '', 2000); // Hide alert message after 2 seconds

                // Update the user table
                setTimeout(() => {
                    updateUserTable();
                }, 0); // Ensure table update happens after alert

            }
        });
    });
}

// Initial table update
updateUserTable();

module.exports = { updateUserTable };