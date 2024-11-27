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
            fetch('https://afscle.onrender.com/lessons')
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
            const phoneRegex = /^[0-9]+$/;
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
                // Construct the lessons array
                const lessons = this.groupedCart().map(item => ({
                    lessonId: item._id,
                    quantity: item.quantity
                }));

                // Prepare the order data
                const orderData = {
                    name: this.name,
                    phone: this.phone,
                    lessons: lessons
                };

                // Send the order to the back-end
                fetch('https://afscle.onrender.com/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to submit order');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Order submitted:', data);
                        this.orderSubmitted = true;
                        this.clearCart();
                        this.name = '';
                        this.phone = '';
                        // Refresh the products list to update available spaces
                        this.fetchProducts();
                    })
                    .catch(error => {
                        console.error('Error submitting order:', error);
                    });
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
            return this.products.filter(product => {
                const query = this.searchQuery.toLowerCase();
                const topic = product.topic ? product.topic.toLowerCase() : '';
                const location = product.location ? product.location.toLowerCase() : '';
                const price = product.price ? product.price.toString() : '';
                const space = product.space ? product.space.toString() : '';

                return (
                    topic.includes(query) ||
                    location.includes(query) ||
                    price.includes(query) ||
                    space.includes(query)
                );
            });
        }
    }
});
