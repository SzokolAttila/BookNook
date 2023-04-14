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
    if (localStorage.getItem("id") == null)
        localStorage.setItem("id", 1);
    let selected = books.find(x => x.id == localStorage.getItem("id"));
    let curr = 
    `
    <div class="col-12 col-md-4 px-5 px-md-3 my-3">
    <a href="${selected.imgUrl}"><img class="promo img-fluid" src="../source/img/covers/${selected.img}"></a>
    <div class="book-card mt-0">
        <h5 class="pt-3">
            ${selected.author}:
        </h5>
        <h3 class="text-center">
            ${selected.title}
        </h3>
    </div>
        <form name="cart" class="d-flex cart">
        <input id="submit" type="submit" value="Add to Cart:">
        <input class="cart-input" inputmode="numeric" value="1" id="amount" name="amount" type="number" min="1">
        </form>
    </div>

    <div class="col-12 col-md-8">

    </div>
    `;

    document.getElementById("buy").innerHTML = curr;

    let toCart = document.getElementById("submit");
    toCart.addEventListener("click", function(event){
        event.preventDefault();
        let amount = document.cart.amount.value;
        if (amount > 0){
            if (localStorage.getItem(localStorage.getItem("id")) == null){
                localStorage.setItem(localStorage.getItem("id"), amount);
            }
            else {
                let temp = localStorage.getItem(localStorage.getItem("id"));
                localStorage.setItem(localStorage.getItem("id"), parseInt(temp) + parseInt(amount));
            }
            purchased(selected, amount);
        }
        else amountPopUp();
        document.cart.amount.value = 1;
    });
} // Load shoppingCart
else if (url.includes("cart.html")){
    refreshCart();
}

//Store book to be purchased
window.buyBook = buyBook;
function buyBook (id){
    localStorage.setItem("id", id);
}

window.removeFromCart = removeFromCart;
function removeFromCart(itemId){
    localStorage.removeItem(itemId);
    refreshCart();
}

window.refreshCart = refreshCart;
function refreshCart (){
    let cart = [];
    let emptyCart = document.getElementById("emptyCart");
    let cartDiv = document.getElementById("shoppingCart");
    books.forEach(book => {
        if (localStorage.getItem(book.id) != null){
            cart.push(book);
        }
    });
    if(cart.length == 0){
        cartDiv.style.display = "none";
        emptyCart.innerHTML = 
        `
         <div class="row emptyRow">
            <div class="col-12" id="empty">
                <h3 class="text-center">
                    It seems that your Cart is currently empty...
                </h3>
                <a target="_blank" href="https://www.flaticon.com/free-icons/sad"><img id="sad" src="../source/icon/sad.png" class="img-fluid"></a>
                <div>
                    <a href="../index.html" class="btn browse">Keep browsing...</a>
                </div>
                </div>
         </div>
        `;
    }
    else{
        let code = ``;
        let total = 0;
        for (const item of cart) {
            total += item.price * localStorage.getItem(item.id);
            code +=
            `
                <div class="row item">
                    <div class="col-4 col-lg-2">
                        <a target="_blank" href="${item.imgUrl}"><img src="../source/img/covers/${item.img}" class="item-img img-fluid" alt="..."></a>
                    </div>
                    <div class="col-6 col-lg-9">
                        <h5 class="item-title">${item.author}:</h5>
                        <h4 class="item-title"> ${item.title} </h4>
                        <p class="currentAmount">
                            Currently in cart: <span>${localStorage.getItem(item.id)}</span>
                        </p>
                        <p class="currentPrice">
                            Price: <span> ${item.price * localStorage.getItem(item.id)}$</span                
                        </p>
                    </div>
                    <div class="col-2 col-lg-1">
                        <a class="btn item-btn" title="Remove from cart" onclick="removeFromCart(${item.id})"><img src="../source/icon/delete.png" class="img-fluid"></a>
                        <a class="btn item-btn" title="Add one" onclick="changeAmount(1, ${item.id})"><img src="../source/icon/plus.png" class="img-fluid"></a>
                        <a class="btn item-btn" title="Remove one" onclick="changeAmount(-1, ${item.id})"><img src="../source/icon/minus.png" class="img-fluid"></a>
                    </div>
                </div>
            `;
        };
        code +=
        `
        <div class="row checkout">
            <div class="col-12">
                <h6 class="text-end checkout-text">
                    Total: <span>${total}$</span>
                </h6>
            </div>
            <div class="col-6">
                <a class="btn cart-btn" onclick="emptyCart()">Empty cart</a>
            </div>
            <div class="col-6">
                <a class="btn cart-btn" onclick="">Proceed to checkout</a>
            </div>
        </div>
        `;
        cartDiv.innerHTML = code;
    }
}

function purchased(item, value){
    let container = document.getElementById("purchased");
    container.innerHTML = 
    `
    <div class="row">
        <div class="col-3 col-md-4">
            <img class="img-fluid" src="../source/img/covers/${item.img}">
        </div>
        <div class="col-9 col-md-8">
            <p class="text-center popupText">
                Added to Cart: 
            </p>
            <h5>
            ${item.author} - <br><span>${item.title}</span>
            </h5>
            <p class="popupText text-center">
                Amount: <span>${value}</span>
                <br>
                Price: <span>${item.price}$</span>
            </p>
            <a class="btn popup-btn" onclick="closePopUp('purchased')">OK.</a>
        </div>
    </div>
    `
    container.style.zIndex = 1;
}

function amountPopUp(){
    let container = document.getElementById("amountPop");
    container.style.zIndex = 1;
}

window.closePopUp = closePopUp;
function closePopUp(id){
    let container = document.getElementById(id);
    container.style.zIndex = -1;
}

window.changeAmount = changeAmount;
function changeAmount(value, itemId){
    let current = localStorage.getItem(itemId);
    if (value == -1 && current == 1){
        amountPopUp();
    }   
    else{
        localStorage.setItem(itemId, parseInt(current) + parseInt(value));
        refreshCart();
    }
}

window.emptyCart = emptyCart;
function emptyCart(){
    books.forEach(book => {
        if (localStorage.getItem(book.id) != null)
            localStorage.removeItem(book.id);
    });
    refreshCart();
}