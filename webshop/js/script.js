import { books } from './data.js';

let featured = ``;
let oldFavorites = ``;
let latestReleases = ``;
count();

function template (book){
    return `
    <div class="col-11 col-md-6 col-lg-4 col-xl-3">
        <div class="card my-3">
            <a target="_blank" href="${book.imgUrl}"><img src="source/img/covers/${book.id}.jpg" class="card-img-top" alt="..."></a>
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text"><span>Author:</span> ${book.author}<br><span>Genre:</span> ${book.genre}</p>
                <div class="row template-row">
                    <div class="col-8 template-btn">
                        <a href="html/book.html" onclick="buyBook(${book.id})" class="btn">Read more...</a>
                    </div>
                    <div class="col-4 template-btn">
                        <a class="btn" onclick="addToCart(${book.id}, 1)"><img width="32px" height="32px" src="../source/icon/cart.png"></a> 
                    </div>
                </div>
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
                    
window.count = count;
function count(){
    let listLength = 0;
    books.forEach(book => {
        if (localStorage.getItem(book.id) != null)
            listLength++;
    });
    localStorage.setItem("length", listLength)
    let counter = document.getElementById("counter");
    if (listLength == 0 || localStorage.getItem("length") == null)
        counter.style.display = "none";
    else {
        counter.innerHTML = `<p>${localStorage.getItem("length")}</p>`;
        counter.style.display = "block";
    }
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
    document.title += ` - ${selected.title}`;
    let curr = 
    `
    <div class="col-12 col-md-5 col-lg-4 px-5 px-md-3 my-3">
    <a href="${selected.imgUrl}" target="_blank"><img class="promo img-fluid" src="../source/img/covers/${selected.id}.jpg"></a>
    <div class="book-card mt-0">
        <h5 class="pt-3">
            ${selected.author}:
        </h5>
        <h3 class="text-center">
            ${selected.title}
        </h3>
    </div>
        <form name="cart" class="d-flex cart">
        <input id="submit" type="submit" value="${selected.price}$ - Add to Cart:">
        <input class="cart-input" inputmode="numeric" value="1" id="amount" name="amount" type="number" min="1">
        </form>
    </div>

    <div class="col-12 col-md-7 col-lg-8">
        <p class="p-5 summary">
            ${selected.summary}
            <br>
            <a href="${selected.source}" class="source" target="_blank">Source</a>    
        </p>
    </div>
    `;

    document.getElementById("buy").innerHTML = curr;

    let toCart = document.getElementById("submit");
    toCart.addEventListener("click", function(event){
        event.preventDefault();
        let amount = document.cart.amount.value;
        if (amount > 0)
            addToCart(selected.id, amount)
        else amountPopUp();
        document.cart.amount.value = 1;
    });
} // Load shoppingCart
else if (url.includes("cart.html")){
    refreshCart();
}

window.addToCart = addToCart;
function addToCart (id, amount){
    if (localStorage.getItem(id) == null){
        localStorage.setItem(id, amount);
    }
    else {
        let temp = localStorage.getItem(id);
        localStorage.setItem(id, parseInt(temp) + parseInt(amount));
    }
    purchased(id, amount);
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
        localStorage.setItem("length", 0)
        cartDiv.style.display = "none";
        emptyCart.style.display = "block";
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
                        <a target="_blank" href="${item.imgUrl}"><img src="../source/img/covers/${item.id}.jpg" class="item-img img-fluid" alt="..."></a>
                    </div>
                    <div class="col-6 col-lg-9">
                        <h5 class="item-title">${item.author}:</h5>
                        <h4 class="item-title"> ${item.title} </h4>
                        <p class="currentAmount">
                            Currently in cart: <span>${localStorage.getItem(item.id)}</span>
                        </p>
                        <p class="currentPrice">
                            Price: <span> ${Math.round(item.price * localStorage.getItem(item.id) * 100) / 100}$</span                
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
                    Total: <span>${Math.round(total * 100) / 100}$</span>
                </h6>
            </div>
            <div class="col-6">
                <a class="btn cart-btn" onclick="emptyCart()">Empty cart</a>
            </div>
            <div class="col-6">
                <a class="btn cart-btn" onclick="checkout()">Proceed to checkout</a>
            </div>
        </div>
        `;
        localStorage.setItem("length", cart.length);
        cartDiv.innerHTML = code;
        localStorage.setItem("total", total);
    }
    count();
}

window.purchased = purchased;
function purchased(id, value){
    let container = document.getElementById("purchased");
    let item = books.find(x => x.id == id);
    container.innerHTML = 
    `
    <div class="row">
        <div class="col-3 col-md-4">
            <img class="img-fluid" src="../source/img/covers/${item.id}.jpg">
        </div>
        <div class="col-9 col-md-8">
            <p class="text-center popupText">
                Added to Cart: 
            </p>
            <h6 class="author">
            ${item.author} -
            </h6>
            <h5>
                <span>${item.title}</span>
            </h5>
            <p class="popupText text-center">
                Amount: <span>${value}</span>
                <br>
                Cost: <span>${Math.round(item.price * value * 100) / 100}$</span>
                <br>
                In Cart: <span>${localStorage.getItem(item.id)}</span>
            </p>
            <a class="btn popup-btn" onclick="closePopUp('purchased')">OK.</a>
        </div>
    </div>
    `
    container.style.display = "block";
    count();
}

function amountPopUp(){
    let container = document.getElementById("amountPop");
    container.style.display = "block";
}

window.closePopUp = closePopUp;
function closePopUp(id){
    let container = document.getElementById(id);
    container.style.display = "none";
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

window.checkout = checkout;
function checkout(){
    let container = document.getElementById("checkoutPopUp");
    container.innerHTML = 
    `
    <div class="row">
        <div class="col-12">
            <p class="text-center popupText">
                Total price: <span> ${Math.round(localStorage.getItem("total") * 100) / 100}$</span>
            </p>
            <a class="btn popup-btn" onclick="closePopUp('checkoutPopUp'), emptyCart()">Pay</a>
        </div>
    </div>
    `;
    container.style.display = "block";
}

window.copyright = copyright;
function copyright() {
    let container = document.getElementById("copyright");
    container.style.display = "block";
}