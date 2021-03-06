//********************************** */
//Variables
//********************************** */
let employees = [];
const apiURL = 'https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US';
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const searchBar = document.querySelector('.search-bar');
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");
const cards = document.querySelectorAll(".card");
let modalIndex;




//********************************** */
//Fetch
//********************************** */
fetch(apiURL)
    .then(res => res.json())
    .then(data => data.results)
    //.then(data => console.log(data))
    .then(displayEmployees)
    .catch(error => console.log("there was a problem", error))



//********************************** */
//Helper functions
//********************************** */
function displayEmployees(employeeData) {
    employees = employeeData;
    //Store HTML for employee
    let employeeHTML = '';

    //loop on each employee and create HTML
    employees.map( (employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city
        let country = employee.location.country;
        let picture = employee.picture;
    
    //template literal -> build HTML
    employeeHTML += `
        <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}"/>
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
                <p class="address">${country}</p>
            </div>
        </div>
    `
    });
    gridContainer.innerHTML = employeeHTML;
}




function displayModal(index) {
    let {name, dob, phone, email, location: { city, street, state, postcode}, picture} = employees[index];

        let date = new Date(dob.date);

        const modalHTML = `
            <img class="avatar" src="${picture.large}" />
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
                <hr />
                <p>${phone}</p>
                <p class="address">${street.number} ${street.name}, ${state}, ${postcode}</p>
                <p>Birthday:
                ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
                </div>
        `
        overlay.classList.remove("hidden");
        modalContainer.innerHTML = modalHTML;
        modalIndex = index;
        //Every time the modal window is opened, it will change the value of the modalIndex variable 
        //that you already created to be the index of whatever modal window is currently open. 
}

//********************************** */
// Event Listeners 
//********************************** */
gridContainer.addEventListener('click', e => {
    //
    if (e.target !== gridContainer) {
        //select card based on its proxminity to actual element clicked 
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');
        
        displayModal(index);
    }

});


//********************************** */
//Modal close event
//********************************** */
modalClose.addEventListener('click', (e) => {
    overlay.classList.add("hidden");
});


//********************************** */
//Arrow modal
//********************************** */
arrowRight.addEventListener('click', e =>  {  
    if(modalIndex < 11){
        modalIndex++;
        displayModal(modalIndex)  
  // else if the index is 11 change it to 0      
    }else { (modalIndex === 11)
            modalIndex = 0;
        displayModal(modalIndex);
    }
 });


arrowLeft.addEventListener('click', e =>  {
    if(modalIndex > 0){
        modalIndex--;
        displayModal(modalIndex)
    } else { //change the index to 11 + diplayModal
        modalIndex = 11;
        displayModal(modalIndex);
    }
});


//********************************** */
//** Filter search feature on 'keyup'
//********************************** */

const handleSearch = e => {
    //create cardNames inside handler, to make sure that the fetch can provide
    //data when the page is loaded
    //if cardNames is create before thehandler, there is no data to get for the loop
    const cardNames = document.querySelectorAll('.text-container h2');
    const searchTarget = e.target.value.toLowerCase();

    cardNames.forEach(cardName => {
        const name = cardName.textContent.toLowerCase();

        //target element (cardName).parentElement.parentElement to get to
        // .card class (as parent to work with it)
        //.parentElement -> .text-container
        //.parentElement -> .card
        const card = cardName.parentElement.parentElement;
        //console.log(card);

        if(name.includes(searchTarget)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}
searchBar.addEventListener('keyup', handleSearch);




