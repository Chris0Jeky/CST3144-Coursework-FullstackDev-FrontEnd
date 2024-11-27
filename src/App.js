new Vue({
    el: '#products',
    data: {
        sitename: "Vue.js School Store",
        products: [], // Fetch from back-end
        cart: [],
        name: '',
        phone: '',
        nameError: '',
        phoneError: '',
        orderSubmitted: false,
        searchQuery: '',
        sortAttribute: 'topic',
        sortOrder: 'asc',
        checkOutArea: false
    },
    created() {
        this.fetchProducts();
    },
    methods: {
        fetchProducts() {
            const params = new URLSearchParams();
            if (this.searchQuery) {
                params.append('search', this.searchQuery);
            }

            fetch(`https://afscle.onrender.com/lessons?${params.toString()}`)
                .then(response => response.json())
                .then(data => {
                    this.products = data;
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        },
        addItem(product) {
            if (product.space > 0) {
                this.cart.push(product);
                product.space--;
            }
        },
        removeLastItem() {
            if (this.cart.length > 0) {
                const lastProduct = this.cart.pop();
                lastProduct.space++;
            }
        },
        clearCart() {
            if (this.cart.length > 0) {
                this.cart.forEach(product => {
                    product.space++;
                });
                this.cart = [];
            }
        },
        removeItemFromCart(product) {
            const index = this.cart.findIndex(cartProduct => cartProduct._id === product._id);
            if (index !== -1) {
                this.cart.splice(index, 1);
                const originalProduct = this.products.find(prod => prod._id === product._id);
                if (originalProduct) {
                    originalProduct.space++;
                }
            }
        },
        groupedCart() {
            const grouped = {};
            this.cart.forEach(product => {
                if (!grouped[product._id]) {
                    grouped[product._id] = { ...product, quantity: 0 };
                }
                grouped[product._id].quantity++;
            });
            return Object.values(grouped);
        },
        sortProducts() {
            this.products.sort((a, b) => {
                let modifier = this.sortOrder === 'asc' ? 1 : -1;
                if (a[this.sortAttribute] < b[this.sortAttribute]) return -1 * modifier;
                if (a[this.sortAttribute] > b[this.sortAttribute]) return 1 * modifier;
                return 0;
            });
        },
        moveToOtherArea() {
            this.checkOutArea = !this.checkOutArea;
        },
        validateName() {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!this.name) {
                this.nameError = 'Name is required.';
                return false;
            } else if (!nameRegex.test(this.name)) {
                this.nameError = 'Name must contain only letters.';
                return false;
            } else {
                this.nameError = '';
                return true;
            }
        },
        validatePhone() {
            const phoneRegex = /^[0-9]{10}$/;
            if (!this.phone) {
                this.phoneError = 'Phone number is required.';
                return false;
            } else if (!phoneRegex.test(this.phone)) {
                this.phoneError = 'Phone must contain only numbers.';
                return false;
            } else {
                this.phoneError = '';
                return true;
            }
        },
        submitOrder() {
            if (this.isCheckoutEnabled) {
                const lessons = this.groupedCart().map(item => ({
                    lessonId: item._id,
                    quantity: item.quantity
                }));

                const orderData = {
                    name: this.name,
                    phone: this.phone,
                    lessons: lessons
                };

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
        }
    },
    computed: {
        canRemoveCart() {
            return this.cart.length > 0;
        },
        isCheckoutEnabled() {
            return this.validateName() && this.validatePhone();
        },
        filteredProducts() {
            return this.products;
        }
    },
    watch: {
        searchQuery() {
            this.fetchProducts();
        }
    },
});
