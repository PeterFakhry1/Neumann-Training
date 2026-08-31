let users = [];
let currentPage = 1;
let usersPerPage = 6;
let totalUsers = 0;
let selectedCompany = "";

    const loader = document.getElementById("loader");
    const app = document.getElementById("app");
    const usersList = document.getElementById("users-list");
    const addUserBtn = document.getElementById("add-user-btn");
    const detailsPanel = document.getElementById("details-panel");
    const detailsContent = document.getElementById("details-content");
    const closeDetails = document.getElementById("close-details");
    const openMenu = document.getElementById("menu-btn");
    const showMoreBtn = document.getElementById("show-more-btn");
    const companyFilters = document.querySelectorAll(".company-filter");
    const loginPage = document.getElementById("login-page");
    const loginForm = document.getElementById("login-form");
    const loginUsername = document.getElementById("login-username");
    const loginPassword = document.getElementById("login-password");
    const loginError = document.getElementById("login-error");
    const rememberMe = document.getElementById("remember-me");
    const logoutBtn = document.getElementById("logout-btn");
    const themeToggleBtn = document.getElementById("theme-toggle-btn");


function showMessage(message, type = "info") {
    const modalHeader = document.getElementById("message-modal-header");
    const modalTitle = document.getElementById("message-modal-title");
    const modalBody = document.getElementById("message-modal-body");

    modalHeader.classList.remove("bg-primary", "bg-success", "bg-danger", "bg-warning", "text-white", "text-dark");

    if (type === "success") {
        modalHeader.classList.add("bg-success", "text-white");
        modalTitle.textContent = "Success";
    } else if (type === "error") {
        modalHeader.classList.add("bg-danger", "text-white");
        modalTitle.textContent = "Error";
    } else if (type === "warning") {
        modalHeader.classList.add("bg-warning", "text-dark");
        modalTitle.textContent = "Warning";
    } else {
        modalHeader.classList.add("bg-primary", "text-white");
        modalTitle.textContent = "Message";
    }

    modalBody.textContent = message;
    $("#message-modal").modal("show");
}

function getPreferredTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        return savedTheme;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }

    return "light";
}

function applyTheme(theme) {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme + "-mode");

    if (theme === "dark") {
        themeToggleBtn.textContent = "Light Mode";
    } else {
        themeToggleBtn.textContent = "Dark Mode";
    }
}

applyTheme(getPreferredTheme());

function isTooLong(value, maxLength){
    return value.length > maxLength;
}

function isValidName(name) {
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    return namePattern.test(name);
}

function showApp() {
   loginPage.style.display = "none";
    app.classList.remove("hidden");
    
}


function loadUsers(showAfterLoad = false, reset = true) {
    if (reset) {
        currentPage = 1;
        users = [];
    }

    $.ajax({
        url: `http://127.0.0.1:5000/users?page=${currentPage}&limit=${usersPerPage}&company=${selectedCompany}`,
        method: "GET",
        dataType: "json",

        success: function(data) {
            totalUsers = data.total;

            users = users.concat(data.users);

            displayUsers();

            if (showAfterLoad) {
                showApp();
            }
        },

        error: function() {
            showMessage("Could not load users data.", "error");
        }
    });
}

function displayUsers() {
    usersList.innerHTML = "";

/*  const selectedCompanies = [];

companyFilters.forEach(function(checkbox) {
    if (checkbox.checked) {
        selectedCompanies.push(checkbox.value);
    }
});

let filteredUsers = users;

if (selectedCompanies.length > 0) {
    filteredUsers = users.filter(function(user) {
        return selectedCompanies.includes(user.company);
    });
}    
const usersToShow = filteredUsers;   */
const usersToShow = users;
    usersToShow.forEach(function(user) {
        const card = document.createElement("div");

        card.classList.add("user-card");

        card.innerHTML = `
        <img class="user-photo" src="${user.photo}" alt="${user.fname} ${user.lname}">
            <div class="user-info">
                <h2>${user.fname} ${user.lname}</h2>
                <p>${user.company}</p>
            </div>

            <div class="card-color" style="background-color: ${user.color};"></div>
        `;

        card.addEventListener("click", function() {
           // closeDetailsPanel();
           openDetails(user);
        });

        usersList.appendChild(card);
    });

if(users.length >= totalUsers){
    showMoreBtn.style.display = "none";
} else {
    showMoreBtn.style.display = "inline-block";
}
}


