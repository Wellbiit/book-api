window.onload = (book) => {
    const routes = [
        {path: '/', handler: homeHandler},
        {path: '/index.html', handler: homeHandler},
        {path: '/login.html', handler: loginHandler},
        {path: '/signup.html', handler: signupHandler}
    ]
    handleUrlChange();
    function handleUrlChange () {
        const path = window.location.pathname;
        const urlPath = routes.find(route => route.path === path)
        if (urlPath) {
            urlPath.handler();
        } else {
            homeHandler();
        }
    }
    function homeHandler () {
        console.log("home works");
        const bookForm = document.getElementById("book-form");
        console.log(bookForm);
        const urlAddBook = 'http://127.0.0.1:5000/create_book';
        renderBooksForFiveDays ()
        logout();
        bookForm.addEventListener("submit", (book) => {
            book.preventDefault();
            console.log(123)
            sendRequestToServer(bookForm, urlAddBook);
        })
        const submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', sendBookData);
    }

    function loginHandler () {
    const loginForm = document.getElementById("login-form");
    const urlLogin = 'http://127.0.0.1:5000/login';
    const urlIndex = 'http://127.0.0.1:5000/index';

    loginForm.addEventListener("submit", (book) => {
    book.preventDefault();

    sendRequestToServer(loginForm, urlLogin)
    .then(response => {
        if ( response.isLogged ) {
            location.replace("/index.html");
            localStorage.setItem("token", response.token);
            console.log(localStorage.getItem("token"));
        }
    });
    })

    }

  function sendBookData() {
  console.log(11111)
    const title = document.getElementById('query').value;
    const data = document.getElementById('data').value;

    const bookData = {
        title: title,
        data: data
    };
    console.log(bookData)
    return fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(bookData)
    })

    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

    bookData.addEventListener("onclick", (book) => {
    book.preventDefault();
    })
    }

    function sendRequestToServer (form, url) {

        const formData = new FormData(form);
        const data = {};

        for (const[key, value] of formData.entries()) {
            data[key] = value;
        }

        return fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(error => console.error('Помилка:', error));
    }


    let currentDate = new Date();
    let date = currentDate.toISOString();
    let dateToDisplay = convertStringToDate(currentDate);

    function convertStringToDate(str) {
        return new Date(str).toLocaleDateString();
    }

    const urlIndex = `http://127.0.0.1:5000/get_books_by_date/${dateToDisplay}`;
//
//    const token = localStorage.getItem("token");
//    fetch(urlIndex, {
//        method: 'GET',
//        headers: { Authorization: `Bearer ${token}` }
//    })
//    .then(response => response.json())
//    .then(data => console.log(data))
//    .catch(error => {
//        console.error('Error:', error);
//    });


    function signupHandler () {
        const signupForm = document.getElementById("signup-form");
        const urlSignup = 'http://127.0.0.1:5000/signup';
        signupForm.addEventListener("submit", (book) => {
            book.preventDefault();
            sendRequestToServer(signupForm, urlSignup)
            .then(response => {
                if (response.isRegistered) {
                    location.replace("/index.html");
                }
            });
    })
    }
    function getBooksByDate (date) {
        const apiUrlGet = `http://127.0.0.1:5000/get_books_by_date/${date}`;
        const token = localStorage.getItem("token")
        console.log(token)
        return fetch(apiUrlGet, {
            method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
          })
          .then(response => response.json())
          .catch(error => {
            console.error('Помилка:', error);
          });
    }


