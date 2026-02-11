var id = 1;
var to = [[0,"-" , 0],[0,"-" , 0],[0,"-" , 0]];


function addV(set)
{
    if(set == 1){
        document.getElementById("addStudents2").style.display = "flex";
    }
    else
    {
        document.getElementById("addStudents2").style.display = "none";
    }
        
}

function editV(set)
{
    if(set == 1){
        document.getElementById("editStudents2").style.display = "flex";
    }
    else
    {
        document.getElementById("editStudents2").style.display = "none";
    }
        
}

function removeV(set)
{
    if(set == 1){
        document.getElementById("removeStudents2").style.display = "flex";
    }
    else
    {
        document.getElementById("removeStudents2").style.display = "none";
    }
        
}

function openPass() {
    document.getElementById("pass").style.display = "flex";
  }

function checkPass()
{
    if(document.getElementById("password1").value == "12345")
    {
        window.location.href = "stindex.html";
        
    }

    else
    {
        alert("Wrong password");
        return;
    }
}

  function closePass() {
    document.getElementById("pass").style.display = "none";
  }


function calResult() {
    const table = document.getElementById("students");
    const rows = [];

    // collect rows (skip header)
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        rows.push({
            name: row.cells[1].innerText,
            mark: Number(row.cells[3].innerText)
        });
    }

    // sort by marks (descending)
    rows.sort((a, b) => b.mark - a.mark);

    // store top 3
    for (let i = 0; i < 3 && i < rows.length; i++) {
        to[i][0] = i + 1;
        to[i][1] = rows[i].name;
        to[i][2] = rows[i].mark;
    }

    console.log(to);

    localStorage.setItem("topResults", JSON.stringify(to));
}

function showResult() {
  const res = document.getElementById("resultTable");
  const data = JSON.parse(localStorage.getItem("topResults"));

    fetch("https://api.jsonbin.io/v3/b/698c3a05ae596e708f21f44b")
    .then(res => res.json()).then(data => data=data);


  if (!data) {
    alert("No result data found");
    return;
  }

  while (res.rows.length > 1) res.deleteRow(1);

  data.forEach(r => {
    const row = res.insertRow(-1);
    row.insertCell(0).innerText = r[0];
    row.insertCell(1).innerText = r[1];
    row.insertCell(2).innerText = r[2];
  });
}

function saveTable() {
  const table = document.getElementById("students");
  const data = [];

  for (let i = 1; i < table.rows.length; i++) {
    data.push({
      name: table.rows[i].cells[1].innerText,
      dep: table.rows[i].cells[2].innerText,
      mark: table.rows[i].cells[3].innerText
    });
  }

/*   localStorage.setItem("studentsData", JSON.stringify(data));
  console.log(JSON.stringify(data)); */

  putData(JSON.stringify(data));
  
}

function putData(records) {
  fetch("https://api.jsonbin.io/v3/b/698c3a05ae596e708f21f44b", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": "$2a$10$P0fYfAoEWrbmIlvlw.s28eQacp/pKeUw8o8tDuC5.O4XMOZXo7.my"
    },
    body: records // ONLY array
  })
  .then(res => res.json())
  .then(data => console.log("Updated:", data));
}


function add(Event)
{
    
    Event.preventDefault();
    var table = document.getElementById("students");
    const name = document.getElementById("name").value;
    const mark = document.getElementById("mark").value;
    const dep = document.getElementById("dep").value;

    if(name == "" || mark == "" || dep == "")
    {
        alert("Enter details properly");
        return;
    }

    if(mark > 600)
    {
        alert("Maximum mark is 600");
        return;
    }
    const newRow = table.insertRow(-1);
    newRow.insertCell(0).innerText = id;
    newRow.insertCell(1).innerText = name;
    newRow.insertCell(2).innerText = dep;
    newRow.insertCell(3).innerText =  mark;
    id+=1;

    document.getElementById("name").value = "";
   document.getElementById("mark").value = "";
     document.getElementById("dep").value = "";

    calResult();
    saveTable();

}
function loadTable() {
  const table = document.getElementById("students");
  //const data = JSON.parse(localStorage.getItem("studentsData"));

fetch("https://api.jsonbin.io/v3/b/698c3a05ae596e708f21f44b").then(res => res.json()).then(data => {
    console.log(data.record);
    
    data.record.forEach((s, index) => {
    const row = table.insertRow(-1);
    row.insertCell(0).innerText = index + 1;
    row.insertCell(1).innerText = s.name;
    row.insertCell(2).innerText = s.dep;
    row.insertCell(3).innerText = s.mark;
  });

  id = table.rows.length;
  calResult();
  // use data HERE
});

  
}

function remove(Event)
{
    Event.preventDefault();

    var table = document.getElementById("students");
    var id_r = document.getElementById("id_remove").value;
    console.log("id : " + id + " id_r " + id_r);
    if(id_r <= 0 || id_r >= id)
    {
        alert("Record does not exist");
        return;
    }

    if(confirm("Are you sure to delete " + table.rows[id_r].cells[1].innerText +" records") && id_r != 0)
    {
        
        table.deleteRow(id_r);
        resetId();
    }
    document.getElementById("id_remove").value = "";
    resetId();
    calResult();
    saveTable();
}

function show(Event)
{
    Event.preventDefault();
    let elements = document.getElementsByClassName("hide");
    const id_e = Number(document.getElementById("id_edit").value);


    if(id_e <= 0 || id_e >= id)
    {
        alert("Record does not exist");
        for (let i = 0; i < elements.length; i++) {
        elements[i].style.visibility = "hidden";
        }
        return;
    }

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.visibility = "visible";
    }

    const table = document.getElementById("students");

    const row = table.rows[id_e];

    document.getElementById("name_e").value = row.cells[1].innerText;
    document.getElementById("dep_e").value = row.cells[2].innerText;
    document.getElementById("mark_e").value = row.cells[3].innerText;

}

function hide()
{

    let elements = document.getElementsByClassName("hide");

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.visibility = "hidden";
    }

    

}

function save(Event)
{
    Event.preventDefault();
    var table = document.getElementById("students");
    const id_e = document.getElementById("id_edit").value;
    const name = document.getElementById("name_e").value;
    const mark = document.getElementById("mark_e").value;
    const dep = document.getElementById("dep_e").value;

    if(name == "" || mark == "" || dep == "")
    {
        alert("Enter details properly");
        return;
    }
    if (id_e <= 0 || id_e >= table.rows.length) {
        alert("Invalid S.No");
        return;
    }

    if(mark > 600)
    {
        alert("Maximum mark is 600");
        return;
    }

    const newRow = table.rows[id_e];
    newRow.cells[1].innerText = name;
    newRow.cells[2].innerText = dep;
    newRow.cells[3].innerText =  mark;

    hide();
    saveTable();
}
function resetId()
{
    var table = document.getElementById("students");
    for (let index = 1; index < table.rows.length; index++) {
        table.rows[index].cells[0].innerText = index;
    }
    id = table.rows.length;
}