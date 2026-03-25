const url = "data/members.json";
const container = document.querySelector("#members");

async function getMembers() {

const response = await fetch(url);
const data = await response.json();

displayMembers(data.members);

}

getMembers();

function displayMembers(members){

members.forEach(member => {

let card = document.createElement("section");

/* Membership Level */

let membershipLabel = "";

if(member.membership === 3){
membershipLabel = "Gold Member";
}
else if(member.membership === 2){
membershipLabel = "Silver Member";
}
else{
membershipLabel = "Member";
}

card.innerHTML = `
<h3>${member.name}</h3>

<span class="badge level${member.membership}">
${membershipLabel}
</span>

<img src="images/${member.image}" alt="${member.name}">

<p>${member.address}</p>
<p>${member.phone}</p>

<a href="${member.website}" target="_blank">Visit Website</a>
`;

container.appendChild(card);

});

}

/* Grid / List Toggle */

const gridBtn = document.querySelector("#grid");
const listBtn = document.querySelector("#list");

gridBtn.addEventListener("click", () => {

container.classList.add("grid");
container.classList.remove("list");

});

listBtn.addEventListener("click", () => {

container.classList.add("list");
container.classList.remove("grid");

});

/* Footer Dates */

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#lastModified").textContent = document.lastModified;


const menuButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    menuButton.classList.toggle("open");
});