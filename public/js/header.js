$(document).ready(function() {
    const userId = sessionStorage.getItem('userId');
    const role = sessionStorage.getItem('role');
    const apiUrl = sessionStorage.getItem('apiUrl') || '';
  
    function updateAuthUI() {
      if (userId) {
        $('#loginNav, #registerNav').hide();
        $('#logoutNav, #profileNav, #ordersNav').show();
  
        //admin header
        if (role === 'admin') {
          $('#adminNav').show();
          $('#cartNav, #ordersNav, .nav-item:has(a[href="index.html"]), .nav-item:has(a[href="products.html"])').hide();
          //seller header
          } else if (role === 'seller') {
              $('#mainNavbar').hide();
              $('#sellerHeader').removeClass('d-none');
          //customer header
          } else {
              $('#adminNav').hide();
              $('#mainNavbar').show();
              $('#sellerHeader').addClass('d-none');
          }
          //unauthorized user header
      } else {
        $('#loginNav, #registerNav').show();
        $('#logoutNav, #profileNav, #ordersNav, #adminNav').hide();
      }
  
    }
  
    //logout
    function logoutUser() {
      const storedUserId = sessionStorage.getItem('userId');
      if (!storedUserId) return clearUserSession();
  
      $.ajax({
        method: "POST",
        url: `${apiUrl}api/v1/logout`,
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        data: JSON.stringify({ id: JSON.parse(storedUserId) }),
        processData: false,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function() { clearUserSession("Logged out successfully"); },
        error: function() { clearUserSession(); }
      });
    }
  
    function clearUserSession(msg) {
      sessionStorage.clear();
      localStorage.removeItem('cart');
      if (msg) {
        Swal.fire({
          icon: 'success', text: msg, timer: 1000, showConfirmButton: false, timerProgressBar: true
        }).then(() => window.location.href = 'index.html');
      } else {
        window.location.href = 'index.html';
      }
    }
  
    //logout confirmation
    $('#logoutBtn, #logoutBtnSeller').on('click', function(e) {
      e.preventDefault();
      Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of your account.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#0f2027',
        cancelButtonColor: '#e74c3c'
      }).then((result) => { if (result.isConfirmed) logoutUser(); });
    });
  
    updateAuthUI();
  });