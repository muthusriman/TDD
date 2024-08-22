let users = JSON.parse(localStorage.getItem("users")) || [];
let groups = JSON.parse(localStorage.getItem("groups")) || [];
let editingUserId = null; // Variable to track the ID of the user being edited

// Show or hide content based on the selected tab
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    const tabId = this.dataset.tabId;
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.toggle("hidden", section.id !== tabId);
    });
  });
});

// Toggle sidebar visibility
document.querySelector(".toggle-btn").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("closed");
  document.querySelector("#main").classList.toggle("expanded");
});

// Add an event listener to the "CREATE USER" button
document.querySelector(".create-btn button").addEventListener("click", () => {
  const modal = document.querySelector("#userModal");
  modal.classList.remove("hidden");
  document.querySelector("#userModalHeading").textContent = "CREATE USER";
  document.querySelector("#addUser").textContent = "Add User";
  editingUserId = null; // Reset editingUserId to null
  document.querySelector("#addUserForm").reset(); // Reset form fields
});

// Close modal
document
  .querySelector("#closeUserModal")
  .addEventListener("click", function () {
    const modal = document.querySelector("#userModal");
    modal.classList.add("hidden");
    editingUserId = null; // Reset editingUserId to null
  });

// Handle the add/edit user form submission
document.querySelector("#addUser").addEventListener("click", function (event) {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const email = document.querySelector("#email").value.trim();
  const firstName = document.querySelector("#firstname").value.trim();
  const lastName = document.querySelector("#lastname").value.trim();
  const formMessage = document.querySelector("#userFormMessage");
  const modal = document.querySelector("#userModal");
  const addUserForm = document.querySelector("#addUserForm");

  // Validation
  if (!username || !email || !firstName || !lastName) {
    formMessage.innerHTML =
      '<i class="fa-solid fa-exclamation-circle"></i>  All fields are required.';
    formMessage.style.color = "#dc3545"; // Error message color
    setTimeout(() => (formMessage.textContent = ""), 2000); // Hide message after 2 seconds
    return;
  }

  // Check if email already exists (exclude current user if editing)
  const emailExists = users.some(
    (user) => user.email === email && user.id !== editingUserId
  );
  if (emailExists) {
    formMessage.innerHTML =
      '<i class="fa-solid fa-exclamation-circle"></i>  Email already exists.';
    formMessage.style.color = "#dc3545"; // Error message color
    setTimeout(() => (formMessage.textContent = ""), 2000); // Hide message after 2 seconds
    return;
  }

  if (editingUserId === null) {
    // Add new user (ID will be generated based on the array index)
    const newUser = {
      id: users.length + 1, // Sequential ID
      username,
      email,
      firstName,
      lastName,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message and hide modal
    const alertDiv = document.querySelector(".alert");
    alertDiv.innerHTML =
      '<i class="fa-solid fa-check-circle"></i>  User added successfully!';
    alertDiv.style.color = "#28a745"; // Success message color
    setTimeout(() => (alertDiv.textContent = ""), 2000); // Hide alert message after 2 seconds

    // Hide modal and update table
    setTimeout(() => {
      modal.classList.add("hidden");
      updateUserTable(); // Update the user table
    }, 0); // Modal disappears after 0 seconds
  } else {
    // Update existing user
    const userIndex = users.findIndex((user) => user.id === editingUserId);
    if (userIndex !== -1) {
      users[userIndex] = {
        id: editingUserId,
        username,
        email,
        firstName,
        lastName,
      };
      localStorage.setItem("users", JSON.stringify(users));

      // Show success message and hide modal
      const alertDiv = document.querySelector(".alert");
      alertDiv.innerHTML =
        '<i class="fa-solid fa-check-circle"></i>  User updated successfully!';
      alertDiv.style.color = "#28a745"; // Success message color
      setTimeout(() => (alertDiv.textContent = ""), 2000); // Hide alert message after 2 seconds

      // Hide modal and update table
      setTimeout(() => {
        modal.classList.add("hidden");
        updateUserTable(); // Update the user table
      }, 0); // Modal disappears after 0 seconds
    }
  }

  // Reset the form and editingUserId
  addUserForm.reset();
  editingUserId = null;
});

// Handle the reset form button click
document.querySelector("#resetUserForm").addEventListener("click", function () {
  document.querySelector("#addUserForm").reset(); // Reset the form fields
  document.querySelector("#userFormMessage").textContent = ""; // Clear any form messages
  editingUserId = null; // Reset editingUserId to null
});

function updateUserTable() {
  const tbody = document.querySelector(".user-table tbody");
  tbody.innerHTML = ""; // Clear existing table rows

  if (users.length === 0) {
    tbody.innerHTML =
      '<tr><td class="no-users" colspan="6">No users found</td></tr>';
    return;
  }

  users.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${user.id}</td> <!-- Sequential ID -->
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>
                <div class="actions">
                    <button class="edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i><span>Edit</span></button>
                    <button class="delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i><span>Delete</span></button>
                </div>
            </td>
        `;

    tbody.appendChild(row);
  });

  // Reattach event listeners
  attachEventListeners();
}

function attachEventListeners() {
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const userId = parseInt(this.dataset.id);
      const user = users.find((user) => user.id === userId);

      if (user) {
        // Pre-fill form fields with the user's details
        document.querySelector("#username").value = user.username;
        document.querySelector("#email").value = user.email;
        document.querySelector("#firstname").value = user.firstName;
        document.querySelector("#lastname").value = user.lastName;

        // Set modal heading and button text for editing
        document.querySelector("#userModalHeading").textContent = "UPDATE USER";
        document.querySelector("#addUser").textContent = "Update User";

        // Show the modal
        document.querySelector("#userModal").classList.remove("hidden");

        // Store the ID of the user being edited
        editingUserId = userId;
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const userId = parseInt(this.dataset.id);
      if (confirm("Are you sure you want to delete this user?")) {
        // Remove the user
        users = users.filter((user) => user.id !== userId);
        renumberUsers(); // Ensure sequential numbering
        localStorage.setItem("users", JSON.stringify(users));

        // Show success message
        const alertDiv = document.querySelector(".alert");
        alertDiv.innerHTML =
          '<i class="fa-solid fa-check-circle"></i>  User deleted successfully!';
        alertDiv.style.color = "#28a745"; // Success message color
        setTimeout(() => (alertDiv.textContent = ""), 2000); // Hide alert message after 2 seconds

        // Update the user table
        setTimeout(() => {
          updateUserTable();
        }, 0); // Ensure table update happens after alert
      }
    });
  });
}

// Renumber users to maintain sequential IDs
function renumberUsers() {
  users = users.map((user, index) => ({ ...user, id: index + 1 }));
}

// Handle group creation
document
  .querySelector("#createGroupBtn")
  .addEventListener("click", function () {
    // Clear the form and show the modal for adding a new group
    document.querySelector("#groupModalHeading").textContent = "CREATE GROUP";
    document.querySelector("#createGroupBtn").textContent = "Create Group";
    document.querySelector("#groupName").value = "";
    document.querySelector("#groupFormMessage").textContent = "";
    document.querySelector("#groupModal").classList.remove("hidden");
  });

// Close the group modal
document
  .querySelector("#closeGroupModal")
  .addEventListener("click", function () {
    document.querySelector("#groupModal").classList.add("hidden");
  });

// Handle create group form submission
document
  .querySelector("#createGroupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const groupName = document.querySelector("#groupName").value.trim();
    const groupFormMessage = document.querySelector("#groupFormMessage");

    // Validation
    if (!groupName) {
      groupFormMessage.innerHTML =
        '<i class="fa-solid fa-exclamation-circle"></i>  Group name is required.';
      groupFormMessage.style.color = "#dc3545";
      setTimeout(() => (groupFormMessage.textContent = ""), 2000);
      return;
    }

    // Check for duplicate group name
    if (groups.some((group) => group.name === groupName)) {
      groupFormMessage.innerHTML =
        '<i class="fa-solid fa-exclamation-circle"></i>  Group name already exists.';
      groupFormMessage.style.color = "#dc3545";
      setTimeout(() => (groupFormMessage.textContent = ""), 2000);
      return;
    }

    // Create new group
    const newGroup = {
      name: groupName,
      users: [],
    };
    groups.push(newGroup);
    localStorage.setItem("groups", JSON.stringify(groups));

    // Show success message
    const alertDiv = document.querySelector(".add-group .alert");
    alertDiv.innerHTML =
      '<i class="fa-solid fa-check-circle"></i>  Group created successfully!';
    alertDiv.style.color = "#28a745";
    setTimeout(() => (alertDiv.textContent = ""), 2000);

    // Close the modal and update the group table
    document.querySelector("#groupModal").classList.add("hidden");
    updateGroupTable();
  });

// Update group table
function updateGroupTable() {
  const tbody = document.querySelector(".group-table tbody");
  tbody.innerHTML = "";

  if (groups.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">No groups found</td></tr>';
    return;
  }

  groups.forEach((group) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${group.name}</td>
              <td>${group.users.length}</td>
              <td>
                  <button class="add-users-btn" data-group-name="${group.name}">Add Users</button>
                  <button class="remove-users-btn" data-group-name="${group.name}">Remove Users</button>
                  <button class="delete-group-btn" data-group-name="${group.name}">Delete Group</button>
              </td>
          `;
    tbody.appendChild(row);
  });

  // Reattach event listeners
  attachGroupEventListeners();
}

// Attach event listeners for group actions
function attachGroupEventListeners() {
  document.querySelectorAll(".add-users-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const groupName = this.dataset.groupName;
      // Implement adding users to the group
    });
  });

  document.querySelectorAll(".remove-users-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const groupName = this.dataset.groupName;
      // Implement removing users from the group
    });
  });

  document.querySelectorAll(".delete-group-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const groupName = this.dataset.groupName;
      if (confirm("Are you sure you want to delete this group?")) {
        groups = groups.filter((group) => group.name !== groupName);
        localStorage.setItem("groups", JSON.stringify(groups));
        updateGroupTable();
        const alertDiv = document.querySelector(".add-group .alert");
        alertDiv.innerHTML =
          '<i class="fa-solid fa-check-circle"></i>  Group deleted successfully!';
        alertDiv.style.color = "#28a745";
        setTimeout(() => (alertDiv.textContent = ""), 2000);
      }
    });
  });
}

// Initialize the user and group tables
updateUserTable();
updateGroupTable();
