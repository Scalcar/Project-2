var userService = new UserService();
var productService = new ProductService();
var commonService = new CommonService();
var httpService = new HttpService();

function login() {
   let email = $('#emailId').val();
   // let email = document.getElementById('emailId').value;
   let password = $('#passwordId').val();

   httpService.login(email, password);
}

//aceasta functie se executa pe evenimentul onload pe pagina de produse
function authorize() {
   let isAuthenticated = commonService.getFromStorage('token');
   if (!isAuthenticated) {
      commonService.redirect("login.html");
   }
}

function authorize2() {
   let isAuthenticated = commonService.getFromStorage('token');
   if(isAuthenticated == "9295f50f-11d1-4076-87d0-7f2324f8093c"){
      commonService.showInfoMessage("Welcome back master!");
   }else {
      commonService.redirect("profile.html");
      commonService.showInfoMessage("Sorry! That is not for you.");
   }  
}

function logOut() {
   window.localStorage.removeItem('token');
   window.localStorage.removeItem('cartProducts');
   window.localStorage.removeItem('favorites');
   // window.localStorage.removeItem('connected');
   commonService.redirect("login.html");
}

function register() {
   //colectam datele din inputuri
   let name = $('#nameId').val();
   let email = $('#emailId').val();
   let age = Number($('#ageId').val());
   let gender = $('#genderId').val();
   let password = $('#passwordId').val();

   let profile = {"email": email, "name": name, "age": age, "gender": gender, "password": password};
   // let user = new User(name, email, password);
   // userService.addUser(user);

   httpService.register(profile);
}

function showProducts() {
   let promise = httpService.getProducts();
   promise
   .then(products => {
      let formatedProducts = productService.getFormatedProducts(products);
      document.getElementById('productsListId').innerHTML = formatedProducts;
      document.getElementById('listCountId').innerHTML = products.length;
   })
   .catch(error => {
      commonService.showInfoMessage(error);
   }); 
}

function showProfile(){
   httpService.getProfile()
   .then(profile => {
      let response = userService.getFormatedProfileDetail(profile);
   
      document.getElementById('myprofileId').innerHTML = response;
   })
   .catch(error => {
         commonService.showInfoMessage(error);
   });
}

function removeProduct(id){
   httpService.deleteProductById(id);

//   showProducts();
//   updateProductsCount();
}

//functia este apelata cand se da click pe un produs
function openProduct(id) {
   commonService.setToStorage('productId', id);
   commonService.redirect("productDetails.html");
}

//funtia este apelata la onload pe pagina productDetails
function showProduct() {
   let productId = commonService.getFromStorage('productId');
   if(productId){
   let promise = httpService.getProductbyId(productId);
      promise
         .then(product => {
            let formatedProduct = productService.getFormatedProduct(product);
            document.getElementById('productDetailId').innerHTML = formatedProduct;
         })
         .catch(error => {
            commonService.showInfoMessage(error);
      });
   }
}

function showReview() {
   let productId = commonService.getFromStorage('productId');
   if(productId){
   let promise = httpService.getProductbyId(productId);
      promise
         .then(product => {
            let formatedReview = productService.getReviews(product);
            document.getElementById('reviewId').innerHTML = formatedReview;
            document.getElementById('reviewCountId').innerHTML = product.reviews.length;
         })
         .catch(error => {
            commonService.showInfoMessage(error);
      });
   }
}

function updateProductById(id) {
   commonService.setToStorage('updateProductId', id);
   commonService.redirect("updateProduct.html");
}

function showUpdateDetailProduct() { // ??? - product update
   let productId = window.localStorage.getItem("updateProductId");
   let promise = httpService.getProductbyId(productId);
   promise
      .then(product => {
         let productUpdate = productService.getFormatedUpdateProduct(product);
         document.getElementById('itemUpdate').innerHTML = productUpdate;
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });       
}