function openDetails(user) {

  $("#details-panel").stop().animate({ width: "300px" }, 400);
      detailsPanel.classList.add("open");
    detailsPanel.style.borderLeftColor = user.color;

    detailsContent.innerHTML = `
    <img class="user-photo" src="${user.photo}" alt="${user.fname} ${user.lname}">
        <h2 style="color: ${user.color};">
            ${user.fname} ${user.lname}
        </h2>

        <p>${user.company}</p>

        <p>
            <strong>Address:</strong><br>
            ${user.address}<br>
            ${user.city}<br>
            ${user.county}
        </p>
        <button id="edit-user-btn" class="edit-user-btn">Edit User</button>
        <button id="delete-user-btn" class="delete-user-btn" >Delete</button>

    `;
    const deleteUserBtn = document.getElementById("delete-user-btn");
    const editUserBtn = document.getElementById("edit-user-btn");

    editUserBtn.addEventListener("click", function(){
        openEditUserForm(user);
    });

    deleteUserBtn.addEventListener("click", function(){
 const confirmDel = confirm("Are yo sure you want to delete this user")

 if(confirmDel){
     $.ajax({
        url: `http://127.0.0.1:5000/users/${user.id}`,
        method: "Delete",
        success: function(){
            showMessage("User deleted successfully.", "success");
            loadUsers();
            closeDetailsPanel();
        },
        error: function(){
            showMessage("Could not delete users.", "error");
        }
     });
     closeDetailsPanel();
 }
});
}

function openAddUserForm() {
   $("#details-panel").stop().animate({width: "300px"}, 400);
    detailsPanel.classList.add("open");
    detailsPanel.style.borderLeftColor = "#797979";

    detailsContent.innerHTML = `
        <h2 class="details-name" style="color: #797979;">Add User</h2>

        <form id="add-user-form">
            <input type="text" id="fname" placeholder="First Name">
            <input type="text" id="lname" placeholder="Last Name">
            <select id="company">
              <option value="">Select Company</option>
              <option value="Benton">Benton</option>
              <option value="Chanay">Chanay</option>
              <option value="Chemel">Chemel</option>
              <option value="Feltz Printing">Feltz Printing</option>
              <option value="Commercial Press">Commercial Press</option>
            </select>
            <input type="text" id="address" placeholder="Address">
            <input type="text" id="city" placeholder="City">
            <input type="text" id="county" placeholder="County">

            <label for="photo">User Photo</label>
            <input type="file" id="photo" accept="image/*">

            <label for="color">Pick a Color</label>
            <input type="color" id="color" value="#8bc447">

            <button type="submit">Add</button>
        </form>
    `;

     const addUserForm = document.getElementById("add-user-form");

 addUserForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newUser = {
        fname: document.getElementById("fname").value.trim(),
        lname: document.getElementById("lname").value.trim(),
        company: document.getElementById("company").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        county: document.getElementById("county").value.trim(),
        color: document.getElementById("color").value.trim(),
      photo: "images/default-user.svg"
    };
if(newUser.fname =="") {
    showMessage("Please enter your First Name", "error");
    return;}
else if(newUser.lname == "") {
    showMessage("Please enter you Last Name", "error");
    return;}
else if (newUser.company=="") {
    showMessage("Please enter your Company name", "error");
    return;}

    if (!isValidName(newUser.fname)) {
    showMessage("First name must contain only letters.", "error");
    return;
} else if (!isValidName(newUser.lname)) {
    showMessage("Last name must contain only letters.", "error");
    return;
}

if(isTooLong(newUser.fname, 35)){
showMessage("First name must be 35 characters or less", "error");
    return;
} else if (isTooLong(newUser.lname, 35)) {
    showMessage("Last name must be 35 characters or less", "error");
    return;
} else if (isTooLong(newUser.company, 40)) {
    showMessage("Company name must be 40 characters or less", " error");
    return;
} else if (isTooLong(newUser.address, 255)) {
    showMessage("Address must be 255 characters or less", "error");
    return;
} else if (isTooLong(newUser.city, 50)) {
    showMessage("City must be 50 characters or less", "error");
    return;
} else if (isTooLong(newUser.county, 50)) {
    showMessage("County must be 50 characters or less", "error");
    return;
}
   const photoFile = document.getElementById("photo").files[0];

if (photoFile) {
    const formData = new FormData();
    formData.append("photo", photoFile);

    $.ajax({
        url: "http://127.0.0.1:5000/upload",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            newUser.photo = response.photo;
            addUserToDatabase(newUser);
        },
        error: function() {
            showMessage("Could not upload image.", "error");
        }
    });
} else {
    newUser.photo = "images/default-user.svg";
    addUserToDatabase(newUser);
}
});

