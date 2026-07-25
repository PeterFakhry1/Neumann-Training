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



function showApp() {
   loginPage.style.display = "none";
    app.classList.remove("hidden");
    
}


function loadUsers(){
    $.ajax({
        url:"http://127.0.0.1:5000/users",
        method: "GET",
        dataType: "json",

        success: function(data){
            users = data;
            displayUsers();
            setTimeout(showApp, 0);
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
            alert("Could not load users.");
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
            <input type="text" id="company" placeholder="Company">
            <input type="text" id="address" placeholder="Address">
            <input type="text" id="city" placeholder="City">
            <input type="text" id="county" placeholder="County">

            <label for="color">Pick a Color</label>
            <input type="color" id="color" value= "#8bc447">

            <button type="submit">Add</button>
        </form>
    `;

     const addUserForm = document.getElementById("add-user-form");

addUserForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newUser = {
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        company: document.getElementById("company").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        county: document.getElementById("county").value,
        color: document.getElementById("color").value ,
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

    users.push(newUser);

    displayUsers();

closeDetailsPanel();
});
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
            <input type="text" id="edit-company" placeholder="Company" value="${user.company}">
            <input type="text" id="edit-address" placeholder="Address" value="${user.address}">
            <input type="text" id="edit-city" placeholder="City" value="${user.city}">
            <input type="text" id="edit-county" placeholder="County" value="${user.county}">

            <label for="edit-color">Company Color</label>
            <input type="color" id="edit-color" value="${user.color}">

            <button type="submit">Save Changes</button>
        </form>
    `;

    const editUserForm = document.getElementById("edit-user-form");

    editUserForm.addEventListener("submit", function(event) {
        event.preventDefault();

        user.fname = document.getElementById("edit-fname").value;
        user.lname = document.getElementById("edit-lname").value;
        user.company = document.getElementById("edit-company").value;
        user.address = document.getElementById("edit-address").value;
        user.city = document.getElementById("edit-city").value;
        user.county = document.getElementById("edit-county").value;
        user.color = document.getElementById("edit-color").value;

        if (user.fname === "") {
            alert("Please enter the first name");
            return;
        } else if (user.lname === "") {
            alert("Please enter the last name");
            return;
        } else if (user.company === "") {
            alert("Please enter the company name");
            return;
        }

        displayUsers();
        openDetails(user);
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
    loginPage.classList.remove("hidden");
}
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = loginUsername.value;
    const password = loginPassword.value;

    if (username === "admin" && password === "admin") {
        loginPage.classList.add("hidden");
        loadUsers();
    } else {
        loginError.textContent = "Invalid username or password.";
    }
});
setTimeout(showLogin, 800);
//loadUsers();
//setTimeout(showApp, 1500);