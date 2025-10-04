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
      const json = await res.json();
      // Backend returns { data: [...] }
      return Array.isArray(json?.data) ? json.data : [];
  }
  
  // Helper function to get mock seller data
  function getMockSellers() {
      return [
          {
              id: 1,
              name: 'John Doe',
              username: 'johndoe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
              rating: 4.5,
              products_count: 24,
              role: 'seller'
          },
          {
              id: 2,
              name: 'Jane Smith',
              username: 'janesmith',
              avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
              rating: 4.8,
              products_count: 36,
              role: 'seller'
          },
          // Add more mock sellers as needed
      ];
  }
  
  // Fetch sellers from the backend API
  async function fetchSellers() {
      try {
          // First, fetch all products to get unique seller IDs
          const productsRes = await fetch("/api/v1/products");
          const productsData = await productsRes.json();
          const products = Array.isArray(productsData?.data) ? productsData.data : [];
          
          console.log("Products for sellers:", products);
          
          if (products.length === 0) {
              console.warn("No products found");
              return [];
          }
          
          // Get unique seller IDs from products
          const sellerIds = [...new Set(products.map(p => p.seller_id).filter(id => id))];
          console.log("Unique seller IDs found:", sellerIds);
          
          if (sellerIds.length === 0) {
              console.warn("No seller IDs found in products");
              return [];
          }
          
          // Create sellers array from unique seller IDs
          const sellers = sellerIds.map(sellerId => {
              const sellerProducts = products.filter(p => p.seller_id === sellerId);
              const productCount = sellerProducts.length;
              
              // Get seller info from first product (if available in product data)
              const firstProduct = sellerProducts[0];
              const sellerName = firstProduct.seller_name || firstProduct.seller_username || `Seller ${sellerId}`;
              
              return {
                  id: sellerId,
                  name: sellerName,
                  username: sellerName.toLowerCase().replace(/\\s+/g, ''),
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=16a34a&color=fff&size=200&bold=true`,
                  rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0-5.0
                  products_count: productCount,
                  role: 'seller'
              };
          });
          
          console.log("Sellers created:", sellers);
          return sellers;
          
      } catch (error) {
          console.error("Error fetching sellers:", error);
          return [];
      }
  }
  
  async function fetchCategories() {
      try {
          const res = await fetch("/api/v1/categories");
          const json = await res.json();
          return Array.isArray(json?.categories) ? json.categories : [];
      } catch (_) {
          return [];
      }
  }
  
  // Check login status for UI elements
  const isLoggedIn = sessionStorage.getItem('access_token') !== null;
  
  // ----------------------------
  // Render Products (NFTs)
  // ----------------------------
  const nftContainer = document.getElementById("popularCards");
  const allProductsContainer = document.getElementById("allProducts");
  
  function renderProducts() {
      fetchProducts().then(products => {
          console.log("Products fetched:", products);
          nftContainer.innerHTML = "";
          
          // Render popular products (first 10)
          const popularProducts = products.slice(0, 10);
          renderProductCarousel(popularProducts, nftContainer);
          
          // Render all products
          renderProductCarousel(products, allProductsContainer, 'all-products');
          
          // Initialize carousels
          initCarousel('.product-carousel', '.carousel-prev', '.carousel-next');
          initCarousel('.all-products-carousel', '.all-products-prev', '.all-products-next');
      });
  }
  
  function renderProductCarousel(products, container, type = 'popular') {
      container.innerHTML = "";
      
      products.forEach(product => {
              const firstImage = Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : 'https://via.placeholder.com/300x200?text=No+Image';
              const productId = product.product_id ?? product.id ?? '';
              const title = product.name ?? product.title ?? 'Untitled';
              const price = Number(product.price).toFixed(2);
              const rating = product.rating || (Math.random() * 1 + 4).toFixed(1); // Random rating between 4.0 and 5.0
              
              const productCard = document.createElement('div');
              productCard.className = 'product-card';
              productCard.style.flex = '0 0 280px';
              productCard.style.scrollSnapAlign = 'start';
              productCard.style.background = '#fff';
              productCard.style.borderRadius = '12px';
              productCard.style.overflow = 'hidden';
              productCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              productCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
              productCard.style.cursor = 'pointer';
              productCard.style.position = 'relative';
              
              productCard.innerHTML = `
                  <div style="position: relative; padding-bottom: 75%; overflow: hidden;">
                      <img src="${firstImage}" 
                           alt="${title}" 
                           style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;"
                           onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=No+Image'"
                      >
                  </div>
                  <div style="padding: 1.25rem;">
                      <h3 style="margin: 0 0 0.5rem; font-size: 1.1rem; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          ${title}
                      </h3>
                      <div style="display: flex; align-items: center; margin-bottom: 0.75rem;">
                          <span style="font-size: 1.1rem; font-weight: 700; color: #111827;">$${price}</span>
                          <div style="margin-left: auto; display: flex; align-items: center; background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px;">
                              <span style="color: #f59e0b; margin-right: 0.25rem;">★</span>
                              <span style="font-size: 0.875rem; color: #4b5563;">${rating}</span>
                          </div>
                      </div>
                      <div style="display: flex; gap: 0.5rem;">
                          <button class="btn-add-to-cart" 
                                  style="flex: 1; background: #10b981; color: white; border: none; border-radius: 6px; padding: 0.5rem; font-weight: 500; cursor: pointer; transition: background 0.2s ease;"
                                  data-product-id="${productId}"
                                  data-product-name="${title}"
                                  data-product-price="${price}"
                                  data-product-image="${firstImage}">
                              Add to Cart
                          </button>
                          <button class="btn-view-details" 
                                  style="background: none; border: 1px solid #d1d5db; border-radius: 6px; padding: 0.5rem; cursor: pointer; transition: background 0.2s ease;"
                                  onclick="window.location.href='product-details.html?id=${productId}'">
                              <i class="fas fa-arrow-right" style="color: #4b5563;"></i>
                          </button>
                      </div>
                  </div>
              `;
              
              // Add hover effect
              productCard.addEventListener('mouseenter', () => {
                  productCard.style.transform = 'translateY(-5px)';
                  productCard.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                  productCard.querySelector('img').style.transform = 'scale(1.05)';
              });
              
              productCard.addEventListener('mouseleave', () => {
                  productCard.style.transform = 'translateY(0)';
                  productCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  productCard.querySelector('img').style.transform = 'scale(1)';
              });
              
              container.appendChild(productCard);
          });
  }
  
  function initCarousel(carouselSelector, prevBtnSelector, nextBtnSelector) {
      const carousel = document.querySelector(carouselSelector);
      const prevBtn = document.querySelector(prevBtnSelector);
      const nextBtn = document.querySelector(nextBtnSelector);
      const itemWidth = 280; // Width of each card (250px) + gap (30px)
      
      if (!carousel || !prevBtn || !nextBtn) return;
      
      // Hide scrollbar
      carousel.style.scrollbarWidth = 'none';
      carousel.style.msOverflowStyle = 'none';
      
      // Navigation handlers
      nextBtn.addEventListener('click', () => {
          carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
      });
      
      prevBtn.addEventListener('click', () => {
          carousel.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      });
      
      // Show/hide navigation buttons based on scroll position
      const updateNavButtons = () => {
          const maxScroll = carousel.scrollWidth - carousel.clientWidth;
          prevBtn.style.opacity = carousel.scrollLeft > 10 ? '1' : '0.5';
          nextBtn.style.opacity = carousel.scrollLeft < maxScroll - 10 ? '1' : '0.5';
      };
      
      carousel.addEventListener('scroll', updateNavButtons);
      window.addEventListener('resize', updateNavButtons);
      updateNavButtons();
  }
  
  // ----------------------------
  // Render Sellers
  // ----------------------------
  const sellerContainer = document.getElementById("sellerCards");
  
  function renderSellers() {
      console.log("Fetching sellers...");
      fetchSellers().then(sellers => {
          console.log("Sellers fetched:", sellers);
          sellerContainer.innerHTML = "";
          
          if (!sellers || !sellers.length) {
              console.warn("No sellers found or empty response");
              sellerContainer.innerHTML = `
                  <div style="text-align: center; padding: 2rem; color: #6b7280; width: 100%;">
                      <p>No sellers available at the moment.</p>
                      <p>Check the console for more details.</p>
                  </div>
              `;
              return;
          }
  
          sellers.forEach((seller, index) => {
              console.log(`Processing seller ${index + 1}:`, seller);
              const sellerCard = document.createElement('div');
              sellerCard.className = 'seller-card';
              sellerCard.style.flex = '0 0 200px';
              sellerCard.style.scrollSnapAlign = 'start';
              sellerCard.style.background = '#fff';
              sellerCard.style.borderRadius = '12px';
              sellerCard.style.overflow = 'hidden';
              sellerCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              sellerCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
              sellerCard.style.cursor = 'pointer';
              sellerCard.style.position = 'relative';
              sellerCard.style.textAlign = 'center';
              sellerCard.style.padding = '1.5rem 1rem';
              
              const sellerImage = seller.avatar || 'https://via.placeholder.com/100x100?text=Seller';
              const sellerName = seller.name || seller.username || 'Seller';
              const sellerRating = seller.rating || (Math.random() * 1 + 4).toFixed(1);
              const productsCount = seller.products_count || Math.floor(Math.random() * 50) + 10;
              
              sellerCard.innerHTML = `
                  <div style="width: 100px; height: 100px; margin: 0 auto 1rem; border-radius: 50%; overflow: hidden; border: 3px solid #f3f4f6;">
                      <img src="${sellerImage}" 
                           alt="${sellerName}" 
                           style="width: 100%; height: 100%; object-fit: cover;"
                           onerror="this.onerror=null; this.src='https://via.placeholder.com/100?text=${sellerName.charAt(0)}'"
                      >
                  </div>
                  <h3 style="margin: 0 0 0.5rem; font-size: 1.1rem; font-weight: 600; color: #1f2937;">
                      ${sellerName}
                  </h3>
                  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
                      <span style="color: #f59e0b; margin-right: 0.25rem;">★</span>
                      <span style="font-size: 0.9rem; color: #4b5563;">${sellerRating}</span>
                  </div>
                  <div style="font-size: 0.85rem; color: #6b7280;">
                      ${productsCount} products
                  </div>
                  <button class="btn-view-shop" 
                          style="margin-top: 1rem; background: #f3f4f6; border: none; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.9rem; cursor: pointer; transition: background 0.2s ease;"
                          data-seller-id="${seller.id || ''}">
                      View Shop
                  </button>
              `;
              
              // Add hover effect
              sellerCard.addEventListener('mouseenter', () => {
                  sellerCard.style.transform = 'translateY(-5px)';
                  sellerCard.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
              });
              
              sellerCard.addEventListener('mouseleave', () => {
                  sellerCard.style.transform = 'translateY(0)';
                  sellerCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              });
              
              sellerContainer.appendChild(sellerCard);
          });
          
          // Initialize sellers carousel
          initCarousel('.sellers-carousel', '.sellers-prev', '.sellers-next');
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
  
  // ----------------------------
  // Scroll reveal for sections
  // ----------------------------
  function initScrollReveal() {
      const elements = document.querySelectorAll('.scroll-reveal');
      if (elements.length === 0) return;
  
      const reveal = (entry) => {
          if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
          }
      };
  
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(reveal);
      }, { threshold: 0.1 });
  
      elements.forEach(el => observer.observe(el));
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
      initScrollReveal();
      
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
      // Implementation for viewing a category
      console.log('Viewing category:', categoryId);
  }
  
  function showLoginModal() {
      // You can implement a custom modal or redirect to login page
      if (confirm('Please login to add items to your cart. Would you like to login now?')) {
          window.location.href = 'login.html';
      }
  }