function addUserToDatabase(newUser) {
    $.ajax({
        url: "http://127.0.0.1:5000/users",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newUser),
        success: function() {
            showMessage("User added successfully.", "success");
            loadUsers();
            closeDetailsPanel();
        },
        error: function() {
            showMessage("Could not add user.", "error");
        }
    });
}

}

function openEditUserForm(user) {
    $("#details-panel").stop().animate({ width: "300px" }, 400);
    detailsPanel.classList.add("open");
    detailsPanel.style.borderLeftColor = user.color;

    detailsContent.innerHTML = `
        <h2 class="details-name" style="color: ${user.color};">Edit User</h2>
        <img class="user-photo" src="${user.photo}" alt="${user.fname} ${user.lname}">


        <form id="edit-user-form">
            <input type="text" id="edit-fname" placeholder="First Name" value="${user.fname}">
            <input type="text" id="edit-lname" placeholder="Last Name" value="${user.lname}">
            <select id="edit-company">
              <option value="">Select Company</option>
              <option value="Benton">Benton</option>
              <option value="Chanay">Chanay</option>
              <option value="Chemel">Chemel</option>
              <option value="Feltz Printing">Feltz Printing</option>
              <option value="Commercial Press">Commercial Press</option>
            </select>
            <input type="text" id="edit-address" placeholder="Address" value="${user.address}">
            <input type="text" id="edit-city" placeholder="City" value="${user.city}">
            <input type="text" id="edit-county" placeholder="County" value="${user.county}">

            <label for="edit-photo">Change User Photo</label>
            <input type="file" id="edit-photo" accept="image/*">

            <label for="edit-color">Company Color</label>
            <input type="color" id="edit-color" value="${user.color}">

            <button type="submit">Save Changes</button>
        </form>
    `;

    const editUserForm = document.getElementById("edit-user-form");
    document.getElementById("edit-company").value = user.company;

    editUserForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const updatedUser = {
        fname: document.getElementById("edit-fname").value.trim(),
        lname: document.getElementById("edit-lname").value.trim(),
        company: document.getElementById("edit-company").value.trim(),
        address: document.getElementById("edit-address").value.trim(),
        city: document.getElementById("edit-city").value.trim(),
        county: document.getElementById("edit-county").value.trim(),
        color: document.getElementById("edit-color").value.trim(),
        photo: user.photo
    };

        if (updatedUser.fname === "") {
            showMessage("Please enter the first name", "error");
            return;
        } else if (updatedUser.lname === "") {
            showMessage("Please enter the last name", "error");
            return;
        } else if (updatedUser.company === "") {
            showMessage("Please enter the company name", "error");
            return;
        }

        if (!isValidName(updatedUser.fname)) {
    showMessage("First name must contain only letters.", "error");
    return;
} else if (!isValidName(updatedUser.lname)) {
    showMessage("Last name must contain only letters.", "error");
    return;
}

if(isTooLong(updatedUser.fname, 35)){
showMessage("First name must be 35 characters or less", "error");
    return;
} else if (isTooLong(updatedUser.lname, 35)) {
    showMessage("Last name must be 35 characters or less", "error");
    return;
} else if (isTooLong(updatedUser.company, 40)) {
    showMessage("Company name must be 40 characters or less", "error");
    return;
} else if (isTooLong(updatedUser.address, 255)) {
    showMessage("Address must be 255 characters or less", "error");
    return;
} else if (isTooLong(updatedUser.city, 50)) {
    showMessage("City must be 50 characters or less", "error");
    return;
} else if (isTooLong(updatedUser.county, 50)) {
    showMessage("County must be 50 characters or less", "error");
    return;
}

        const photoFile = document.getElementById("edit-photo").files[0];

     if (photoFile) {
    const formData = new FormData();
    formData.append("photo", photoFile);

    $.ajax({
        url: "http://127.0.0.1:5000/upload",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            updatedUser.photo = response.photo;
            updateUserInDatabase(user.id, updatedUser);
        },
        error: function() {
            showMessage("Could not upload image.", "error");
        }
    });
    } else 
        {
    updateUserInDatabase(user.id, updatedUser);
        }
        });
    
} 
function updateUserInDatabase(userId, updatedUser) {
    $.ajax({
        url: `http://127.0.0.1:5000/users/${userId}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updatedUser),
        success: function() {
            showMessage("User updated successfully.", "success");
            loadUsers();
            closeDetailsPanel();
        },
        error: function() {
            showMessage("Could not update user.", "error");
        }
    });
}

addUserBtn.addEventListener("click", openAddUserForm);

function closeDetailsPanel(){
     $("#details-panel").stop().animate({ width :"0px"}, 400, function(){
            detailsPanel.classList.remove("open");
     });
    
}

closeDetails.addEventListener("click", closeDetailsPanel);

openMenu.addEventListener("click", function(){
    //i will add later
});

showMoreBtn.addEventListener("click", function(){
    currentPage++;
    loadUsers(false, false);
    });

companyFilters.forEach(function(checkbox){
     checkbox.addEventListener("change", function() {

        companyFilters.forEach(function(otherCheckbox) {
            if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
            }
        });

        if (checkbox.checked) {
            selectedCompany = checkbox.value;
        } else {
            selectedCompany = "";
        }

        loadUsers(false, true);
    });
});

function showLogin() {
    loader.style.display = "none";

    if (localStorage.getItem("isLoggedIn") === "true") {
        loginPage.classList.add("hidden");
        loadUsers(true);
    } else {
        loginPage.classList.remove("hidden");
    }
}

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = loginUsername.value;
    const password = loginPassword.value;

   $.ajax({
    url: "http://127.0.0.1:5000/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
        username: username,
        password: password
    }),
    success: function() {
        if (rememberMe.checked) {
            localStorage.setItem("isLoggedIn", "true");
        }

        loginPage.classList.add("hidden");
        loadUsers(true);
    },
    error: function() {
        loginError.textContent = "Invalid username or password.";
    }
});
});

logoutBtn.addEventListener("click", function() {
   localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");

    app.classList.add("hidden");

    loginPage.style.display = "flex";
    loginPage.classList.remove("hidden");

    loginUsername.value = "";
    loginPassword.value = "";

    closeDetailsPanel();
});

themeToggleBtn.addEventListener("click", function() {
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "light");
        applyTheme("light");
    } else {
        localStorage.setItem("theme", "dark");
        applyTheme("dark");
    }
});

setTimeout(showLogin, 1200);
//loadUsers();
//setTimeout(showApp, 1500);
