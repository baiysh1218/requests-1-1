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

//! Create
// получаем нужные элементы
const API = "http://localhost:8000/todos";
let inpAdd = document.getElementById("inp-add");
let btnAdd = document.getElementById("btn-add");
// навесили событие на кнопку "сохранить"
btnAdd.addEventListener("click", async function () {
  // собрипаем объект для добовление в дб.жейсон
  let newTodo = {
    todo: inpAdd.value,
  };
  // делаем проверку на заполненность инпута и остонавливаем код c помощю return, чтоб пост-запрос не выполнялся
  if (newTodo.todo.trim() === "") {
    alert("заполните поле");
    return;
  }
  // запроч для длбовления
  await fetch(API, {
    method: "POST", // указываем метод
    body: JSON.stringify(newTodo), // указываем что именно нужно запостить
    headers: {
      "Content-type": "application/json; charset=utf-8",
    }, //кодировка
  });
  // очищаем инпут после добовления
  inpAdd.value = "";
  // чтоб добавленный таск сразу отоброзился в листе вызываем функцию, которая отоброжается
  getTodos();
});

// ! Read
// ! Search
let inpSearch = document.getElementById("inp-search");
inpSearch.addEventListener("input", function () {
  getTodos();
});

let pagination = document.getElementById("pagination");
let page = 1;

// получаем элемент, чтою=б убедится, что в переменной ist сейчас НЕ пусто
let list = document.getElementById("list");
// фукция для получения всех тасков и отоброжения их в div#list
// async await нужен здесь, чтоб при отправке запроса мы сначала получили данные и только потом записали все в переменную response, иначе (если мы НЕ дождемся)туда запищется pending (состояние примиса, который еще не выполнен)
async function getTodos() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=2`
  ) // если не указать метод запроса, то по умолчанию это GET запрос
    .then(res => res.json()) // переводим все в json формат
    .catch(err => console.log(err)); // отловили ошибку

  // allЕodo - все элементы из дб.жейсон
  let allTodos = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log(err));
  // посчтитали какой будет последняя страница
  let lastPage = Math.ceil(allTodos.length / 2);
  // очишаем div#list, чтоб список тасков корректно отображался и не хранил там предыдущие html-элементы со старыми данными
  list.innerHTML = "";
  // перебираемт полученный из дб.жсон массива создаем div и задаем ему содержимое через метод innerHTML, каждый созданный элемент аппендим в div#list
  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML = `
    <span>${item.todo}</span>
    <button class = "btn-delete">Delete</button>
    <button class = "btn-edit">Edit</button>
    `;
    list.append(newElem);
  });

  // добовляем погинацию
  pagination.innerHTML = `
  <button id="btn-prev" ${page === 1 ? "disabled" : ""}>prev</button>
  <span>${page}</span>
  <button ${page === lastPage ? "disabled" : ""} id="btn-next">next</button>
  `;
}
// вызываем функцию , чтоб как только откроется страница что-то было отобразить
getTodos();

// элементы на модалке для редактирования
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");

let inpEditTodo = document.getElementById("inp-edit-todo");
let inpEditId = document.getElementById("inp-edit-id");
let btnSaveEdit = document.getElementById("btn-save-edit");

// ф-я для закрытия модалки

modalEditClose.addEventListener("click", function () {
  // объект с отредактированными данными
  modalEdit.style.display = "none";
});

btnSaveEdit.addEventListener("click", async function () {
  let editedTodo = {
    todo: inpEditTodo.value,
  };

  let id = inpEditId.value;
  // запросы для изменение данных
  await fetch(`${API}/${id}`, {
    method: "PATCH", // указываем метод
    body: JSON.stringify(editedTodo), // указываем что именно нужно запостить
    headers: {
      "Content-type": "application/json; charset=utf-8",
    }, //кодировка
  });
  // после изменения закрываем модалку для эдит
  modalEdit.style.display = "none";
  getTodos();
});

document.addEventListener("click", async function (e) {
  //! DELETE
  if (e.target.className === "btn-delete") {
    // запросы для удаления
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getTodos();
  }
  //! UPDATA (edit)
  if (e.target.className === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;
    // запросы для получения данных чтоб мы могли отоброзить все в модалке для релактирования
    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    // полученные данные отоброжаем в инпутах из хтмл
    inpEditTodo.value = response.todo;
    inpEditId.value = response.id;
  }
  // ! Pagination
  if (e.target.id === "btn-next") {
    page++;
    getTodos();
  }
  if (e.target.id === "btn-prev") {
    page--;
    getTodos();
  }
});
