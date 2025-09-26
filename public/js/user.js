$(document).ready(function () {
  console.log("user.js loaded");

  const token = sessionStorage.getItem('access_token');
  const userId = sessionStorage.getItem('userId');
  const userName = sessionStorage.getItem('user_name');
  const userEmail = sessionStorage.getItem('user_email');

  // =====================
  // Initialize Navigation
  // =====================
  initializeNavigation();

  // =====================
  // Auto toggle Login/Register vs Profile Dropdown
  // =====================
  function initializeNavigation() {
    if (userId && token) {
      // User is logged in - show profile dropdown
      showProfileDropdown();
    } else {
      // User is not logged in - show Join Now dropdown
      showJoinNowDropdown();
    }
  }

  function showProfileDropdown() {
    // Hide login/register links if they exist
    $('#loginLink, #registerLink').hide();
    
    // Get user info
    const name = userName || 'User';
    const email = userEmail || '';
    const userInitial = name.charAt(0).toUpperCase();

    // Update the dropdown button and menu
    $('#joinNowBtn').html(`
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #4ade80, #22c55e); 
                    display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
          ${userInitial}
        </div>
        <span>${name}</span>
      </div>
    `);

    $('#joinDropdown').html(`
      <div class="dropdown-header">
        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #4ade80, #22c55e); 
                      display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${userInitial}
          </div>
          <div>
            <div style="font-weight: bold;">${name}</div>
            <div style="font-size: 0.8rem; color: #666;">${email}</div>
          </div>
        </div>
      </div>
      <a href="profile.html">Profile Information</a>
      <a href="security.html">Security & Password</a>
      <a href="#" id="logoutBtn">Logout</a>
    `);

    // Add logout event listener
    $(document).off('click', '#logoutBtn').on('click', '#logoutBtn', handleLogout);
  }

  function showJoinNowDropdown() {
    // Show default Join Now dropdown
    $('#joinNowBtn').text('Join Now');
    $('#joinDropdown').html(`
      <a href="login.html">Log In</a>
      <a href="register.html">Register</a>
    `);
  }

  // =====================
  // Logout with backend
  // =====================
  function handleLogout(e) {
    e.preventDefault();

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
            
            // Immediately update the navigation to show "Join Now"
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
            
            // Immediately update the navigation to show "Join Now"
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
        // User clicked "No" or closed the dialog - do nothing
        console.log('Logout cancelled by user');
      }
    });
  }

  // =====================
  // Register
  // =====================
  $('#registerBtn').on('click', function () {
    const username = $('#regUsername').val();
    const email = $('#regEmail').val();
    const password = $('#regPassword').val();

    $.ajax({
      method: 'POST',
      url: '/api/v1/register',
      contentType: 'application/json',
      data: JSON.stringify({ username, email, password }),
      success: function (res) {
        const user = res.user;
        if (user && user.user_id) {
          sessionStorage.setItem('userId', user.user_id);
          sessionStorage.setItem('user_name', user.username || user.name || 'User');
          sessionStorage.setItem('user_email', user.email || '');
        }
        Swal.fire('Success', 'Registration successful!', 'success').then(() => {
          window.location.href = 'choose.html';
        });
      },
      error: function (xhr) {
        Swal.fire('Error', xhr.responseJSON?.error || 'Registration failed', 'error');
      }
    });
  });

  // =====================
  // Login
  // =====================
  $('#loginBtn').on('click', function () {
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();

    $.ajax({
      method: 'POST',
      url: '/api/v1/login',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (res) {
        const token = res.token || res.access_token;
        const user = res.user || res.data || res.account;

        if (token && user) {
          sessionStorage.setItem('access_token', token);
          sessionStorage.setItem('userId', user.user_id || user.id);
          sessionStorage.setItem('user_name', user.username || user.name || 'User');
          sessionStorage.setItem('user_email', user.email || '');
          sessionStorage.setItem('role', user.role);

          // Update navigation immediately
          initializeNavigation();

          Swal.fire('Success', 'Login successful!', 'success').then(() => {
            window.location.href = 'index.html';
          });
        } else {
          Swal.fire('Error', 'Invalid login response', 'error');
        }
      },
      error: function (xhr) {
        Swal.fire('Error', xhr.responseJSON?.message || 'Login failed', 'error');
      }
    });
  });

  // =====================
  // Dropdown Toggle for Mobile
  // =====================
  $(document).on('click', '#joinNowBtn', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      $('#joinDropdown').toggleClass('show');
    }
  });

  // Close dropdown when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('#joinNowBtn').length && !$(e.target).closest('#joinDropdown').length) {
      $('#joinDropdown').removeClass('show');
    }
  });
});