$(document).ready(function () {
    const token = sessionStorage.getItem('access_token');
    const userId = sessionStorage.getItem('userId');
    
    if (!token || !userId) {
        Swal.fire({
            icon: 'warning',
            text: 'You must be logged in to access this page.',
            showConfirmButton: true
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // Fetch total coins only
    $.ajax({
        url: `${url}api/v1/my-rewards/${userId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            if (response && response.data && response.data.total_coins !== undefined) {
                $('#totalCoins').text(response.data.total_coins);
            } else {
                $('#totalCoins').text('0');
            }
        },
        error: function () {
            Swal.fire('Error', 'Failed to load rewards. Please try again.', 'error');
            $('#totalCoins').text('0');
        }
    });

// ✅ NEW: Fetch and display user's pet
  $.ajax({
    url: `${url}api/v1/pets/user/${userId}`,
    method: 'GET',
    success: function (response) {
      if (response.success && response.pet) {
        const pet = response.pet;
        const levelImages = {
          1: pet.level1_image,
          2: pet.level2_image,
          3: pet.level3_image
        };
        
        const currentImage = levelImages[pet.level] || pet.level1_image || 'default-pet.png'; // Fallback image if needed
        const petHtml = `
  <div class="col-md-12">
    <div class="card pet-card text-center">
      <div class="card-body">
        <img src="/images/${currentImage}" alt="${pet.pet_name}" 
             class="pet-image img-fluid rounded-circle" 
             style="width: 150px; height: 150px; object-fit: cover;">
        <h3>${pet.pet_name}</h3>
        <p><i class="fa-solid fa-paw"></i> Level: ${pet.level}</p>

        <!-- XP progress bar -->
        <div class="pet-progress">
          <div class="pet-progress-bar" id="xpBar" style="width: ${pet.xp_progress || 0}%;"></div>
        </div>

        <p class="text-muted">Last Fed: ${pet.last_fed ? new Date(pet.last_fed).toLocaleString() : 'Never'}</p>
        <p>Use your earned coins to level up and care for ${pet.pet_name}!</p>

        <button class="pet-action-btn mt-2"><i class="fa-solid fa-bone"></i> Feed ${pet.pet_name}</button>
      </div>
    </div>
  </div>
`;
        $('#petSection').html(petHtml);
      } else {
        // No pet: Show message with link to create
        const noPetHtml = `
          <div class="col-md-12">
            <div class="alert alert-info text-center">
              <i class="fa-solid fa-heart fa-2x mb-3"></i>
              <h4>No Pet Yet?</h4>
              <p>You haven't created a pet. Choose one to start earning rewards and caring for it!</p>
              <a href="choose.html" class="btn btn-primary">Create My Pet</a> <!-- Link to your pet choice page -->
            </div>
          </div>
        `;
        $('#petSection').html(noPetHtml);
      }
    },
    error: function () {
      // Fallback: Show error in pet section
      $('#petSection').html(`
        <div class="col-md-12">
          <div class="alert alert-warning text-center">
            <p>Unable to load pet information. <a href="javascript:location.reload()">Refresh</a> to try again.</p>
          </div>
        </div>
      `);
      Swal.fire('Error', 'Failed to load pet details.', 'error');
    }
  });


  // Handle pet action button (e.g., feeding)

  // ================= INVENTORY AND FEED SYSTEM =================
let totalCoins = 0;
let petId = null;
let inventory = { water: 0, fertilizer: 0 };

function loadCoins() {
  $.ajax({
    url: `${url}api/v1/my-rewards/${userId}`,
    headers: { Authorization: `Bearer ${token}` },
    success: (res) => {
      totalCoins = res.data.total_coins || 0;
      $('#totalCoins').text(totalCoins);
    }
  });
}

function loadInventory() {
  $.ajax({
    url: `${url}api/v1/inventory/${userId}`,
    headers: { Authorization: `Bearer ${token}` },
    success: (res) => {
      inventory = res.inventory || { water: 0, fertilizer: 0 };
      $('#waterCount').text(inventory.water);
      $('#fertilizerCount').text(inventory.fertilizer);
    }
  });
}

// Load coins + inventory initially
loadCoins();
loadInventory();

// ✅ BUY WATER
// ...existing code...

$('#buyWaterBtn').click(() => {
  if (totalCoins < 2) return Swal.fire('Oops', 'Insufficient coins!', 'warning');
  $.ajax({
    url: `${url}api/v1/inventory/buy`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      user_id: userId,
      item_type: 'water'
    }),
    success: function(res) {
      Swal.fire('Purchased!', 'You bought 1 Water Bucket!', 'success');
      loadCoins();
      loadInventory();
    },
    error: function(xhr) {
      Swal.fire('Error', xhr.responseJSON?.message || 'Purchase failed', 'error');
    }
  });
});

$('#buyFertilizerBtn').click(() => {
  if (totalCoins < 5) return Swal.fire('Oops', 'Insufficient coins!', 'warning');
  $.ajax({
    url: `${url}api/v1/inventory/buy`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      user_id: userId,
      item_type: 'fertilizer'
    }),
    success: function(res) {
      Swal.fire('Purchased!', 'You bought 1 Fertilizer!', 'success');
      loadCoins();
      loadInventory();
    },
    error: function(xhr) {
      Swal.fire('Error', xhr.responseJSON?.message || 'Purchase failed', 'error');
    }
  });
});

// ...existing code...


// ✅ VIEW INVENTORY
$('#inventoryBtn').click(() => {
  loadInventory();
  $('#inventoryModal').modal('show');
});

// ✅ FEED PET
$(document).on('click', '.pet-action-btn', () => {
  Swal.fire({
    title: 'Choose what to feed',
    showDenyButton: true,
    confirmButtonText: 'Water',
    denyButtonText: 'Fertilizer',
  }).then((result) => {
    if (result.isConfirmed) feedPet('water');
    else if (result.isDenied) feedPet('fertilizer');
  });
});

function feedPet(type) {
  $.post(`${url}api/v1/pets/feed`, { user_id: userId, item_type: type }, (res) => {
    Swal.fire('Yum!', `Your pet gained XP!`, 'success');
    loadInventory();
    // Reload pet to show updated XP
    setTimeout(() => location.reload(), 800);
  }).fail((xhr) => {
    const msg = xhr.responseJSON?.message || 'Feeding failed.';
    Swal.fire('Error', msg, 'error');
  });
}


    
});