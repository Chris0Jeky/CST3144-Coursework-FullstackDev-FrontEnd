new Vue({
    el: '#products',
    data: {
        sitename: "Vue.js School Store", // Site name
        products: [], // Array to hold products fetched from the back end
        cart: [], // Array to hold products added to the cart
        name: '', // User's name input
        phone: '', // User's phone input
        nameError: '', // Error message for name validation
        phoneError: '', // Error message for phone validation
        orderSubmitted: false, // Flag to show order submission success
        searchQuery: '', // User's search input
        sortAttribute: 'topic', // Attribute to sort by
        sortOrder: 'asc', // Order of sorting (asc or desc)
        checkOutArea: false, // Flag to toggle between product list and checkout area
        loading: false, // Loading indicator
    },
    created() {
        this.fetchProducts(); // Fetch products when the Vue instance is created
    },
    methods: {
        // Fetch products from the back-end API
        fetchProducts() {
            this.loading = true; // Show loading indicator
            const params = new URLSearchParams();
            if (this.searchQuery) {
                params.append('search', this.searchQuery);
            }
            if (this.sortAttribute) {
                params.append('sortAttribute', this.sortAttribute);
                params.append('sortOrder', this.sortOrder);
            }

            fetch(`https://afscle.onrender.com/lessons?${params.toString()}`)
                .then(response => response.json())
                .then(data => {
                    this.products = data; // Update products array
                    this.loading = false; // Hide loading indicator
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    this.loading = false;
                });
        },
        // Add a product to the cart
        addItem(product) {
            if (product.space > 0) {
                this.cart.push(product); // Add product to cart
                product.space--; // Decrement available space
            }
        },
        // Remove the last item added to the cart
        removeLastItem() {
            if (this.cart.length > 0) {
                const lastProduct = this.cart.pop(); // Remove last product from cart
                lastProduct.space++; // Increment available space
            }
        },
        // Clear all items from the cart
        clearCart() {
            if (this.cart.length > 0) {
                // Return spaces to products
                this.cart.forEach(product => {
                    product.space++;
                });
                this.cart = []; // Empty the cart array
            }
        },
        // Remove a specific item from the cart
        removeItemFromCart(product) {
            const index = this.cart.findIndex(cartProduct => cartProduct._id === product._id);
            if (index !== -1) {
                this.cart.splice(index, 1); // Remove item from cart
                const originalProduct = this.products.find(prod => prod._id === product._id);
                if (originalProduct) {
                    originalProduct.space++; // Increment available space
                }
            }
        },
        // Group cart items by product ID to calculate quantities
        groupedCart() {
            const grouped = {};
            this.cart.forEach(product => {
                if (!grouped[product._id]) {
                    grouped[product._id] = { ...product, quantity: 0 };
                }
                grouped[product._id].quantity++;
            });
            return Object.values(grouped); // Return array of grouped products
        },
        // Submit the order to the back-end API
        submitOrder() {
            if (this.isCheckoutEnabled) {
                // Prepare lessons data from cart
                const lessons = this.groupedCart().map(item => ({
                    lessonId: item._id,
                    quantity: item.quantity
                }));

                const orderData = {
                    name: this.name,
                    phone: this.phone,
                    lessons: lessons
                };

                // Send POST request to create a new order
                fetch('https://afscle.onrender.com/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(errData => {
                                throw new Error(errData.error || 'Failed to submit order');
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Order submitted:', data);
                        // After order is submitted, clear the cart and reset form
                        this.orderSubmitted = true;
                        this.clearCart();
                        this.name = '';
                        this.phone = '';
                        this.fetchProducts(); // Refresh products to update spaces
                    })
                    .catch(error => {
                        console.error('Error submitting order:', error);
                        alert(`Order submission failed: ${error.message}`);
                    });
            }
        },
        // Toggle between product list and checkout area
        moveToOtherArea() {
            this.checkOutArea = !this.checkOutArea;
        },
        // Validate the name input
        validateName() {
            const nameRegex = /^[a-zA-Z\s'-]+$/;
            if (!this.name) {
                this.nameError = 'Name is required.';
                return false;
            } else if (!nameRegex.test(this.name)) {
                this.nameError = 'Name must contain only letters, spaces, apostrophes, or hyphens.';
                return false;
            } else {
                this.nameError = '';
                return true;
            }
        },
        // Validate the phone input
        validatePhone() {
            const phoneRegex = /^[0-9]{10}$/;
            if (!this.phone) {
                this.phoneError = 'Phone number is required.';
                return false;
            } else if (!phoneRegex.test(this.phone)) {
                this.phoneError = 'Phone must contain exactly 10 numbers.';
                return false;
            } else {
                this.phoneError = '';
                return true;
            }
        },
        // Method to sort products (not needed if sorting is handled by back end)
        sortProducts() {
            // Sorting is handled by back-end fetchProducts method
            this.fetchProducts(); // Fetch sorted products
        }
    },
    watch: {
        // Watch for changes in search query and fetch products
        searchQuery() {
            this.fetchProducts();
        },
        // Watch for changes in sorting attribute and fetch products
        sortAttribute() {
            this.fetchProducts();
        },
        // Watch for changes in sorting order and fetch products
        sortOrder() {
            this.fetchProducts();
        }
    },
    computed: {
        // Check if cart has items
        canRemoveCart() {
            return this.cart.length > 0;
        },
        // Check if checkout form is valid
        isCheckoutEnabled() {
            return this.validateName() && this.validatePhone();
        },
        // Since filtering is done on back end, return products as is
        filteredProducts() {
            return this.products;
        }
    }
});
