import './style.css';
const API_BASE_URL =
  window.SHOPKART_API_URL || 'http://localhost:5000';

const app = document.querySelector('#app');

let products = [];
let cartCount = 0;

/*
==================================================
APPLICATION UI
==================================================
*/

app.innerHTML = `

  <!-- NAVBAR -->
  <header class="navbar">

    <div class="nav-container">

      <div class="logo">
        <span class="logo-icon">S</span>
        <span>ShopKart</span>
      </div>

      <nav class="nav-links">
        <a href="#home">Home</a>
        <a href="#products-section">Products</a>
        <a href="#about">About</a>
      </nav>

      <button class="cart-button" id="cartButton">
        🛒 Cart
        <span id="cartCount">0</span>
      </button>

    </div>

  </header>


  <!-- HERO -->
  <section class="hero" id="home">

    <div class="hero-content">

      <span class="hero-badge">
        ✨ Welcome to ShopKart
      </span>

      <h1>
        Everything you need.
        <span>All in one place.</span>
      </h1>

      <p>
        Discover quality products at great prices.
        Simple shopping, fast delivery and a better experience.
      </p>

      <div class="hero-buttons">

        <a
          href="#products-section"
          class="primary-button"
        >
          Shop Now →
        </a>

        <a
          href="#about"
          class="secondary-button"
        >
          Learn More
        </a>

      </div>

    </div>

    <div class="hero-decoration">

      <div class="floating-card card-one">
        🎧
      </div>

      <div class="floating-card card-two">
        👟
      </div>

      <div class="floating-card card-three">
        ⌨️
      </div>

      <div class="hero-circle">
        🛍️
      </div>

    </div>

  </section>


  <!-- FEATURES -->
  <section class="features">

    <div class="feature">
      <div class="feature-icon">🚚</div>
      <div>
        <h3>Fast Delivery</h3>
        <p>Quick and reliable delivery</p>
      </div>
    </div>

    <div class="feature">
      <div class="feature-icon">🔒</div>
      <div>
        <h3>Secure Shopping</h3>
        <p>Your data is protected</p>
      </div>
    </div>

    <div class="feature">
      <div class="feature-icon">⭐</div>
      <div>
        <h3>Quality Products</h3>
        <p>Products you can trust</p>
      </div>
    </div>

    <div class="feature">
      <div class="feature-icon">💬</div>
      <div>
        <h3>Customer Support</h3>
        <p>We're here to help</p>
      </div>
    </div>

  </section>


  <!-- PRODUCTS -->
  <main class="products-section" id="products-section">

    <div class="section-heading">

      <div>

        <span class="section-label">
          OUR COLLECTION
        </span>

        <h2>
          Featured Products
        </h2>

        <p>
          Explore our hand-picked selection of popular products.
        </p>

      </div>

      <div class="product-count" id="productCount">
        Loading...
      </div>

    </div>


    <div id="status" class="status">
      Connecting to ShopKart...
    </div>


    <div id="products" class="product-grid">

      <div class="loading-card">
        <div class="spinner"></div>
        <p>Loading products...</p>
      </div>

    </div>

  </main>


  <!-- ABOUT -->
  <section class="about" id="about">

    <div class="about-content">

      <span class="section-label">
        ABOUT SHOPKART
      </span>

      <h2>
        Built for a better
        shopping experience.
      </h2>

      <p>
        ShopKart is a modern e-commerce application
        created as a practical full-stack project.
        It combines a responsive frontend, Node.js
        backend and MySQL database.
      </p>

      <div class="tech-stack">

        <span>HTML</span>
        <span>CSS</span>
        <span>JavaScript</span>
        <span>Node.js</span>
        <span>Express</span>
        <span>MySQL</span>

      </div>

    </div>

  </section>


  <!-- FOOTER -->
  <footer>

    <div class="footer-content">

      <div class="footer-logo">
        <span class="logo-icon">S</span>
        ShopKart
      </div>

      <p>
        © 2026 ShopKart. All rights reserved.
      </p>

      <p class="devops-label">
        DevOps Practice Project
      </p>

    </div>

  </footer>


  <!-- CART MODAL -->
  <div id="cartModal" class="modal hidden">

    <div class="modal-content">

      <button
        class="modal-close"
        id="closeCart"
      >
        ×
      </button>

      <div class="modal-icon">
        🛒
      </div>

      <h2>Your Cart</h2>

      <p id="cartMessage">
        Your cart is currently empty.
      </p>

      <button
        class="primary-button modal-button"
        id="continueShopping"
      >
        Continue Shopping
      </button>

    </div>

  </div>

`;


/*
==================================================
LOAD PRODUCTS
==================================================
*/

