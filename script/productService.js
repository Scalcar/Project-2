class ProductService { // var productService = new ProductService();
    constructor() {
        this.productNotFoundMsg = 'Product not found';
        this.cartList = this.getCartProductsFromStorage();
        this.favoriteList = this.getFavoritesProductsFromStorage();
    }
   
    getFormatedProducts(products){
        var concatenatedProducts = '';
        products.forEach(product => {
            //pentru fiecare produs construieste urmatorul html
            concatenatedProducts += `
            <div class="card m-3 text-center" style="width: 16rem;" >
                <div class="position-relative card1">
                    <img src="${product.productUrl}" class="card-img-top p-3" alt="${product.name}">
                    <i class="bi bi-eye position-relative icon3 display3" onclick="openProduct(${product.id})"></i>
                </div>
                <div class="card-body">
                    <h5 class="card-title link2 text-secondary" onclick="openProduct(${product.id})">${product.name}</h5>
                    <p class="card-text">${this.showNumberOfStars(product)}</p>
                    <p class="card-text"><del>${product.price}</del> ${product.discountPrice} lei</p>
                    <div class="p-2 icon meniuTgl mb-2">
                        <div class="d-flex justify-content-evenly position-relative">
                            <div class="hOR">
                                <i class="bi bi-trash" onclick="removeProduct(${product.id})" title="Remove Product"></i>
                            </div>
                            <div class="hOG">
                                <i class="bi bi-gear" onclick ="updateProductById(${product.id})" title="Update Product"></i>
                            </div>
                            <div class="hOB">
                                <i class="bi bi-cart4" onclick ="addToCart(${product.id})" title="Add to Cart"></i>
                            </div>
                            <div class="hOR">
                                <i class="bi bi-heart" onclick="addToFavorites(${product.id})" title="Add to Wishlist"></i>
                            </div>
                        </div>                        
                    </div>                       
                </div>
            </div>`
        });
        return concatenatedProducts;
    }   
    
    getFormatedProduct(product){
        if (product) {
            return `
            <div class="card mb-3" style="border: none;">
                <div class="row g-0">
                    <div class="col-md-5">
                        <img src="${product.productUrl}" class="img-fluid rounded-start h-100" alt="${product.name}">
                    </div>
                    <div class="col-md-7">
                        <div class="card-body">
                            <h5 class="card-title ms-2">${product.name}</h5>
                            <p class="card-text ms-2">
                                ${this.getNumberOfStars(product)}       
                                <a href="#reviewId" class="list1">reviews</a>                                                                                                                                                       
                            </p>
                            <p class="card-text ms-2"><del>${product.price}</del>  ${product.discountPrice}</p>
                            <p class="card-text ms-2">"${product.description}"</p>
                            <div class="footerList my-2 ms-2 card-text">
                                <p>
                                    <ul class="list-inline my-1">
                                        <p>Share this:</p> 
                                        <li class="list-inline-item"><a class="px-1 py-1 mt-1" href="#" title="Facebook"><i class="bi bi-facebook text-secondary"></i></a></li>
                                        <li class="list-inline-item"><a class="px-1 py-1" href="#" title="Youtube"><i class="bi bi-youtube text-secondary"></i></a></li>
                                        <li class="list-inline-item"><a class="px-1 py-1" href="#" title="Instagram"><i class="bi bi-instagram text-secondary"></i></a></li>               
                                    </ul>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    }

    getReviews(product){
        let reviews = "";
        product.reviews.forEach(review => {
            reviews += `
                <div class="border rounded mb-2">
                    <p class="fw-bold p-2 mb-0 ms-3">${review.title}</p>
                    <p class="p-2 mb-1 ms-2">${review.description}</p>
                </div>
            `;
        })
        return reviews;
    }

       
    getNumberOfStars(product) {
        let starList = "";
        let rating = product.rating.avgRating;
        let fullStar = Math.floor(rating);
        let halfStar = (fullStar < rating);
        if (rating) {
            for (let index = 1; index <= 5; index++) {
                if (index <= fullStar) {
                    starList += ` <span class="fa fa-star checked" onclick="addRating(${product.id}, ${index})"></span>`
                }else if(index == fullStar+1 && halfStar == true) {
                    starList += ` <span class="fa fa-star-half-o yellow-color" onclick="addRating(${product.id}, ${index})"></span>`
                } else {
                    starList += ` <span class="fa fa-star text-primary" onclick="addRating(${product.id}, ${index})"></span>`
                }
            }
            return starList;
        } else {
            return `
            <span class="fa fa-star text-primary" onclick="addRating(${product.id}, 1)"></span>
            <span class="fa fa-star text-primary" onclick="addRating(${product.id}, 2)"></span>
            <span class="fa fa-star text-primary" onclick="addRating(${product.id}, 3)"></span>
            <span class="fa fa-star text-primary" onclick="addRating(${product.id}, 4)"></span>
            <span class="fa fa-star text-primary" onclick="addRating(${product.id}, 5)"></span> `;
        }
    }

    showNumberOfStars(product) {
        let starList = "";
        let rating = product.rating.avgRating;
        let fullStar = Math.floor(rating);
        let halfStar = (fullStar < rating);
        if (rating) {
            for (let index = 1; index <= 5; index++) {
                if (index <= fullStar) {
                    starList += ` <span class="fa fa-star checked"></span>`
                }else if(index == fullStar+1 && halfStar == true) {
                    starList += ` <span class="fa fa-star-half-o yellow-color"></span>`
                } else {
                    starList += ` <span class="fa fa-star text-primary"></span>`
                }
            }
            return starList;
        } else {
            return `
            <span class="fa fa-star text-primary"></span>
            <span class="fa fa-star text-primary"></span>
            <span class="fa fa-star text-primary"></span>
            <span class="fa fa-star text-primary"></span>
            <span class="fa fa-star text-primary"></span> `;
        }
    }

    getFormatedUpdateProduct(product) { //rezolvat
        if (product) {
            return `
            <table class="table  border-secondary table-striped table-light text-center w-100 mb-5 mt-2">
                <thead>
                    <tr>
                        <th scope="col">Details</th>
                        <th scope="col">Product</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Name:</td>
                        <td>${product.name}</td>
                    </tr>
                    <tr>
                        <td>Description:</td>
                        <td>"${product.description}"</td>
                    </tr>
                    <tr>
                        <td>Price:</td>
                        <td>${product.price}</td>
                    </tr>
                    <tr>
                        <td>New price:</td>
                        <td>${product.discountPrice}</td>
                    </tr>
                </tbody>
            </table>`;  
        }
    }
        
    getFormatedCart() {
        let list = '';
        list = `
        <thead>
            <tr>                           
                <th scope="col">Image</th>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Remove</th>
            </tr>
        </thead>
        <tbody>`;
        // var j = 1;
        this.cartList.forEach(function (product) {
            list += `
            <tr>                                
                <td><img src="${product.productUrl}" alt="${product.name}" class="w-25"></td>
                <td style="width: 180px;">${product.name}</td>
                <td>${product.discountPrice} lei</td>
                <td><div class="btn-toolbar mb-3 ps-2" role="toolbar" aria-label="Toolbar with button groups">
                    <div class="btn-group ms-3" role="group" aria-label="First group">
                        <button type="button" class="btn btn-outline-danger" onclick="modifyQuantityOfMinus(${product.id})">-</button>
                    <div class="bt1">
                        <input type="text" class="form-control" value="${product.quantity}" aria-label="Toolbar with button groups" aria-describedby="btnGroupAddon">
                    </div>
                        <button type="button" class="btn btn-outline-primary" onclick ="modifyQuantityOfPlus(${product.id})">+</button>
                    </div>
                </div></td>
                <td style="width:0px"; class="hOR2"><i class="bi bi-trash icon2" onclick="removeFromCart2(${product.id})"></i></td>
            </tr>`
            // j++;
        })
        let sumPrice = parseInt(0);
        for (let i = 0, l = this.cartList.length; i < l; i++) {
            sumPrice += parseInt(this.cartList[i].discountPrice) * parseInt(this.cartList[i].quantity);
        }
        list += `
        </tbody>
        <tfoot>
            <tr>
                <td></td>
                <td></td>
                <td>Total:</td>
                <td>${sumPrice}</td>
                <td></td>
            </tr>
        </tfoot>`;
        return list;
    }   

    getFormatedFavorites() {
        let favorites = '';
        favorites = `
        <thead>
            <tr>    
                <th scope="col">Nr</th>                       
                <th scope="col">Image</th>
                <th scope="col">Product</th>               
                <th scope="col">Links</th>
                <th scope="col">Remove</th>
            </tr>
        </thead>
        <tbody>`;
        var i = 1;
        this.favoriteList.forEach(function (product) {
            favorites += `
            <tr>  
                <td>${i}</td>                              
                <td><img src="${product.productUrl}" alt="${product.name}" class="w-25"></td>
                <td style="width: 180px;">${product.name}</td>                
                <td style="width:20px"; class="hOB2"><i class="bi bi-eye icon2" onclick="openProduct(${product.id})"></i></td>
                <td style="width:20px"; class="hOR2"><i class="bi bi-trash icon2" onclick = "removeFromFavorites2(${product.id})"></i></td>
            </tr>`
            i++;
        })
        favorites += `
        </tbody>
        <tfoot>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>              
            </tr>
        </tfoot>`;
        return favorites;             
        // <a href="#" onclick ="openProduct(${product.id})">View</a>             
    }

    showProductsByName(query, products) {
        let response = {
            list: '',
            count: 0
        }
        let filteredProducts = products.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        response.count = filteredProducts.length;
        filteredProducts.forEach(product => {
            response.list += `
            <div class="card m-3 text-center" style="width: 15rem;" >
                <div class="position-relative card1">
                    <img src="${product.productUrl}" class="card-img-top p-3" alt="${product.name}">
                    <i class="bi bi-eye position-relative icon3 display3" onclick="openProduct(${product.id})"></i>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-secondary link2" onclick="openProduct(${product.id})">${product.name}</h5>
                    <p class="card-text">${this.showNumberOfStars(product)}</p>
                    <p class="card-text"><del>${product.price}</del> ${product.discountPrice} lei</p>                                          
                </div>
            </div>`
        });
        return response;
    }

    // showProductsWithPriceRange(from,to){
    //     let items = this.products;
    //     items.forEach(function(item) {
    //         if(item.price >= from && item.price <= to){
    //             console.log(item);
    //         return item;
    //         }         
    //     })
    // }

    showProductsWithPriceRange(products, filter) { // aici 2)
        let response = {
            list: '',
            count: 0
        }
        let filteredProducts = products.filter(filter);
        response.count = filteredProducts.length;
        filteredProducts.forEach(product => {
            response.list += `
            <div class="card m-3 text-center" style="width: 15rem;" >
                <div class="position-relative card1">
                    <img src="${product.productUrl}" class="card-img-top p-3" alt="${product.name}">
                    <i class="bi bi-eye position-relative icon3 display3" onclick="openProduct(${product.id})"></i>
                </div>
                <div class="card-body">
                    <h5 class="card-title link2 text-secondary" onclick="openProduct(${product.id})">${product.name}</h5>
                    <p class="card-text">${this.showNumberOfStars(product)}</p>
                    <p class="card-text"><del>${product.price}</del> ${product.discountPrice} lei</p>                                         
                </div>
            </div>`
        });
        return response;
        // this.products.filter(product => product.price >= from && product.price <= to);
    }    

    discountCampainForAllProducts(percent) {  // 1)
        percent = Math.abs(percent);
        return this.products.filter(item => item.price = item.price * [(100 - percent) / 100]);
        // let items = this.products;
        // items.forEach(function(item) {
        //     percent = Math.abs(percent);
        //     item.price = item.price * [(100 - percent)/100];   
        //         console.log(item);
        //     return item; 
        // })
    }
    promoCodeDiscount(percent) {
        this.cartList.filter(product => {
            product.discountPrice = product.discountPrice * [(100 - percent) / 100];
            this.updateCartStorage();
        });
        return `Congrats! You have ${percent}% discount for each product in the cart`;
    }

    updateCartStorage() {
        window.localStorage.setItem('cartProducts', JSON.stringify(this.cartList));
    }

    updateFavoritesStorage() {
        window.localStorage.setItem('favorites', JSON.stringify(this.favoriteList));
    }

    getCartProductsFromStorage() {
        let cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
        return cartProducts ? cartProducts : [];
    }

    getFavoritesProductsFromStorage() {
        let data = JSON.parse(localStorage.getItem('favorites'));
        return data ? data : [];
    }

    addProductToCart(product, id) {
        var j = 1;
        if (!this.cartList.some(product => product.id === id)) {
            this.cartList.push(product);
            product.quantity = j;
            localStorage.setItem("count", JSON.stringify(j));
            this.updateCartStorage();
            return `Product ${product.name} was added to cart`;
        } else {   
            j = Number(localStorage.getItem('count'));                      
            j = ++j;           
            product.quantity = j;                 
            localStorage.setItem("count", JSON.stringify(j));
            for (var i = 0; i < this.cartList.length; i++) {
                if (this.cartList[i].id == id) {
                    this.cartList.splice(i, 1, product);
                    this.updateCartStorage();
                }
            }              
            return `Product ${product.name} is already in cart`;
        }
    }

    addProductToFavorites(product, id) {
        if (!this.favoriteList.some(product => product.id === id)) {
            this.favoriteList.push(product);
            this.updateFavoritesStorage();
            return `Product ${product.name} was added to wishlist`;
        } else {
            return `Product ${product.name} is already in wishlist`;
        }
    }

    removeProductFromCart() { //varianta gresita
        if (this.cartList.length >= 1) {
            let product = this.cartList.pop();
            // product.quantity = parseInt(1);
            this.updateCartStorage();
            return `Product ${product.name} was removed`;
        } else {
            return 'The cart is empty';
        }
    }

    removeProductFromCartAnotherMethod(product, id) {
        // let product = this.findProduct(id);
        for (var i = 0; i < this.cartList.length; i++) {
            if (this.cartList[i].id == id) {
                this.cartList.splice(i, 1);
                // product.quantity = parseInt(1);
                this.updateCartStorage();
                return `Product ${product.name} was removed from cart`;
            }
        }
        return `Product with id ${id} doesn't exist`;
    }

    removeProductFromFavorites() { //varianta gresita
        if (this.favoriteList.length >= 1) {
            let favorite = this.favoriteList.pop();
            this.updateFavoritesStorage();
            return `Product ${favorite.name} was removed from favorites`;
        } else {
            return 'The favorites list is empty';
        }
    }

    removeFromFavoritesAnotherMethod(product, id) {
        // let favorite = this.findProduct(id);
        for (var i = 0; i < this.favoriteList.length; i++) {
            if (this.favoriteList[i].id == id) {
                this.favoriteList.splice(i, 1);
                this.updateFavoritesStorage();
                return `Product ${product.name} was removed from wishlist`;
            }
        }
        return `Product with id ${id} doesn't exist`;
    }

    removeAllProductsFromCart() {
        if (this.cartList.length >= 1) {
            this.cartList.splice(0, this.cartList.length);
            this.updateCartStorage();
            return 'You have removed all products from cart';
        } else {
            return 'The cart is empty';
        }
    }

    removeAllProductsFromFavorites() {
        if (this.favoriteList.length >= 1) {
            this.favoriteList.splice(0, this.favoriteList.length);
            this.updateFavoritesStorage();
            return 'You have removed all products from wishlist';
        } else {
            return 'The wishlist is empty';
        }
    }

    getProductCount() {
        let count = {
            cartCount: this.cartList.length,
            // productsCount: this.products.length,
            favoritesCount: this.favoriteList.length
        };
        let total = 0;
        this.cartList.forEach(product => { total += product.quantity });
        count.cartCount = total;
        return count;
    }

    increasePlus(id) {
        for (var i = 0; i < this.cartList.length; i++) {
            const product = this.cartList[i];
            if (product.id == id) {
                product.quantity++;
                this.updateCartStorage();
                return `Quantity of ${product.name} increased by 1`;
            }
        }
        return `Product with id ${id} doesn't exist`;
    }
    decreaseMinus(id) {
        for (var i = 0; i < this.cartList.length; i++) {
            const product = this.cartList[i];
            if (product.id == id) {
                if (product.quantity > "1") {
                    product.quantity--;
                    this.updateCartStorage();
                    return `Quantity of ${product.name} decreased by 1`;
                } else {
                    this.removeProductFromCartAnotherMethod(product, id);
                    return `Product ${product.name} was removed from cart`;
                    // return "You have only one product! Remove it if you don't want it";
                }
            }
        }
        return `Product with id ${id} doesn't exist`;
    }

}