//    function sendRequestToServer (form, url) {
//        const formData = new FormData(form);
//        const data = {};
//        for (const[key, value] of formData.entries()) {
//            data[key] = value;
//        }
//        return fetch(url, {
//            method: "POST",
//            headers: {"Content-type": "application/json"},
//            body: JSON.stringify(data)
//        })
//        .then(response => response.json())
//        .catch(error => console.error('Помилка:', error));
//    }


    function logout() {
        const btn = document.getElementById("logoutButton");
        btn.addEventListener("click", (book) => {
            localStorage.removeItem("token");
            location.replace("login.html")
        })}


        function showBooks (data) {
            console.log(data)
            const booksDiv = document.getElementById("display-books");
            const singleDayBooks = createElementAndAppendChild("div", null, booksDiv);
            singleDayBooks.classList.add("single-day-books");
            const date = JSON.parse(data[0]).date;
            console.log(date)
            if (date) {
                createElementAndAppendChild("h4", date, singleDayBooks)
            }
            data.forEach( (book) => {
                book = JSON.parse(book);
                const singleBook = createElementAndAppendChild("div", null, singleDayBooks);
                createElementAndAppendChild("h3", book.title, singleBook);
                createElementAndAppendChild("h3", book.date, singleBook);
            })
        }
    function createElementAndAppendChild (tagName, content, tagAddTo) {
        const createdElement = document.createElement(tagName);
        if ( content ) { createdElement.textContent = content };
        tagAddTo.appendChild(createdElement);
        return createdElement;
    }


    function renderBooksForFiveDays() {

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 5);
        let currentDate = new Date();

        while (currentDate <= endDate) {
            const date = currentDate.toISOString();
            const dateU = date.slice(0, 10)

            console.log(date.slice(0, 10))

//            console.log(date.slice(0, 10));

            getBooksByDate(dateU)
            .then(data => showBooks(data))

            currentDate.setDate(currentDate.getDate() + 1)
        }
    }
}






var verify_existance = false;

function queryBooks() {

    const QUERY = (document.getElementById("query").value).toLowerCase();
    var results = document.getElementById("res");
    loader.setAttribute('style', 'display: block;');
    var query_display = document.getElementById("query-display");

    if (verify_existance == true) {
            results.remove(results);

            results = document.createElement('div');
            results.setAttribute('id', 'res');
            results.setAttribute('class', 'results');

            loader = document.createElement('div');
            loader.setAttribute('class', 'loader');
            loader.setAttribute('id', 'load');

            query_display = document.createElement('div');
            query_display.setAttribute('id', 'query-display');

            results.appendChild(loader);
            results.appendChild(query_display);

            document.getElementById('main').appendChild(results);
        }

    query_display.innerHTML = "Related results for \"" + QUERY + "\"";

    const URL = "https://www.googleapis.com/books/v1/volumes?q=" + QUERY

    var request = new XMLHttpRequest();

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', URL, true);

    request.onload = function () {
        // Begin accessing JSON data here

        for (var i = 0; i < 10; i++) {
            var data = JSON.parse(this.response);
            // console.log(data)
            var authors = (data["items"][i]["volumeInfo"]["authors"]) || 'No Author Disclosed'
            var title = (data["items"][i]["volumeInfo"]["title"]) || 'No title Disclosed'
            var publisher = (data["items"][i]["volumeInfo"]["publisher"]) || 'No publisher Disclosed'
            try {
            var thumbnail = data["items"][i]["volumeInfo"]["imageLinks"]["thumbnail"]
            }
            catch (err) {
                var thumbnail = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Georgia_404.svg/1125px-Georgia_404.svg.png'
            }

        var info = (data["items"][i]["volumeInfo"]["infoLink"]) || 'No info Disclosed'


        card = document.createElement('div');
        card.setAttribute('class', 'card col-md-6');
        card.setAttribute('style', 'max-width: 32rem;');
        card.setAttribute('id', 'results');


        const logo = document.createElement('img');
        logo.src = thumbnail;
        logo.className = "card-img-top"

        card.appendChild(logo);

        const card_body = document.createElement('div');
        card_body.setAttribute('class', 'card-body');

        const card_title = document.createElement('h5');
        card_title.setAttribute('class', 'card-title');
        card_title.innerHTML = title;

        card_body.appendChild(card_title);

        const card_text = document.createElement('p');
        card_text.setAttribute('class', 'card-text');
        card_text.innerHTML = "By: " + authors + "<br>Published By: " + publisher;

        card_body.appendChild(card_text);

        const button = document.createElement('a');
        button.setAttribute('class', 'btn btn-primary btn-md');
        button.setAttribute('href', info);
        button.innerHTML = "See this Book"

        card_body.appendChild(button);

        card.appendChild(card_body);

        results.appendChild(card); }
    }

    verify_existance = true;
    // Send request
    request.send()
    document.getElementById('query').value = ''
    setTimeout("loader.setAttribute('style', 'display: none;')", 1500);

}