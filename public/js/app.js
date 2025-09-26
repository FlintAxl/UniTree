// =====================
// Navigation Management
// =====================
function initializeNavigation() {
  const token = sessionStorage.getItem('access_token');
  const userId = sessionStorage.getItem('userId');
  const joinNowBtn = document.getElementById('joinNowBtn');
  const joinDropdown = document.getElementById('joinDropdown');

  if (!joinNowBtn || !joinDropdown) return;

  if (userId && token) {
    // User is logged in - show profile dropdown
    const userName = sessionStorage.getItem('user_name') || 'User';
    const userEmail = sessionStorage.getItem('user_email') || '';
    const userInitial = userName.charAt(0).toUpperCase();

    // SHOW ONLY THE INITIAL CIRCLE (NO USERNAME TEXT)
    joinNowBtn.innerHTML = `
      <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #4ade80, #22c55e); 
                  display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
        ${userInitial}
      </div>
    `;

    joinDropdown.innerHTML = `
      <div class="dropdown-header">
        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #4ade80, #22c55e); 
                      display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${userInitial}
          </div>
          <div>
            <div style="font-weight: bold;">${userName}</div>
            <div style="font-size: 0.8rem; color: #666;">${userEmail}</div>
          </div>
        </div>
      </div>
      <a href="profile.html">Profile Information</a>
      <a href="security.html">Security & Password</a>
      <a href="#" id="logoutBtnNav">Logout</a>
    `;

    // Attach logout handler AFTER HTML injection
    const logoutBtn = document.getElementById('logoutBtnNav');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }

  } else {
    // Not logged in -> show Join Now menu
    showJoinNowDropdown();
  }
}

// Reset nav to default state (Join Now + Login/Register links)
function showJoinNowDropdown() {
  const joinNowBtn = document.getElementById('joinNowBtn');
  const joinDropdown = document.getElementById('joinDropdown');
  if (!joinNowBtn || !joinDropdown) return;

  joinNowBtn.innerHTML = 'Join Now';
  joinDropdown.innerHTML = `
    <a href="login.html">Log In</a>
    <a href="register.html">Register</a>
  `;
}

// =====================
// Logout Handler
// =====================
function handleLogout(e) {
  e.preventDefault();

  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('access_token');

  if (!userId || !token) {
    Swal.fire('Notice', 'You are not logged in.', 'info');
    return;
  }

  // Ask for confirmation before logging out
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4ade80',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout!',
    cancelButtonText: 'No, stay logged in'
  }).then((result) => {
    if (result.isConfirmed) {
      // User clicked "Yes" - proceed with logout
      $.ajax({
        method: 'POST',
        url: '/api/v1/logout',
        contentType: 'application/json',
        headers: { 'Authorization': `Bearer ${token}` },
        data: JSON.stringify({ id: parseInt(userId, 10) }),
        success: function () {
          // Clear session storage
          sessionStorage.clear();
          showJoinNowDropdown();

          Swal.fire({
            icon: 'success',
            title: 'Logged out!',
            text: 'You have been logged out successfully.',
            showConfirmButton: true
          }).then(() => {
            window.location.href = 'index.html';
          });
        },
        error: function (xhr) {
          console.error('Logout error:', xhr.responseText);
          // Still clear session even if backend logout fails
          sessionStorage.clear();
          showJoinNowDropdown();

          Swal.fire({
            icon: 'success',
            title: 'Logged out!',
            text: 'You have been logged out successfully.',
            showConfirmButton: true
          }).then(() => {
            window.location.href = 'index.html';
          });
        }
      });
    } else {
      // User cancelled logout
      console.log('Logout cancelled by user');
    }
  });
}


// =====================
// Existing functionality
// =====================
async function fetchProducts() {
    const res = await fetch("/api/v1/products");
    return await res.json();
}

// // async function fetchSellers() {
// //     const res = await fetch("/api/user");
// //     return await res.json();
// // }

// async function fetchCategories() {
//     const res = await fetch("/api/categories");
//     return await res.json();
// }

// Check login status for UI elements
const isLoggedIn = sessionStorage.getItem('access_token') !== null;

// ----------------------------
// Render Products (NFTs)
// ----------------------------
const nftContainer = document.getElementById("popularCards");

function renderProducts() {
    fetchProducts().then(products => {
        console.log("Products fetched:", products);
        nftContainer.innerHTML = "";

        products.forEach(product => {
            nftContainer.innerHTML += `
                <div class="product-card">
                    <div class="product-card-image">
                        <img src="${product.image}" alt="${product.title}" />
                    </div>
                    <div class="product-card-content">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-subtitle">${product.description}</p>
                        <div class="product-stats">
                            <span class="product-price-small">$${Number(product.price).toFixed(2)}</span>
                            <span class="product-rating">⭐ ${product.rating || 4.5}</span>
                        </div>
                        ${isLoggedIn ? `
                            <div class="product-actions" style="margin-top:10px;">
                                <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
                                <button class="btn btn-outline" onclick="viewDetails('${product.id}')">Details</button>
                            </div>` : ''}
                    </div>
                </div>
            `;
        });
    });
}

// ----------------------------
// Render Sellers
// ----------------------------
const sellerContainer = document.getElementById("sellerCards");

