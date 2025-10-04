

$(document).ready(function () {

    const token = sessionStorage.getItem('access_token');

    const table = $('#itable').DataTable({
        ajax: {
            url: `${url}api/v1/products`,
            dataSrc: "data",
            headers: { "Authorization": `Bearer ${token}` }
        },
        dom: 'Bfrtip',
        buttons: [
            'pdf', 'excel',
            {
                text: 'Add product',
                className: 'btn btn-primary',
                action: function () {
                    $('#createProductForm')[0].reset();
                    $('#createProductModal').modal('show'); // ✅ use correct modal
                }
            }
        ],
        columns: [
            { data: 'product_id' },
            {
                data: 'images',
                render: function (images) {
                    if (!images || images.length === 0) return 'No image';
                    return images.map(img => `<img src="${url}${img}" width="50" height="50">`).join('');
                }
            },
            { data: 'name' },
            { data: 'category_name', defaultContent: 'No Category' },
            { data: 'description' },
            { data: 'price' },
            { data: 'stock' },
            {
                data: null,
                render: function (data) {
                    return `
                        <button class="btn btn-sm btn-info editProductBtn" data-id="${data.product_id}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteProductBtn" data-id="${data.product_id}">Delete</button>
                    `;
                }
            }
        ],
    });

    // ================= CREATE PRODUCT =================
    $("#productSubmit").on('click', function (e) {
        e.preventDefault();

        let form = $('#createProductForm')[0]; // ✅ correct form
        let formData = new FormData(form);

        $.ajax({
            method: "POST",
           url: `${url}api/v1/products/admin`,
            data: formData,
            contentType: false,
            processData: false,
            headers: { Authorization: `Bearer ${token}` },
            success: function () {
                Swal.fire({ icon: "success", text: "Product created successfully!" });
                $("#createProductModal").modal("hide"); // ✅ close correct modal
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
                Swal.fire({ icon: "error", text: error.responseJSON?.error || "Failed to save product." });
            }
        });
    });

   // ================= EDIT PRODUCT (open modal) =================
$(document).on('click', '.editProductBtn', function () {
    const id = $(this).data('id');

    $.ajax({
        method: "GET",
       url: `${url}api/v1/products/admin/${id}`,
        dataType: "json",
        headers: { Authorization: `Bearer ${token}` },   // ✅ Add token here
        success: function (data) {
            const product = data.result ? data.result[0] : data.product;

            $('#u_productId').val(product.product_id);
            $('#u_name').val(product.name);
            $('#u_description').val(product.description);
            $('#u_price').val(product.price);
            $('#u_stock').val(product.stock);
            $('#u_category_id').val(product.category_id);

            $('#updateProductModal').modal('show');
        },
        error: function (xhr) {
            console.error("❌ Error fetching product:", xhr.responseText);
            Swal.fire({ icon: "error", text: "Failed to fetch product details." });
        }
    });
});


    // ================= UPDATE PRODUCT =================
    $("#productUpdate").on('click', function (e) {
        e.preventDefault();
        const id = $('#u_productId').val();
        let form = $('#updateProductForm')[0]; // ✅ correct form
        let formData = new FormData(form);

       $.ajax({
    method: "PUT",
    url: `${url}api/v1/products/admin/${id}`,   // ✅ match route
    data: formData,
    contentType: false,
    processData: false,
    headers: { Authorization: `Bearer ${token}` },
    success: function () {
        Swal.fire({ icon: "success", text: "Product updated successfully!" });
        $('#updateProductModal').modal("hide");
        table.ajax.reload();
    },
    error: function (xhr) {
        console.error("❌ Error updating product:", xhr.responseText); // ✅ add log
        Swal.fire({ icon: "error", text: "Failed to update product." });
    }
});

    });

    // ================= DELETE PRODUCT =================
    $(document).on('click', '.deleteProductBtn', function () {
        const id = $(this).data('id');
        $('#deleteProductId').val(id);
        $('#deleteProductModal').modal('show'); // ✅ open delete modal
    });

    $("#confirmDeleteProduct").on('click', function () {
        const id = $('#deleteProductId').val();

        $.ajax({
            method: "DELETE",
             url: `${url}api/v1/products/admin/${id}`,   // ✅ match route
            headers: { Authorization: `Bearer ${token}` },
            success: function () {
                Swal.fire({ icon: "success", text: "Product deleted successfully!" });
                $('#deleteProductModal').modal("hide"); // ✅ close modal
                table.ajax.reload();
            },
            error: function () {
                Swal.fire({ icon: "error", text: "Failed to delete product." });
            }
        });
    });
});

function loadCategories(callback = null) {
    $.ajax({
        url: `${url}api/v1/categories`,
        method: 'GET',
        success: function (response) {
            let options = response.categories.map(c =>
                `<option value="${c.category_id}">${c.name}</option>`
            ).join('');
            $("#c_category_id").html(options);
            $("#u_category_id").html(options);

            if (typeof callback === 'function') callback();
        },
        error: function (xhr, status, error) {
            console.error("Failed to load categories:", error);
        }
    });
}

$(document).ready(function() {
   loadCategories();
});