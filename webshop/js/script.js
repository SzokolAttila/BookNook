import { books } from './data.js';

let featured = ``;
let oldFavorites = ``;
let latestReleases = ``;

function template (book){
    return `
    <div class="col-11 col-md-6 col-lg-4 col-xl-3">
        <div class="card my-3">
            <a target="_blank" href="${book.imgUrl}"><img src="source/img/covers/${book.img}" class="card-img-top" alt="..."></a>
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text"><span>Author:</span> ${book.author}<br><span>Genre:</span> ${book.genre}</p>
                <a href="html/book.html" onclick="buyBook(${book.id})" class="btn">Read more...</a>
            </div>
        </div>
    </div>
    `;
}

function categorize (book, current){
    switch (book.type) {
        case "featured":
            featured += current;
            break;
        case "old favorite":
            oldFavorites += current;
            break;
        case "latest release":
            latestReleases += current;
            break;
    }
}

window.showBooks = showBooks;
function showBooks (criterion, filterOn) {
    criterion = criterion.toLowerCase();
    latestReleases = ``;
    oldFavorites = ``;
    featured = ``;
    if (criterion == ""){
        books.forEach(book => {
            let current = template(book)
            categorize(book, current);
        });
    }
    else{
        books.forEach(book => {
            let current = template(book);
            if(filterOn == "genre"){
                if (book.genre.toLowerCase().indexOf(criterion) != -1){
                    categorize(book, current);
                }
            }
            else {
                if (book.author.toLowerCase().indexOf(criterion) != -1 || book.title.toLowerCase().indexOf(criterion) != -1){
                    categorize(book, current);
                }
            }
        });
    }
    document.querySelector(".featured").innerHTML = featured;
    document.querySelector(".old").innerHTML = oldFavorites;
    document.querySelector(".latest").innerHTML = latestReleases;
}

let url = window.location.href;
if(document.getElementsByClassName("scroll").length > 0){
    showBooks("");

    //EventListeners for categories and searchbar filters
    let filter = document.getElementById("filter");
    filter.addEventListener("keypress", function (event){
        if (event.key === "Enter"){
            event.preventDefault();
            let value = document.other.filter.value;
            showBooks(value, "genre");
            document.other.filter.value = "";
        }
    });

    let searchbar = document.getElementById("searchbar");
    searchbar.addEventListener("keydown", function(event){
        let condition = document.search.searchbar.value;
        showBooks(condition);
        if (event.key === "Enter"){
            event.preventDefault();
            document.search.searchbar.value = "";
        }
    });
}

//Load certain book

if(url.includes("book.html")){
    let selected = books.find(x => x.id == localStorage.getItem("id"));
    let curr = 
    `
    <div class="col-12 col-md-4 col-lg-3 ps-5 my-5">
    <a href="${selected.imgUrl}"><img class="promo img-fluid" src="../source/img/covers/${selected.img}"></a>
    <div class="book-card mt-0">
        <h5 class="pt-3">
            ${selected.author}
        </h5>
        <h3 class="text-center">
            ${selected.title}
        </h3>
    </div>
        <form action="" name="cart" class="d-flex cart">
        <input id="submit" type="submit" value="Add to Cart:"></a>
        <input class="cart-input" inputmode="numeric" value="1" max="99" id="amount" name="amount" type="number" min="0">
        </form>
    </div>

    <div class="col-12 col-md-8 col-lg-9">

    </div>
    `;

    document.getElementById("buy").innerHTML = curr;

    let toCart = document.getElementById("submit");
    toCart.addEventListener("click", function(event){
        event.preventDefault();
        let amount = document.cart.amount.value;
        if (localStorage.getItem(localStorage.getItem("id")) == null){
            localStorage.setItem(localStorage.getItem("id"), amount);
        }
        else {
            let temp = localStorage.getItem(localStorage.getItem("id"));
            localStorage.setItem(localStorage.getItem("id"), parseInt(temp) + parseInt(amount));
        }
        document.cart.amount.value = 1;

    });
}

//Store book to be purchased
window.buyBook = buyBook;
function buyBook (id){
    localStorage.setItem("id", id);
}