function renderSellers() {
    fetchSellers().then(sellers => {
        console.log("Sellers fetched:", sellers);
        sellerContainer.innerHTML = "";

        sellers.forEach(seller => {
            sellerContainer.innerHTML += `
                <div class="product-card">
                    <div class="product-card-image">
                        <img src="${seller.avatar}" alt="${seller.username}" />
                    </div>
                    <div class="product-card-content">
                        <h3 class="product-title">${seller.username}</h3>
                        <p class="product-subtitle">${seller.description || "Trusted Seller"}</p>
                        <div class="product-stats">
                            <span class="product-price-small">Products: ${seller.products || 0}</span>
                            <span class="product-rating">⭐ ${seller.rating || 4.7}</span>
                        </div>
                        ${isLoggedIn ? `
                            <div class="product-actions" style="margin-top:10px;">
                                <button class="btn btn-primary" onclick="followSeller('${seller.id}')">Follow</button>
                                <button class="btn btn-outline" onclick="viewSellerDetails('${seller.id}')">Details</button>
                            </div>` : ''}
                    </div>
                </div>
            `;
        });
    });
}

// ----------------------------
// Render Categories
// ----------------------------
const categoryContainer = document.getElementById("categoryCards");

function renderCategories() {
    fetchCategories().then(categories => {
        console.log("Categories fetched:", categories);
        categoryContainer.innerHTML = "";

        categories.forEach(category => {
            categoryContainer.innerHTML += `
                <div class="product-card">
                    <div class="product-card-image">
                        <img src="${category.image}" alt="${category.name}" />
                    </div>
                    <div class="product-card-content">
                        <h3 class="product-title">${category.name}</h3>
                        <p class="product-subtitle">${category.description || "Explore amazing items"}</p>
                        <div class="product-stats">
                            <span class="product-price-small">${category.items || 0} Items</span>
                            <span class="product-rating">🔥 Popular</span>
                        </div>
                        ${isLoggedIn ? `
                            <div class="product-actions" style="margin-top:10px;">
                                <button class="btn btn-primary" onclick="viewCategory('${category.id}')">View Items</button>
                            </div>` : ''}
                    </div>
                </div>
            `;
        });
    });
}

function initHorizontalScroll() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    const scrollAmount = 300;

    document.getElementById('scrollLeft')?.addEventListener('click', () => {
        productGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    document.getElementById('scrollRight')?.addEventListener('click', () => {
        productGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    let isDown = false, startX, scrollLeft;

    productGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - productGrid.offsetLeft;
        scrollLeft = productGrid.scrollLeft;
        productGrid.style.cursor = 'grabbing';
    });

    productGrid.addEventListener('mouseleave', () => {
        isDown = false;
        productGrid.style.cursor = 'grab';
    });

    productGrid.addEventListener('mouseup', () => {
        isDown = false;
        productGrid.style.cursor = 'grab';
    });

    productGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - productGrid.offsetLeft;
        const walk = (x - startX) * 2;
        productGrid.scrollLeft = scrollLeft - walk;
    });
}

// ----------------------------
// Horizontal Scroll for Sellers
// ----------------------------
function initSellersHorizontalScroll() {
    const sellersGrid = document.querySelector('.sellers-grid');
    if (!sellersGrid) return;

    const scrollAmount = 220;

    document.getElementById('sellersScrollLeft')?.addEventListener('click', () => {
        sellersGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    document.getElementById('sellersScrollRight')?.addEventListener('click', () => {
        sellersGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    let isDown = false, startX, scrollLeft;

    sellersGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        sellersGrid.classList.add('active');
        startX = e.pageX - sellersGrid.offsetLeft;
        scrollLeft = sellersGrid.scrollLeft;
        sellersGrid.style.cursor = 'grabbing';
    });

    sellersGrid.addEventListener('mouseleave', () => {
        isDown = false;
        sellersGrid.classList.remove('active');
        sellersGrid.style.cursor = 'grab';
    });

    sellersGrid.addEventListener('mouseup', () => {
        isDown = false;
        sellersGrid.classList.remove('active');
        sellersGrid.style.cursor = 'grab';
    });

    sellersGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - sellersGrid.offsetLeft;
        const walk = (x - startX) * 2;
        sellersGrid.scrollLeft = scrollLeft - walk;
    });

    sellersGrid.style.cursor = 'grab';

    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.sellers-grid')) {
            if (e.key === 'ArrowLeft') {
                sellersGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                sellersGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    });
}

// =====================
// Dropdown functionality
// =====================
function setupDropdown() {
    const joinBtn = document.getElementById('joinNowBtn');
    const dropdown = document.querySelector('.dropdown');
    const joinDropdown = document.getElementById('joinDropdown');

    if (joinBtn && joinDropdown) {
        // Desktop hover behavior
        if (window.innerWidth > 768) {
            dropdown.addEventListener('mouseenter', () => {
                joinDropdown.classList.add('show');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                joinDropdown.classList.remove('show');
            });
        }
        
        // Mobile click behavior
        joinBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                joinDropdown.classList.toggle('show');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                joinDropdown.classList.remove('show');
            }
        });
    }
}

// =====================
// Initialize everything when DOM is loaded
// =====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation first
    initializeNavigation();
    
    // Setup dropdown functionality
    setupDropdown();
    
    // Initialize your existing functionality
    renderProducts();
    renderSellers();
    renderCategories();
    initHorizontalScroll();
    initSellersHorizontalScroll();
    
    console.log('App initialized - User logged in:', isLoggedIn);
});

// Placeholder functions for your existing functionality
function addToCart(productId) {
    console.log('Add to cart:', productId);
}

function viewDetails(productId) {
    console.log('View details:', productId);
}

function followSeller(sellerId) {
    console.log('Follow seller:', sellerId);
}

function viewSellerDetails(sellerId) {
    console.log('View seller details:', sellerId);
}

function viewCategory(categoryId) {
    console.log('View category:', categoryId);
}