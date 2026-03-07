const courses = [

{code:"WDD 130", subject:"WDD", credits:2, completed:true},
{code:"WDD 131", subject:"WDD", credits:2, completed:true},
{code:"WDD 231", subject:"WDD", credits:2, completed:false},
{code:"CSE 110", subject:"CSE", credits:2, completed:false},
{code:"CSE 210", subject:"CSE", credits:2, completed:false}

];

const container=document.querySelector("#courseContainer");
const creditsDisplay=document.querySelector("#totalCredits");

function displayCourses(courseList){

container.innerHTML="";

courseList.forEach((course)=>{

const card=document.createElement("div");

card.textContent=course.code;

card.classList.add("course-card");

if(course.completed){
card.classList.add("completed");
}

container.appendChild(card);

});

const total=courseList.reduce((sum,course)=>sum+course.credits,0);

creditsDisplay.textContent=
`The total credits for courses listed above is ${total}`;

}

document.querySelector("#all").addEventListener("click",()=>{
displayCourses(courses);
});

document.querySelector("#wdd").addEventListener("click",()=>{

const filtered=courses.filter(course=>course.subject==="WDD");

displayCourses(filtered);

});

document.querySelector("#cse").addEventListener("click",()=>{

const filtered=courses.filter(course=>course.subject==="CSE");

displayCourses(filtered);

});

displayCourses(courses);


/* MOBILE MENU */

const menuButton=document.querySelector("#menuButton");
const navMenu=document.querySelector("#navMenu");

menuButton.addEventListener("click",()=>{
navMenu.classList.toggle("open");
});


/* FOOTER */

document.querySelector("#year").textContent=new Date().getFullYear();

document.querySelector("#lastModified").textContent=document.lastModified;