document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');

    // Fetch and display products
    async function fetchProducts() {
        const response = await fetch('/products');
        const products = await response.json();
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Supplier: ${product.supplier}</p>
                <p>Sales: ${product.sales}</p>
                <p>Price: ${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
                <button onclick="editProduct('${product._id}')">Edit</button>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            `;
            productList.appendChild(productElement);
        });
    }

    // Add or edit product
    productForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(productForm);
        const productData = {};
        formData.forEach((value, key) => {
            productData[key] = value;
        });

        const method = productData.id ? 'PUT' : 'POST';
        const url = productData.id ? `/products/${productData.id}` : '/products';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        productForm.reset();
        fetchProducts();
    });

    // Edit product
    window.editProduct = async function(id) {
        const response = await fetch(`/products/${id}`);
        const product = await response.json();
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('supplier').value = product.supplier;
        document.getElementById('sales').value = product.sales;
        document.getElementById('price').value = product.price;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('image').value = product.image;
        const hiddenId = document.createElement('input');
        hiddenId.type = 'hidden';
        hiddenId.name = 'id';
        hiddenId.value = product._id;
        productForm.appendChild(hiddenId);
    };

    // Delete product
    window.deleteProduct = async function(id) {
        await fetch(`/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    fetchProducts();
});
