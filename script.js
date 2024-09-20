const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask(){
    // if the input is empty check 
    if(inputBox.value ===''){
        alert("You must write Something");
    }else{
        let li = document.createElement("li");
        // It is used to get the input Value
        li.innerHTML=inputBox.value;
        // It is used to display the thing in the list container
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML="\u00d7";
        li.appendChild(span);
    }
    inputBox.value='';
    saveData();
}

listContainer.addEventListener("click",function(e){
    // it would check were we have clicked if we have clicked on the li then
    if(e.target.tagName === "LI"){
        // it would check the element and for already checked we have toggle so it would become unchecked
        e.target.classList.toggle("checked");
        saveData();
    }else if(e.target.tagName === "SPAN"){
        // It would reomve the parent element li
        e.target.parentElement.remove();
        saveData();
    }
},false);


function saveData(){
    localStorage.setItem("data",listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML=localStorage.getItem("data");
}

showTask();
