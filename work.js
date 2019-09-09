import { products } from "./data.js";
let clickedMeal = "";
let mealsStorage = [];
let mealId = 0;
let productNames = products.map(prod => prod.navn);
let counter1 = 0;
let counter2 = 1000;
let totalKcal = 0;

class Meal {
  constructor(name) {
    this.name = name;
    this.food = [];
    this.calories = 0;
  }
}

class UI {
  static addMealstoMenu(meal) {
    const menu = document.getElementById("mealMenu");
    const menuItem = document.createElement("li");

    menuItem.innerHTML = `
        <li class="nav-item" >
        <b><a class="nav-link" href="#" style="color: white">${meal.name}</a></b>
        </li>`;

    menu.appendChild(menuItem);
  }

  static addMsgtoMainDiv(msg) {
    const mainDiv = document.getElementById("mainDiv");
    const msgTag = document.createElement("h4");

    msgTag.innerHTML = `
        <h4 style="margin-top: 5%">${msg}</h4>`;

    mainDiv.appendChild(msgTag);
  }

  static addProductsDetailsToCards(productDetails, count) {
    let cardDiv = document.getElementById("productsCards");
    const card = document.createElement("div");

    card.innerHTML =
      `
    <div id="accordion">
  <div class="card">
    <div class="card-header" id="headingOne` +
      count +
      `">
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne` +
      count +
      `" aria-expanded="true" aria-controls="collapseOne` +
      count +
      `">
        ${productDetails[0]["navn"]}
        </button>
      </h5>
    </div>

    <div id="collapseOne` +
      count +
      `" class="collapse show" aria-labelledby="headingOne` +
      count +
      `" data-parent="#accordion">
      <div class="card-body">
      <table class="table">
      <thead>
        <th scope="col">Info</th>
        <th scope="col">Amount / Details</th>
      </thead>
      <tbody>
      <tr>
        <td>Producer</td>
        <td>${productDetails[0]["produsent"]}</td>
      </tr>
      <tr>
      <td>Calories</td>
      <td>${productDetails[0]["kcal"]}</td>
    </tr>      
      <tr>
    <td>Proteins</td>
    <td>${productDetails[0]["protein"]}</td>
    </tr>
   <tr>
    <td>Fat</td>
    <td>${productDetails[0]["fett"]}</td>
   </tr>
    <tr>
    <td>Salt</td>
   <td>${productDetails[0]["salt"]}</td>
    </tr>
    </tbody>
    </table>
      </div>
    </div>
  </div>
</div>`;

    cardDiv.appendChild(card);
  }

  static emptyProductsPage() {
    let emptyPage = document.getElementById("productsCards");
    emptyPage.innerHTML = "";
  }

  static loadProducts(clickedMeal) {
    let foundMeal = mealsStorage.find(obj => obj.name === clickedMeal);
    foundMeal["food"].forEach(product => {
      UI.addProductsDetailsToCards(product, counter2);
      counter2++;
    });
  }

  static addCalories(mealName) {
    let foundMeal = mealsStorage.find(obj => obj.name === mealName);
    let calsDiv = document.getElementById("cals");
    calsDiv.innerHTML = "";
    const cals = document.createElement("h5");

    cals.innerHTML = `<h5>Total Calories: ${foundMeal["calories"]}</h5>`;
    calsDiv.appendChild(cals);
  }

  static showAddProducts() {
    document.getElementById("mainDiv").style.visibility = "visible";
    document.getElementById("cals").style.visibility = "visible";
    document.getElementById("start").style.visibility = "hidden";
  }
}

class Storage {
  static addMealstoStorage(meal) {
    mealsStorage.push(meal);
  }

  static addProductstoMeal(mealName, productName) {
    let foundMeal = mealsStorage.find(obj => obj.name === mealName);
    foundMeal["food"].push(productName);
    let currentCalories = foundMeal["calories"];
    currentCalories += parseInt(productName[0]["kcal"]);
    foundMeal["calories"] = currentCalories;
  }

  static isEmptyMeal(mealName) {
    let foundMeal = mealsStorage.find(obj => obj.name === mealName);
    if (foundMeal["food"].length === 0) {
      return true;
    }
    return false;
  }

  static findProductDetails(productName) {
    return products.filter(prod => prod.navn === productName);
  }
}

//Add a meal
document.getElementById("mealForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("mealName").value;

  if (name === "") {
    window.alert("empty box not allowed");
  } else {
    const meal = new Meal(name);
    Storage.addMealstoStorage(meal);
    UI.addMealstoMenu(meal);
    document.getElementById("mealName").value = "";
  }
});

//Selecting meal
document.getElementById("mealMenu").addEventListener("click", e => {
  e.preventDefault();
  clickedMeal = e.target.innerHTML;
  UI.emptyProductsPage();
  UI.showAddProducts();
  UI.addCalories(clickedMeal);
  if (!Storage.isEmptyMeal(clickedMeal)) {
    UI.loadProducts(clickedMeal);
    UI.addCalories(clickedMeal);
    counter2++;
  }
});

//add products
document.getElementById("productForm").addEventListener("submit", e => {
  e.preventDefault();
  const addedProductName = document.getElementById("productInput").value;
  if(addedProductName!='' && productNames.indexOf(addedProductName)!=-1){
  const addedProductDetails = Storage.findProductDetails(addedProductName);
  UI.addProductsDetailsToCards(addedProductDetails, counter1);
  Storage.addProductstoMeal(clickedMeal, addedProductDetails);
  UI.addCalories(clickedMeal);
  counter1++;
  document.getElementById("productInput").value = "";
  } else {
    alert('Please add products according to suggestion list')
  }
});

//autocomplete
var input = document.getElementById("productInput");
var awesomplete = new Awesomplete(input, {
  minChars: 1,
  autoFirst: true,
  maxItems: 10
});
awesomplete.list = productNames;