async function loadProducts() {

  const status = document.querySelector('#status');
  const productsContainer =
    document.querySelector('#products');

  try {

    /*
    ----------------------------------------------
    CHECK BACKEND
    ----------------------------------------------
    */

    const healthResponse =
      await fetch(`${API_BASE_URL}/health`);

    if (!healthResponse.ok) {

      throw new Error(
        'Backend health check failed'
      );

    }


    /*
    ----------------------------------------------
    GET PRODUCTS
    ----------------------------------------------
    */

    const response =
      await fetch(`${API_BASE_URL}/api/products`);

    if (!response.ok) {

      throw new Error(
        'Unable to load products'
      );

    }


    products = await response.json();


    /*
    ----------------------------------------------
    UPDATE STATUS
    ----------------------------------------------
    */

    status.className =
      'status status-success';

    status.innerHTML = `
      <span>●</span>
      ShopKart is online
    `;


    document.querySelector('#productCount')
      .textContent =
      `${products.length} Products`;


    /*
    ----------------------------------------------
    DISPLAY PRODUCTS
    ----------------------------------------------
    */

    renderProducts();

  } catch (error) {

    console.error(error);

    status.className =
      'status status-error';

    status.innerHTML = `
      <span>●</span>
      Unable to connect to backend
    `;

    productsContainer.innerHTML = `

      <div class="error-card">

        <div class="error-icon">
          ⚠️
        </div>

        <h3>
          Backend Connection Failed
        </h3>

        <p>
          Make sure your Node.js backend
          is running on port 5000.
        </p>

        <button
          class="primary-button"
          onclick="location.reload()"
        >
          Try Again
        </button>

      </div>

    `;

  }

}


/*
==================================================
RENDER PRODUCTS
==================================================
*/

function renderProducts() {

  const container =
    document.querySelector('#products');


  if (products.length === 0) {

    container.innerHTML = `

      <div class="error-card">

        <div class="error-icon">
          📦
        </div>

        <h3>
          No products available
        </h3>

        <p>
          Add products to your database
          and refresh the page.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML = products.map(product => {

    const stock = Number(product.stock);
    const price = Number(product.price);


    let stockHTML;

    if (stock === 0) {

      stockHTML = `
        <span class="stock out">
          Out of stock
        </span>
      `;

    } else if (stock <= 10) {

      stockHTML = `
        <span class="stock low">
          Only ${stock} left
        </span>
      `;

    } else {

      stockHTML = `
        <span class="stock available">
          In stock
        </span>
      `;

    }


    return `

      <article class="product-card">

        <div class="image-container">

          <img
            src="${product.image || '/images/product-placeholder.jpg'}"
            alt="${escapeHTML(product.name)}"
            class="product-image"
            loading="lazy"
            onerror="this.src='/images/product-placeholder.jpg'"
          />

          <span class="category-badge">
            ${escapeHTML(product.category)}
          </span>

        </div>


        <div class="product-content">

          <h3>
            ${escapeHTML(product.name)}
          </h3>

          <div class="rating">
            <span>★★★★★</span>
            <small>4.8</small>
          </div>


          <div class="product-bottom">

            <div>

              <div class="price">
                ₹${price.toFixed(2)}
              </div>

              ${stockHTML}

            </div>


            <button
              class="add-button"
              data-product-id="${product.id}"
              ${stock === 0 ? 'disabled' : ''}
            >
              +
            </button>

          </div>

        </div>

      </article>

    `;

  }).join('');


  /*
  ----------------------------------------------
  ADD TO CART EVENTS
  ----------------------------------------------
  */

  document
    .querySelectorAll('.add-button')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const productId =
            Number(button.dataset.productId);

          addToCart(productId);

        }
      );

    });

}


/*
==================================================
ADD TO CART
==================================================
*/

function addToCart(productId) {

  const product =
    products.find(
      item => Number(item.id) === productId
    );

  if (!product) {
    return;
  }


  cartCount++;


  document.querySelector('#cartCount')
    .textContent = cartCount;


  /*
  Button animation
  */

  const button =
    document.querySelector(
      `[data-product-id="${productId}"]`
    );

  if (button) {

    button.textContent = '✓';
    button.classList.add('added');

    setTimeout(() => {

      button.textContent = '+';
      button.classList.remove('added');

    }, 1000);

  }

}


/*
==================================================
CART MODAL
==================================================
*/

const cartModal =
  document.querySelector('#cartModal');

const cartButton =
  document.querySelector('#cartButton');

const closeCart =
  document.querySelector('#closeCart');

const continueShopping =
  document.querySelector('#continueShopping');


cartButton.addEventListener(
  'click',
  () => {

    document.querySelector('#cartMessage')
      .textContent =
      cartCount === 0
        ? 'Your cart is currently empty.'
        : `You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart.`;

    cartModal.classList.remove('hidden');

  }
);


closeCart.addEventListener(
  'click',
  () => {

    cartModal.classList.add('hidden');

  }
);


continueShopping.addEventListener(
  'click',
  () => {

    cartModal.classList.add('hidden');

    document.querySelector(
      '#products-section'
    ).scrollIntoView({
      behavior: 'smooth'
    });

  }
);


cartModal.addEventListener(
  'click',
  event => {

    if (event.target === cartModal) {

      cartModal.classList.add('hidden');

    }

  }
);


/*
==================================================
HTML SECURITY
==================================================
*/

function escapeHTML(value) {

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

}


/*
==================================================
START APPLICATION
==================================================
*/

loadProducts();