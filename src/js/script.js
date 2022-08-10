const listProducts = document.querySelector("#listProducts");
const btnSecoes = document.querySelectorAll(".estiloGeralBotoes--filter");
const inputSearch = document.querySelector(".campoBuscaPorNome");
const btnSearch = document.querySelector("#btn-search");
const cartList = document.querySelector(".cart__list");

function createCard(item) {
  const card = document.createElement("li");
  const img = createImgCard(item);
  const title = createTitleCard(item);
  const section = createSectionCard(item);
  const price = createPriceCard(item);
  const btn = createBtnCard(item);
  const ingredients = createIngredientsCard(item);

  function createImgCard(product) {
    const imgCard = document.createElement("img");
    imgCard.src = product.img;
    imgCard.alt = product.nome;

    return imgCard;
  }

  function createTitleCard(product) {
    const titleCard = document.createElement("h3");
    titleCard.innerText = product.nome;

    return titleCard;
  }

  function createSectionCard(product) {
    const sectionCard = document.createElement("span");
    sectionCard.innerText = product.secao;

    return sectionCard;
  }

  function createPriceCard(product) {
    const priceCard = document.createElement("p");
    const price = +product.preco;
    priceCard.innerText = `R$ ${price.toFixed(2)}`;

    return priceCard;
  }

  function createIngredientsCard(product) {
    const listIngredients = document.createElement("ol");

    product.componentes.forEach((elem) => {
      const ingredients = document.createElement("li");
      ingredients.innerText = elem;
      listIngredients.appendChild(ingredients);
    });
    return listIngredients;
  }

  function createBtnCard(product) {
    const btnCard = document.createElement("button");
    btnCard.innerText = `Comprar`;
    btnCard.setAttribute("id", product.id);

    return btnCard;
  }

  card.append(img, title, section, ingredients, price, btn);

  return card;
}

function listCard(list) {
  listProducts.innerHTML = "";

  list.forEach((item) => {
    const template = createCard(item);
    listProducts.appendChild(template);
  });
}
listCard(produtos);

function filterSections(event) {
  event.preventDefault();
  inputSearch.value = "";
  let clickEvent = event.target;

  const arrayFilter = produtos.filter((item) => {
    let itemCategory = item.secao;

    if (clickEvent.innerText.includes(itemCategory)) {
      return item;
    }
  });
  listCard(arrayFilter);

  if (clickEvent.innerText.includes("Todos Produtos")) {
    listCard(produtos);
  }
}

btnSecoes.forEach((item) => {
  item.addEventListener("click", filterSections);
});

function searchProduct(valueItem) {
  let search = valueItem
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const arrayFilter = produtos.filter((item) => {
    let itemName = item.nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    let itemSection = item.secao
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    let itemCategory = item.categoria
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    if (
      itemName.includes(search) ||
      itemSection.includes(search) ||
      itemCategory.includes(search)
    ) {
      return item;
    }
  });
  return arrayFilter;
}

function filterProductInput(event) {
  event.preventDefault();

  const searchUser = inputSearch.value;
  const result = searchProduct(searchUser);

  listCard(result);
}

btnSearch.addEventListener("click", filterProductInput);

function priceTotal(list) {
  const price = document.querySelector("#price");
  const priceCart = document.querySelector(".info__price span");
  const soma = list.reduce((acc, item) => {
    return acc + +item.preco;
  }, 0);

  price.innerText = `R$ ${soma.toFixed(2)}`;
  priceCart.innerText = `R$ ${soma.toFixed(2)}`;
}

let arrayCart = [];

function addProductsCart(event) {
  let target = event.target;

  if (target.tagName === "BUTTON") {
    const idProduct = target.id;

    const filter = produtos.find((item) => {
      return item.id == idProduct;
    });

    arrayCart.push(filter);
    listProductsCart(arrayCart);
    priceTotal(arrayCart);
    quantityTotal(arrayCart);
  }
}

function quantityTotal(list) {
  const quantity = document.querySelector(".info__quantity span");
  quantity.innerText = list.length;

  return quantity;
}

function listProductsCart(list) {
  cartList.innerHTML = "";

  const cartContent = document.querySelector(".cart__content");
  const cartInfo = document.querySelector(".cart__info");
  cartContent.classList.remove("empty");
  cartInfo.classList.remove("empty");

  list.forEach((item) => {
    const template = createCartTemplate(item);
    cartList.appendChild(template);
  });
}

function createCartTemplate(item) {
  const card = document.createElement("li");
  const img = createImgCart(item);
  const listInfo = document.createElement("div");
  const titleCard = createTitleCart(item);
  const sectionCard = createSectionCart(item);
  const priceCard = createPriceCart(item);
  const btnCard = createBtnCart();

  function createImgCart(product) {
    const imgCard = document.createElement("img");
    imgCard.src = product.img;
    imgCard.alt = product.nome;
    return imgCard;
  }

  function createTitleCart(product) {
    const title = document.createElement("h2");
    title.innerText = product.nome;
    return title;
  }

  function createSectionCart(product) {
    const section = document.createElement("p");
    section.innerText = product.secao;
    return section;
  }

  function createPriceCart(product) {
    const priceCard = document.createElement("span");
    const price = +product.preco;
    priceCard.innerText = `R$ ${price.toFixed(2)}`;
    return priceCard;
  }

  function createBtnCart() {
    const btn = document.createElement("button");
    const imgBtn = document.createElement("img");

    imgBtn.src = "./src/img/trash.svg";
    imgBtn.alt = "Remover produto";

    btn.classList.add("list__btn");
    btn.appendChild(imgBtn);

    return btn;
  }

  listInfo.classList.add("list__info");
  listInfo.append(titleCard, sectionCard, priceCard);
  card.append(img, listInfo, btnCard);

  return card;
}

listProducts.addEventListener("click", addProductsCart);

function removeProductsCard(event) {
  const target = event.target;
  const cartContent = document.querySelector(".cart__content");
  const cartInfo = document.querySelector(".cart__info");

  if (target.tagName === "BUTTON" || target.tagName === "IMG") {
    target.closest(".cart__list li").remove();
    arrayCart.splice(".cart__list li", 1);
  }

  if (cartList.innerHTML === "") {
    cartContent.classList.add("empty");
    cartInfo.classList.add("empty");
  }
  priceTotal(arrayCart);
  quantityTotal(arrayCart);
}

cartList.addEventListener("click", removeProductsCard);
