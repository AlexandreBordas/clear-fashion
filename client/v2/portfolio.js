// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');

const selectBrand = document.querySelector('#brand-select');
const selectFilter = document.querySelector('#filter-select');
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');

const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');

const p50NbProducts = document.querySelector('#p50NbProducts');
const p90NbProducts = document.querySelector('#p90NbProducts');
const p95NbProducts = document.querySelector('#p95NbProducts');

const renderLatestReleaseDate = document.querySelector('#latestReleasedProduct');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  RenderNbRecentProducts(pagination);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(products);

  PercentileCalculator(pagination, 50, p50NbProducts);
  PercentileCalculator(pagination, 90, p90NbProducts);
  PercentileCalculator(pagination, 95, p95NbProducts);

  RenderLatestRelease(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
<<<<<<< HEAD
selectShow.addEventListener('change', event => {
  fetchProducts(1, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
=======
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
>>>>>>> 0bc96e776e5e0f4aecaa91740a5529f6cdf17953
});

document.addEventListener('DOMContentLoaded', async () => {

  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

//Feature 2 : Filter by brands
selectBrand.addEventListener('click', async(event) => {

  if(event.target.value == "none")
  {
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }

  else
  {
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
    products.result = products.result.filter(product => product.brand == event.target.value);

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
})

const sortBrand = (products, brand) => {
  const sortedProducts = []

  for(var i = 0; i < products.length; i++)
  {
    if(products[i].brand == "brand")
    {
      sortedProducts.push(products[i]);
    }
  }
  renderProducts(sortedProducts);
}

const renderBrands = products =>{
  const brandsNames = [];
  console.log(products);
  products.forEach(product =>{
    if(!brandsNames.includes(product.brand))
    {
      brandsNames.push(product.brand);
    }
  })
  let options = Array.from(brandsNames, brandName => `<option value="${brandName}">${brandName}</option>`);
  options.unshift("<option value='none'>All</option>");
  options.unshift("<option disabled value='null'>SELECT A BRAND</option>");

  options = options.join('');
  selectBrand.innerHTML = options;
}

//Filter Products
selectFilter.addEventListener('change', async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if(event.target.value == "By reasonable price")
  {
    //Feature 4 : Filter by reasonable price
    products.result = products.result.filter(product => product.price <= 50);
  }
  else if(event.target.value == "By recently released")
  {
    //Feature 3 : Filter by recently released
    products.result = products.result.filter(product => CompareRelease(product.released) <= 1.2096e9);
  }
  else if(event.target.value == "By favorite")
  {

  }
  else
  {
    //Aucun changement effectué, aucun filtre sélectionné
  }
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
})

//Feature 3 : Filter by recently released (2 weeks)
function CompareRelease(released)
{
  let today = new Date();
  released = new Date(released);
  return today - released;
}

//Sort Products (Features 4, 5, 6)
selectSort.addEventListener('change', async(event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if(event.target.value == "price-asc")
  {
    products.result = products.result.sort(ComparePrices);
  }
  else if(event.target.value == "price-desc")
  {
    products.result = products.result.sort(ComparePrices).reverse();
  }
  else if(event.target.value == "date-asc")
  {
    products.result = products.result.sort(CompareDates);
  }
  else if(event.target.value == "date-desc")
  {
    products.result = products.result.sort(CompareDates).reverse();
  }
  else
  {
    //Aucun changement effectué, aucun sort sélectionné
  }
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
})

function ComparePrices(a, b)
{
  return a.price - b.price;
}

function CompareDates(a, b)
{
  a = new Date(a.released);
  b = new Date(b.released);

  return a - b;
}

// Feature 8
//Deja effectuée par le professeur

//Feature 9 : Number of recent products indicator
const RenderNbRecentProducts = async (pagination) =>
{
  const response = await fetch(`https://clear-fashion-api.vercel.app?page=1&size=${pagination.count}`);

  const body = await response.json();

  spanNbNewProducts.innerHTML = body.data.result.filter(product => CompareRelease(product.released) <= 1.2096e9).length;
}

//Fonction : calcul des percentiles
const PercentileCalculator = async (pagination, p, spanP) =>
{
  const response = await fetch(`https://clear-fashion-api.vercel.app?page=1&size=${pagination.count}`);

  const body = await response.json();

  body.data.result.sort(ComparePrices);

  let k = Math.floor(p*pagination.count/100);

  spanP.innerHTML = body.data.result[k].price;
}

//Feature 11 : Last released date
const RenderLatestRelease = async (pagination) =>
{
  const response = await fetch(`https://clear-fashion-api.vercel.app?page=1&size=${pagination.count}`);

  const body = await response.json();

  renderLatestReleaseDate.innerHTML = body.data.result.sort(CompareDates)[body.data.result.length-1].released;
}