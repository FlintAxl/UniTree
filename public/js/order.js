const userId = sessionStorage.getItem('userId');


//my orders page
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

  $('#customerOrdersTable').DataTable({
  ajax: {
    url: `${url}api/v1/my-orders/${userId}`,
    dataSrc: 'data'
  },
  columns: [
    { data: 'order_id' }, // ✅ matches SELECT o.order_id
    { data: 'items' },    // ✅ matches GROUP_CONCAT alias "items"
    {
      data: 'total_price', // ✅ matches SUM(...) alias "total_price"
      render: function (data) {
        return '₱' + parseFloat(data).toFixed(2);
      }
    },
    { data: 'status' },   // ✅ matches o.status
    {
      data: 'date_placed', // ✅ matches o.date_placed
      render: function (data) {
        return new Date(data).toLocaleString();
      }
    },
    {
      data: null,
      render: function (data) {
        if (data.status === 'pending') {
          return `<button class="btn btn-sm btn-danger" onclick="cancelOrder(${data.order_id})">Cancel</button>`;
        } else if (data.status === 'shipped') {
          return `<button class="btn btn-sm btn-success" onclick="markAsReceived(${data.order_id})">Mark as Received</button>`;
        } else if (data.status === 'received') {
          return `<button class="btn btn-sm btn-primary" onclick="openReviewModal(${data.order_id})">Leave a Review</button>`;
        }
        return '<span class="text-muted">No actions</span>';
      }
    }
  ]
});
});

function cancelOrder(orderId) {
  Swal.fire({
    title: 'Cancel this order?',
    text: "This action cannot be undone.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it'
  }).then(result => {
    if (result.isConfirmed) {
      $.ajax({
        method: 'PATCH',
        url: `${url}api/v1/cancel-order`,
        contentType: 'application/json',
        data: JSON.stringify({ order_id: orderId }),
        success: function () {
          Swal.fire('Cancelled', 'Your order was cancelled', 'success');
          $('#customerOrdersTable').DataTable().ajax.reload();
        },
        error: function () {
          Swal.fire('Error', 'Failed to cancel order', 'error');
        }
      });
    }
  });
}

function markAsReceived(orderId) {
  Swal.fire({
    title: 'Confirm Receipt?',
    text: "Mark this order as received?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, I received it'
  }).then(result => {
    if (result.isConfirmed) {
      $.ajax({
        method: 'PATCH',
        url: `${url}api/v1/orders/update-status`,
        contentType: 'application/json',
        data: JSON.stringify({ order_id: orderId, status: 'received' }),
        success: function () {
          Swal.fire('Thank you!', 'Order marked as received', 'success');
          $('#customerOrdersTable').DataTable().ajax.reload();
        },
        error: function () {
          Swal.fire('Error', 'Failed to update order status', 'error');
        }
      });
    }
  });
}