let users = [];
let visibleUsers = 6;

const loader = document.getElementById("loader");
const app = document.getElementById("app");
const usersList = document.getElementById("users-list");
const addUserBtn = document.getElementById("add-user-btn");

    const detailsPanel = document.getElementById("details-panel");
    const detailsContent = document.getElementById("details-content");
    const closeDetails = document.getElementById("close-details");
    const openMenu = document.getElementById("menu-btn");
    const showMoreBtn = document.getElementById("show-more-btn");
    const showLessBtn = document.getElementById("show-less-btn");
    const separator = document.getElementById("separator");
    const companyFilters = document.querySelectorAll(".company-filter");
    const loginPage = document.getElementById("login-page");
    const loginForm = document.getElementById("login-form");
    const loginUsername = document.getElementById("login-username");
    const loginPassword = document.getElementById("login-password");
    const loginError = document.getElementById("login-error");
    const rememberMe = document.getElementById("remember-me");
    const logoutBtn = document.getElementById("logout-btn");

function isTooLong(value, maxLength){
    return value.length > maxLength;
}

function showApp() {
   loginPage.style.display = "none";
    app.classList.remove("hidden");
    
}


function loadUsers(showAfterLoad = false){
    $.ajax({
        url:"http://127.0.0.1:5000/users",
        method: "GET",
        dataType: "json",

        success: function(data){
            users = data;
            displayUsers();
            if (showAfterLoad) {
                showApp();
            }
           
        },
        error: function(){
            alert("could not load users Data!");
        }


    })
    };

function displayUsers() {
    usersList.innerHTML = "";

const selectedCompanies = [];

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

const usersToShow = filteredUsers.slice(0, visibleUsers);
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

if(visibleUsers >= filteredUsers.length){
    showMoreBtn.style.display = "none";
} else {
    showMoreBtn.style.display = "inline-block";
}
if(visibleUsers <= 6){
    showLessBtn.style.display = "none";
}else {
    showLessBtn.style.display = "inline-block";   
}
if(showMoreBtn.style.display === "none" || showLessBtn.style.display === "none"){
    separator.style.display = "none";
}else {
    separator.style.display = "inline-block";
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
             loadUsers();
             closeDetailsPanel();
        },
        error: function(){
            alert("Could not delete users.");
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
      photo: "images/default-user.png"
    };
if(newUser.fname =="") {
    alert ("Please enter your First Name");
    return;}
else if(newUser.lname == "") {
    alert("Please enter you Last Name");
    return;}
else if (newUser.company=="") {
    alert("Please enter your Company name");
    return;}

if(isTooLong(newUser.fname, 35)){
alert("First name must be 35 characters or less");
    return;
} else if (isTooLong(newUser.lname, 35)) {
    alert("Last name must be 35 characters or less");
    return;
} else if (isTooLong(newUser.company, 40)) {
    alert("Company name must be 40 characters or less");
    return;
} else if (isTooLong(newUser.address, 255)) {
    alert("Address must be 255 characters or less");
    return;
} else if (isTooLong(newUser.city, 50)) {
    alert("City must be 50 characters or less");
    return;
} else if (isTooLong(newUser.county, 50)) {
    alert("County must be 50 characters or less");
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
            alert("Could not upload image.");
        }
    });
} else {
    newUser.photo = "images/default-user.png";
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
            loadUsers();
            closeDetailsPanel();
        },
        error: function() {
            alert("Could not add user.");
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
            alert("Please enter the first name");
            return;
        } else if (updatedUser.lname === "") {
            alert("Please enter the last name");
            return;
        } else if (updatedUser.company === "") {
            alert("Please enter the company name");
            return;
        }

if(isTooLong(updatedUser.fname, 35)){
alert("First name must be 35 characters or less");
    return;
} else if (isTooLong(updatedUser.lname, 35)) {
    alert("Last name must be 35 characters or less");
    return;
} else if (isTooLong(updatedUser.company, 40)) {
    alert("Company name must be 40 characters or less");
    return;
} else if (isTooLong(updatedUser.address, 255)) {
    alert("Address must be 255 characters or less");
    return;
} else if (isTooLong(updatedUser.city, 50)) {
    alert("City must be 50 characters or less");
    return;
} else if (isTooLong(updatedUser.county, 50)) {
    alert("County must be 50 characters or less");
    return;
}

        $.ajax({
            url:`http://127.0.0.1:5000/users/${user.id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updatedUser),
        success: function() {
            loadUsers();
            closeDetailsPanel();
        },
        error: function() {
            alert("Could not update user.");
        }
    });
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
        visibleUsers +=3;
        if(visibleUsers > users.length){
            visibleUsers = users.length;
        }
        displayUsers();
    });


showLessBtn.addEventListener("click", function(){

        visibleUsers -=3  ;
        if(visibleUsers < 6){
            visibleUsers = 6;
        }
        displayUsers();
    });


companyFilters.forEach(function(checkbox){
    checkbox.addEventListener("change", function(){
        visibleUsers = 6;
        displayUsers();
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

setTimeout(showLogin, 1200);
//loadUsers();
//setTimeout(showApp, 1500);
