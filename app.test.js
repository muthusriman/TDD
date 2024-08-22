const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const filePath = path.join(__dirname, "users.html");
const html = fs.readFileSync(filePath, "utf-8");

beforeAll(() => {
  const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => (store[key] = value.toString()),
      clear: () => (store = {}),
      removeItem: (key) => delete store[key],
    };
  })();
  Object.defineProperty(window, "localStorage", { value: mockLocalStorage });
});

beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
  ({ updateUserTable } = require("./users.js"));
  jest.resetModules();
  localStorage.clear();
});

afterEach(() => {
  jest.resetModules();
  localStorage.clear();
});

describe("User Management System", () => {
  test("should verify the landing page URL", async () => {
    const url = "http://127.0.0.1:5500/users.html";
    const response = await fetch(url);
    expect(response.status).toBe(200);
  });

  test("should verify the presence of title", () => {
    const title = document.querySelector("title");
    expect(title).toBeTruthy();
    expect(title.textContent).toBe("Management System");
  });

  test("should verify the presence of container", () => {
    const container = document.querySelector(".container");
    expect(container).toBeTruthy();
  });

  test("should verify the presence of a sidebar", () => {
    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).toBeTruthy();
  });

  test("should verify the presence of a sidebar-header", () => {
    const sidebarHeader = document.querySelector(".sidebar-header");
    expect(sidebarHeader).toBeTruthy();
  });

  test("should verify the presence of a sidebar-heading", () => {
    const sidebarHeading = document.querySelector("#sidebar-heading");
    expect(sidebarHeading).toBeTruthy();
    expect(sidebarHeading.textContent).toBe("MENU");
  });

  test("should verify the presence of a menu-icon", () => {
    const menuicon = document.querySelector(".fas.fa-bars");
    expect(menuicon).not.toBeNull();
  });

  test("should verify menu-icon button", () => {
    const toggleBtn = document.querySelector(".toggle-btn");
    expect(toggleBtn.disabled).toBeFalsy();
  });

  test("should toggle the sidebar class when the toggle button is clicked", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");
    expect(sidebar.classList.contains("closed")).toBe(false);
    toggleBtn.click();
    expect(sidebar.classList.contains("closed")).toBe(true);
    toggleBtn.click();
    expect(sidebar.classList.contains("closed")).toBe(false);
  });

  test("should verify the presence of tabs", () => {
    const tabs = document.querySelector(".tabs");
    expect(tabs).toBeTruthy();
  });

  test("should verify the presence of users tab", () => {
    const users = document.querySelector(".users");
    expect(users).toBeTruthy();
  });

  test('should verify the presence of "users" text in the tab', () => {
    const userstxt = document.querySelector(".users span");
    expect(userstxt.textContent).toBe("USERS");
  });

  test("should verify the presence of icon in users tab", () => {
    const usersicon = document.querySelector(".fas.fa-user");
    expect(usersicon).not.toBeNull();
  });

  test("should verify the presence of groups tab", () => {
    const groups = document.querySelector(".groups");
    expect(groups).toBeTruthy();
  });

  test('should verify the presence of "groups" text in the tab', () => {
    const groupstxt = document.querySelector(".groups span");
    expect(groupstxt.textContent).toBe("GROUPS");
  });

  test("should verify the presence of icon in groups tab", () => {
    const groupsicon = document.querySelector(".fas.fa-users");
    expect(groupsicon).not.toBeNull();
  });

  test('should verify the presence of "roles" text in the tab', () => {
    const rolestxt = document.querySelector(".roles span");
    expect(rolestxt.textContent).toBe("ROLES");
  });

  test("should verify the presence of icon in roles tab", () => {
    const rolesicon = document.querySelector(".fas.fa-user-shield");
    expect(rolesicon).not.toBeNull();
  });

  test("should verify the presence of main content area", () => {
    const mainContent = document.querySelector("#main");
    expect(mainContent).toBeTruthy();
  });

  test("should verify the presence of main heading", () => {
    const mainHeading = document.querySelector("#main-heading");
    expect(mainHeading).toBeTruthy();
    expect(mainHeading.textContent).toBe("USER MANAGEMENT");
  });

  test("should verify the presence of 'add-user' section", () => {
    const addUserSection = document.querySelector(".add-user");
    expect(addUserSection).toBeTruthy();
  });

  test("should verify the presence of 'Users List' heading", () => {
    const usersList = document.querySelector(".users-list");
    expect(usersList).toBeTruthy();
    const usersListHeading = document.querySelector(".users-list h2");
    expect(usersListHeading.textContent).toBe("Users List");
  });

  test("should verify the presence of alert", () => {
    const alert = document.querySelector(".alert");
    expect(alert).toBeTruthy();
  });

  test("should verify the presence of 'Create User' button", () => {
    const createButton = document.querySelector(".create-btn");
    expect(createButton).toBeTruthy();
    expect(createButton.disabled).toBeFalsy();
  });

  test("should verify the presence of 'Create User' text in the button", () => {
    const createButton = document.querySelector(".create-btn button");
    expect(createButton.textContent).toBe("CREATE USER");
    expect(createButton.disabled).toBeFalsy();
  });

  test("should verify the presence of  icon in 'Create User' button", () => {
    const createicon = document.querySelector(".fas.fa-user-plus");
    expect(createicon).not.toBeNull();
  });

  test("should verify the user table structure", () => {
    const tableContainer = document.querySelector(".table");
    const userTable = document.querySelector(".user-table");

    expect(tableContainer).toBeTruthy();
    expect(userTable).toBeTruthy();
    expect(userTable.querySelector("thead")).toBeTruthy();
    expect(userTable.querySelector("tbody")).toBeTruthy();
  });

  test("should have the correct table headers", () => {
    const head = document.querySelector(".table-row");
    expect(head).toBeTruthy();

    const headers = document.querySelectorAll(".user-table th");
    const headerTexts = [
      "USER ID",
      "USERNAME",
      "EMAIL ID",
      "FIRST NAME",
      "LAST NAME",
      "ACTIONS",
    ];
    expect(headers.length).toBe(headerTexts.length);
    headers.forEach((header, index) => {
      expect(header.textContent).toBe(headerTexts[index]);
    });
  });

  test("should display 'No users found' when the table is empty", () => {
    const table = document.querySelector(".user-table tbody");
    const rows = table.querySelectorAll("tr");

    expect(rows.length).toBe(1);

    const cells = rows[0].querySelectorAll("td");
    expect(cells[0].textContent.trim()).toBe("No users found");
  });

  test("should verify the presence of modal", () => {
    const modal = document.querySelector(".modal");
    expect(modal).toBeTruthy();
  });

  test("should verify the presence of modal header", () => {
    const modalHead = document.querySelector(".modal-head");
    const modalHeading = document.querySelector(".modal-heading");
    const closeModal = document.querySelector("#closeModal");
    const closeIcon = document.querySelector(".fa-regular.fa-circle-xmark");
    expect(modalHead).toBeTruthy();
    expect(modalHeading.textContent).toBe("CREATE USER");
    expect(closeModal).toBeTruthy();
    expect(closeIcon).not.toBeNull();
  });

  test("should verify the presence of modal alert message", () => {
    const alert = document.querySelector(".formMessage");
    expect(alert).toBeTruthy();
  });

  test("should verify the presence of form fields", () => {
    const form = document.querySelector("#addUserForm");
    expect(form).toBeTruthy();

    const usernameField = document.querySelector("#username");
    const emailField = document.querySelector("#email");
    const firstNameField = document.querySelector("#firstname");
    const lastNameField = document.querySelector("#lastname");

    expect(usernameField).toBeTruthy();
    expect(emailField).toBeTruthy();
    expect(firstNameField).toBeTruthy();
    expect(lastNameField).toBeTruthy();
  });

  test("should verify form fields have the correct attributes", () => {
    const usernameField = document.querySelector("#username");
    expect(usernameField.getAttribute("type")).toBe("text");
    expect(usernameField.hasAttribute("required")).toBe(true);

    const emailField = document.querySelector("#email");
    expect(emailField.getAttribute("type")).toBe("email");
    expect(emailField.hasAttribute("required")).toBe(true);

    const firstNameField = document.querySelector("#firstname");
    expect(firstNameField.getAttribute("type")).toBe("text");
    expect(firstNameField.hasAttribute("required")).toBe(true);

    const lastNameField = document.querySelector("#lastname");
    expect(lastNameField.getAttribute("type")).toBe("text");
    expect(lastNameField.hasAttribute("required")).toBe(true);
  });

  test("should verify the label text", () => {
    const usernameLabel = document.querySelector('label[for="username"]');
    expect(usernameLabel.textContent).toBe("* USERNAME :");

    const emailLabel = document.querySelector('label[for="email"]');
    expect(emailLabel.textContent).toBe("* EMAIL ID :");

    const firstNameLabel = document.querySelector('label[for="firstName"]');
    expect(firstNameLabel.textContent).toBe("* FIRST NAME :");

    const lastNameLabel = document.querySelector('label[for="lastName"]');
    expect(lastNameLabel.textContent).toBe("* LAST NAME :");
  });

  test("should verify the presence of 'Add User' and 'Reset' buttons in the form", () => {
    const addUserButton = document.querySelector("#addUser");
    const resetFormButton = document.querySelector("#resetForm");

    expect(addUserButton).toBeTruthy();
    expect(addUserButton.disabled).toBeFalsy();
    expect(resetFormButton).toBeTruthy();
    expect(resetFormButton.disabled).toBeFalsy();
  });

  test("should close modal on 'X' button click", () => {
    const closeModalButton = document.querySelector("#closeModal");
    const modal = document.querySelector(".modal");
    closeModalButton.click();
    expect(modal.classList.contains("hidden")).toBe(true);
  });

  test("should open modal on 'Create User' button click", () => {
    const createButton = document.querySelector(".create-btn button");
    const modal = document.querySelector(".modal");
    createButton.click();
    expect(modal.classList.contains("hidden")).toBe(false);
  });

  test("should show error message when required fields are missing", async () => {
    document.querySelector("#username").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#firstname").value = "";
    document.querySelector("#lastname").value = "";

    document.querySelector("#addUser").click();

    const formMessage = document.querySelector("#formMessage");
    expect(formMessage.innerHTML).toContain("Please fill in all fields.");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(formMessage.textContent).toBe("");
  });

  test("should show error message when email address already exists", async () => {
    document.querySelector("#username").value = "Jackie";
    document.querySelector("#email").value = "jack@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan";
    document.querySelector("#addUser").click();

    document.querySelector("#username").value = "Jack";
    document.querySelector("#email").value = "jack@gmail.com";
    document.querySelector("#firstname").value = "Jack";
    document.querySelector("#lastname").value = "Ma";
    document.querySelector("#addUser").click();

    const formMessage = document.querySelector("#formMessage");
    expect(formMessage.innerHTML).toContain("Email already exists.");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(formMessage.textContent).toBe("");
  });

  test("should successfully add a user and update localStorage", async () => {
    document.querySelector("#username").value = "Jackie";
    document.querySelector("#email").value = "jackie@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan";

    document.querySelector("#addUser").click();

    const alertDiv = document.querySelector(".alert");
    expect(alertDiv.innerHTML).toContain("User added successfully!");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(alertDiv.textContent).toBe("");

    const users = JSON.parse(localStorage.getItem("users"));
    expect(users.length).toBeGreaterThan(0);
    const newUser = users.find((user) => user.email === "jackie@gmail.com");
    expect(newUser).toBeTruthy();
    expect(newUser.username).toBe("Jackie");
    expect(newUser.firstName).toBe("Jackie");
    expect(newUser.lastName).toBe("Chan");
  });

  test("should display the new user in the user table", async () => {
    document.querySelector("#username").value = "Jackie";
    document.querySelector("#email").value = "jackie@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan";

    document.querySelector("#addUser").click();

    const alertDiv = document.querySelector(".alert");
    expect(alertDiv.innerHTML).toContain("User added successfully!");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const table = document.querySelector(".user-table tbody");
    const rows = table.querySelectorAll("tr");
    expect(rows.length).toBeGreaterThan(0);

    const cells = rows[0].querySelectorAll("td");
    expect(cells[0].textContent.trim()).toBe("1");
    expect(cells[1].textContent.trim()).toBe("Jackie");
    expect(cells[2].textContent.trim()).toBe("jackie@gmail.com");
    expect(cells[3].textContent.trim()).toBe("Jackie");
    expect(cells[4].textContent.trim()).toBe("Chan");
  });

  test("should display Edit and Delete buttons for each user in the user table", async () => {
    document.querySelector("#username").value = "Jackie";
    document.querySelector("#email").value = "jackie@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan";

    document.querySelector("#addUser").click();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const rows = document.querySelectorAll(".user-table tbody tr");
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((row, index) => {
      const editButton = row.querySelector(".edit-btn");
      const deleteButton = row.querySelector(".delete-btn");

      expect(editButton).not.toBeNull();
      expect(deleteButton).not.toBeNull();

      expect(editButton.disabled).toBeFalsy();
      expect(deleteButton.disabled).toBeFalsy();

      expect(editButton.dataset.id).toBe((index + 1).toString());
      expect(deleteButton.dataset.id).toBe((index + 1).toString());

      expect(editButton.innerHTML).toContain(
        '<i class="fas fa-edit"></i><span>Edit</span>'
      );
      expect(deleteButton.innerHTML).toContain(
        '<i class="fas fa-trash"></i><span>Delete</span>'
      );
    });
  });

  test("should reset the form after successful submission", () => {
    document.querySelector("#username").value = "Jackie";
    document.querySelector("#email").value = "jackie@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan";

    document.querySelector("#resetForm").click();

    expect(document.querySelector("#username").value).toBe("");
    expect(document.querySelector("#email").value).toBe("");
    expect(document.querySelector("#firstname").value).toBe("");
    expect(document.querySelector("#lastname").value).toBe("");
  });

  test("should reset form fields when closing the modal", () => {
    document.querySelector("#username").value = "Jackie";
    document.querySelector("#email").value = "jackie@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan";

    document.querySelector("#closeModal").click();

    document.querySelector(".create-btn button").click();

    expect(document.querySelector("#username").value).toBe("");
    expect(document.querySelector("#email").value).toBe("");
    expect(document.querySelector("#firstname").value).toBe("");
    expect(document.querySelector("#lastname").value).toBe("");
  });

  test("should add and edit a user, update the table accordingly, and validate alert content", async () => {
    document.querySelector(".create-btn button").click();
    document.querySelector("#username").value = "Jackie";
    document.querySelector("#email").value = "jackie@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan";

    document.querySelector("#addUser").click();
    await new Promise((resolve) => setTimeout(resolve, 100)); 

    let userRow = document.querySelector(".user-table tbody tr");
    expect(userRow).not.toBeNull(); 
    expect(userRow.cells[1].textContent).toBe("Jackie");
    expect(userRow.cells[2].textContent).toBe("jackie@gmail.com");
    expect(userRow.cells[3].textContent).toBe("Jackie");
    expect(userRow.cells[4].textContent).toBe("Chan");

    const alertDiv = document.querySelector(".alert");
    expect(alertDiv.innerHTML).toContain("User added successfully!");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(alertDiv.textContent).toBe("");

    const editButton = document.querySelector(
      '.actions .edit-btn[data-id="1"]'
    );
    editButton.click();
    await new Promise((resolve) => setTimeout(resolve, 100));

    document.querySelector("#username").value = "Jackie Updated";
    document.querySelector("#email").value = "jackieupdated@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan Updated";

    document.querySelector("#addUser").textContent = "Update User";
    document.querySelector("#addUser").click();
    await new Promise((resolve) => setTimeout(resolve, 100));

    userRow = document.querySelector(".user-table tbody tr");
    expect(userRow.cells[1].textContent).toBe("Jackie Updated");
    expect(userRow.cells[2].textContent).toBe("jackieupdated@gmail.com");
    expect(userRow.cells[3].textContent).toBe("Jackie");
    expect(userRow.cells[4].textContent).toBe("Chan Updated");

    expect(alertDiv.innerHTML).toContain("User updated successfully!");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(alertDiv.textContent).toBe("");
  });

  test("should delete a user and update the table accordingly", async () => {
    document.querySelector(".create-btn button").click(); 
    document.querySelector("#username").value = "Jackie";
    document.querySelector("#email").value = "jackie@gmail.com";
    document.querySelector("#firstname").value = "Jackie";
    document.querySelector("#lastname").value = "Chan";

    document.querySelector("#addUser").click();
    await new Promise((resolve) => setTimeout(resolve, 100)); 

    window.confirm = jest.fn().mockImplementation(() => true);

    const deleteButton = document.querySelector('.delete-btn[data-id="1"]');
    deleteButton.click();
    await new Promise((resolve) => setTimeout(resolve, 100)); 

    const userRow = document.querySelector(".user-table tbody tr");
    expect(userRow.textContent).toBe("No users found"); 

    const alertDiv = document.querySelector(".alert"); 
    expect(alertDiv.innerHTML).toContain("User deleted successfully!");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(alertDiv.textContent).toBe("");
  });
});