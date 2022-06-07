/*
post -добовление данных
put - полная замена данных
putch - частичная замена данных 
delete - удаление
get - получение данных
*/
/*
команда для запуска json-server json-server -w db.json -p 8000
*/
/*
CRUD - Create(POST) Read(GET) Update(PUT, PATCH) Delete(DELETE)
*/
const API = "http://localhost:8000/todos";
let inpAdd = document.getElementById("inp-add");
let btnAdd = document.getElementById("btn-add");
// console.log(inpAdd, btnAdd);
btnAdd.addEventListener("click", function () {
  let newTodo = {
    todo: inpAdd.value,
  };
  // console.log(newTodo);
  fetch(API, {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
});
