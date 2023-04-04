const books = 
[
    {
        id: 1,
        type: "featured",
        title: "Ninth House",
        author: "Leigh Bardugo",
        genre: "thriller, fanfiction",
        imgUrl: "https://www.goodreads.com/book/show/43263680-ninth-house",
        img: "img/ninth_house.jpg",
        url: ""
    },
    {
        id: 2,
        type: "latest release",
        title: "Verity",
        author: "Colleen Hoover",
        genre: "thriller",
        imgUrl: "https://www.goodreads.com/book/show/59344312-verity?from_search=true&from_srp=true&qid=yH9NLxTdKV&rank=1",
        img: "img/verity.jpg",
        url: ""
    },
    {
        id: 3,
        type: "latest release",
        title: "Hell Bent",
        author: "Leigh Bardugo",
        genre: "thriller, fanfiction",
        imgUrl: "https://www.goodreads.com/book/show/60652997-hell-bent?ref=nav_sb_ss_1_9",
        img: "img/hell_bent.jpg",
        url: ""
    },
    {
        id: 4,
        type: "old favorite",
        title: "Harry Potter and the Philosopher's Stone",
        author: "J. K. Rowling",
        genre: "fantasy, magic, classic",
        imgUrl: "https://www.goodreads.com/book/show/72193.Harry_Potter_and_the_Philosopher_s_Stone?ref=nav_sb_ss_1_8",
        img: "img/philosophers_stone.jpg",
        url: ""
    },
    {
        id: 5,
        type: "old favorite",
        title: "The Lightning Thief",
        author: "Rick Riordan",
        genre: "fantasy, mythology, adventure",
        imgUrl: "https://www.goodreads.com/book/show/28187.The_Lightning_Thief?ref=nav_sb_ss_1_15",
        img: "img/lightning_thief.jpg",
        url: ""
    },
    {
        id: 6,
        type: "featured",
        title: "Shadow and Bone",
        author: "Leigh Bardugo",
        genre: "fantasy, high fantasy, fiction",
        imgUrl: "https://www.goodreads.com/book/show/10194157-shadow-and-bone?from_search=true&from_srp=true&qid=cPnOyeybwq&rank=1",
        img: "img/shadow_and_bone.jpg",
        url: ""
    },
    {
        id: 7,

    }
];

let featured = ``;
let oldFavorites = ``;
let latestReleases = ``;

books.forEach(book => {
    switch (book.type) {
        case "featured":
            featured += 
            `
            <div class="col-12 col-md-4 col-lg-3">
                <div class="card my-3">
                    <a target="_blank" href="${book.imgUrl}"><img src="${book.img}" class="card-img-top" alt="..."></a>
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text"><span>Author:</span> ${book.author}<br><span>Genre:</span> ${book.genre}<br> <a class="booklink" href="${book.url}">Read more...</a></p>
                        <a href="#" class="btn">Add to Cart</a>
                    </div>
                </div>
            </div>
            `;
            break;
        case "old favorite":
            oldFavorites += 
            `
            <div class="col-12 col-md-4 col-lg-3">
                <div class="card my-3">
                    <a href="${book.url}"><img src="${book.img}" class="card-img-top" alt="..."></a>
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text"><span>Author:</span> ${book.author}<br><span>Genre:</span> ${book.genre}<br> <a class="booklink" href="${book.url}">Read more...</a></p>
                        <a href="#" class="btn">Add to Cart</a>
                    </div>
                </div>
            </div>
            `;
            break;
        case "latest release":
            latestReleases +=
            `
            <div class="col-12 col-md-4 col-lg-3">
                <div class="card my-3">
                    <a href="${book.url}"><img src="${book.img}" class="card-img-top" alt="..."></a>
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text"><span>Author:</span> ${book.author}<br><span>Genre:</span> ${book.genre}<br> <a class="booklink" href="${book.url}">Read more...</a></p>
                        <a href="#" class="btn">Add to Cart</a>
                    </div>
                </div>
            </div>
            `;
            break;
    }
});

document.querySelector(".featured").innerHTML = featured;
document.querySelector(".old").innerHTML = oldFavorites;
document.querySelector(".latest").innerHTML = latestReleases;

// let imgs = document.getElementsByClassName("card-img-top");
// let cards = document.getElementsByClassName("card-body");

// for (let i = 0; i < imgs.length; i++){
//     let height = 300 - imgs[i].hei;
//     cards[i].style.height = height + "px";
// }