function setProductDetails(){
   let productId = commonService.getFromStorage('updateProductId');

   let promise = httpService.getProductbyId(productId)
      promise
        .then(product => {
         document.getElementById('nameId').value = product.name; 
         document.getElementById('descriptionId').value = product.description; 
         document.getElementById('priceId').value = product.price;
         document.getElementById('productUrlId').value = product.productUrl;
         document.getElementById('discountPriceId').value = product.discountPrice; 
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
}

function updateProduct() {
   let name = $('#nameId').val();
   let description = $('#descriptionId').val();
   let price = $('#priceId').val();
   let discountPrice = $("#discountPriceId").val();
   let productUrl = $("#productUrlId").val();
   let productId = commonService.getFromStorage('updateProductId');

   let product = {"id": Number(productId), "name": name, "description": description, "price": price, "discountPrice": discountPrice, "productUrl": productUrl};

   httpService.updateProduct(product);
   // showUpdateDetailProduct();
}

function addToFavorites(id) {
   let promise = httpService.getProductbyId(id);
   promise
      .then(product => {
         let response = productService.addProductToFavorites(product, id);
         commonService.showInfoMessage(response);
         // refreshProducts();
         updateProductsCount();
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
}

function addToCart(id) {
   let promise = httpService.getProductbyId(id);
   promise
      .then(product => {                           
         let response = productService.addProductToCart(product,id);
         commonService.showInfoMessage(response);         
         // productService.updateCartStorage();
         // refreshProducts();
         updateProductsCount();
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
     
   // document.getElementById('cartTable').innerHTML = product.list;
   // refreshProducts();
}

function updateProductsCount() {
   let count = productService.getProductCount();
   // document.getElementById('listCountId').innerHTML = count.productsCount;
   document.getElementById('cartCountId').innerHTML = count.cartCount;
   document.getElementById('favCountId').innerHTML = count.favoritesCount;
}

function updateCartCount() {
   let count = productService.getProductCount();
   document.getElementById('cartCountId').innerHTML = count.cartCount;
}

function updateFavoriteCount() {
   let count = productService.getProductCount();
   document.getElementById('favCountId').innerHTML = count.favoritesCount;
}

function refreshProducts() {
   showCart();
   showFavorites();
   updateProductsCount();
}

function showCart() {
   let cart = productService.getFormatedCart();
   document.getElementById('cartTable').innerHTML = cart;
   // showCountInfo();
}

function showFavorites() {
   let favorites = productService.getFormatedFavorites();
   document.getElementById('favTable').innerHTML = favorites;
   // showCountInfo();
}

function removeFromCart() { //variata gresita
   let response = productService.removeProductFromCart();
   // document.getElementById('cartTable').innerHTML = product.list;
   commonService.showInfoMessage(response);
   refreshProducts();
}

function removeFromCart2(id) {
   let promise = httpService.getProductbyId(id);
   promise
      .then(product => {
         let response = productService.removeProductFromCartAnotherMethod(product,id);
         commonService.showInfoMessage(response);
         showCart();
         updateCartCount();
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
}

function removeFromFavorites() { //varianta gresita
   let response = productService.removeProductFromFavorites();
   commonService.showInfoMessage(response);
   refreshProducts();
}

function removeFromFavorites2(id) {
   let promise = httpService.getProductbyId(id);
   promise
      .then(product => {
         let response = productService.removeFromFavoritesAnotherMethod(product,id);
         commonService.showInfoMessage(response);
         showFavorites();
         updateFavoriteCount();
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
}

function addRating(id, rating){
   httpService.addRating(id, rating);
   // showProduct();
}

function addReview(){
   let productId = commonService.getFromStorage('productId');

   let title = $("#titleId").val();
   let description = $("#descriptionId").val();

   httpService.addReview(title, description, productId);
}

function addProduct(){
   let name = $('#nameId').val();
   let description = $('#descriptionId').val();
   let price = $('#priceId').val();
   let discountPrice = $('#discountedPriceId').val();
   let productUrl = $('#productUrlId').val();

   httpService.addProduct(name, description, price, discountPrice, productUrl);
}

function searchForProducts(){
   let query = $('#searchId').val();
   let promise = httpService.getProducts();
   promise
   .then(products => {
      let response = productService.showProductsByName(query, products);
      let text = `You have found ${response.count} products`;
      document.getElementById('productsListId').innerHTML = response.list;
      document.getElementById('textModificat').innerHTML = text;
   })
   .catch(error => {
      commonService.showInfoMessage(error);
   });
}

function searchForProductsPrice(){
   let min = $('#searchId2').val();
   let max = $('#searchId3').val();

   httpService.getProducts()
   .then(products => {
      let response = productService.showProductsWithPriceRange(products,
         product =>
         product.discountPrice >= Number(min ? min : 0) &&
         product.discountPrice <= Number(max ? max : 9999));
      let text = `You have found ${response.count} products`;
      document.getElementById('productsListId').innerHTML = response.list;
      document.getElementById('textModificat').innerHTML = text;
   })
   .catch(error => {
      commonService.showInfoMessage(error);
   });  
}

function modifyQuantityOfPlus(id) {
   let count = productService.increasePlus(id);
   commonService.showInfoMessage(count);
   showCart();
   updateCartCount();
}

function modifyQuantityOfMinus(id) {
   let count = productService.decreaseMinus(id);
   commonService.showInfoMessage(count);
   showCart();
   updateCartCount();
}

function applyPromoCode(){
   let code = document.getElementById('promoCode').value;
   let voucher = '#1213';  
   let cart = localStorage.getItem("cartProducts");
   if(cart.length >= 3){
      if (code == voucher) {           
         applyOnce();
         showCart();
         updateCartCount();     
      }else {
         commonService.showInfoMessage('Promo Code entered not valid. Try again!');
      }

   }else{
         commonService.showInfoMessage('The cart is empty. Buy something first!');
   } 
} 

function usePromoCode() {
      let percent = parseInt(10);
      let response = productService.promoCodeDiscount(percent);
      commonService.showInfoMessage(response);
}

var applyOnce = (function () {
   var promoCode = false;
   return function () {
      if (!promoCode) {
         promoCode = true;
         usePromoCode();
      }
   };
})();

function resetCart() {
   let basket = productService.removeAllProductsFromCart();
   commonService.showInfoMessage(basket);
   showCart();
   updateCartCount()
}

function resetFavorites() {
   let response = productService.removeAllProductsFromFavorites();
   commonService.showInfoMessage(response);
   showFavorites();
   updateFavoriteCount();
}

function removeUser() { // -- here  ??
   let userName = document.getElementById('email').value;
   let response = userService.removeUser(userName);
   commonService.showInfoMessage(response);
   setTimeout(logOut, 5000);
}

function changePassword() { // -- here
   let userName = document.getElementById('userName').value;
   let newPassword = document.getElementById('passwordIdNew').value;

   let response = userService.changePassword(userName, newPassword);
   commonService.showInfoMessage(response);

   showProfile();
}











