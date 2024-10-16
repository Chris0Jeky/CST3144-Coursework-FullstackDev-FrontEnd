new Vue({
    el: '#products',
    data: {
        sitename: "Vue.js School Store",
        products: [
            {
                id: 1001,
                subject: "Maths",
                location: "London",
                price: 100,
                spaces: 9,
                image: '../images/calculator_12320345.gif'
            },
            {
                id: 1002,
                subject: "Maths",
                location: "Cambridge",
                price: 90,
                spaces: 20,
                image: '../images/calculator_17518098.gif'
            },
            {
                id: 1003,
                subject: "Maths",
                location: "Oxford",
                price: 120,
                spaces: 50,
                image: '../images/calculator_6454138.gif'
            },
            {
                id: 1004,
                subject: "English",
                location: "Oxford",
                price: 140,
                spaces: 55,
                image: '../images/dictionary_11935089.gif'
            },
            {
                id: 1005,
                subject: "English",
                location: "London",
                price: 160,
                spaces: 13,
                image: '../images/dictionary_11935089.gif'
            },
            {
                id: 1006,
                subject: "English",
                location: "Cambridge",
                price: 200,
                spaces: 5,
                image: '../images/dictionary_11935089.gif'
            },
            {
                id: 1007,
                subject: "Chemestry",
                location: "Oxford",
                price: 220,
                spaces: 7,
                image: '../images/chemistry_12035107.gif'
            },
            {
                id: 1008,
                subject: "Music",
                location: "Oxford",
                price: 230,
                spaces: 9,
                image: '../images/guitar_16431853.gif'
            },
            {
                id: 1009,
                subject: "Music",
                location: "Cambridge",
                price: 10,
                spaces: 17,
                image: '../images/guitar_16431853.gif'
            },
            {
                id: 1010,
                subject: "Music",
                location: "London",
                price: 300,
                spaces: 11,
                image: '../images/guitar_16431853.gif'
            }
        ],
        cart: [],

        // Form data for checkout
        name: '',
        phone: '',
        nameError: '',
        phoneError: '',
        orderSubmitted: false,

        // Search and sorting
        searchQuery: '', // track the search input
        sortAttribute: 'subject',  // Default sort attribute
        sortOrder: 'asc',  // Default sort order
        checkOutArea: false
    },

    methods: {
        addItem(product) {
            if (product.spaces > 0) {
                this.cart.push(product);
                product.spaces--;
            }
        },

        // Remove the last item from the cart
        removeLastItem() {
            if (this.cart.length > 0) {
                const lastProduct = this.cart.pop();
                lastProduct.spaces++;
            }
        },

        // Remove all items from the cart
        clearCart() {
            if (this.cart.length > 0) {
                this.cart.forEach(product => {
                    product.spaces++;
                });
                this.cart = [];
            }
        },

        // Remove a specific product from the cart
        removeItemFromCart(product) {
            const index = this.cart.findIndex(cartProduct => cartProduct.id === product.id);

            if (index !== -1) {
                this.cart.splice(index, 1); // Remove the item from the cart
                const originalProduct = this.products.find(prod => prod.id === product.id);
                if (originalProduct) {
                    originalProduct.spaces++;
                }
            }
        },

        // Group products in the cart by ID for displaying in batches
        groupedCart() {
            const grouped = {};
            this.cart.forEach(product => {
                if (!grouped[product.id]) {
                    grouped[product.id] = { ...product, quantity: 0 };
                }
                grouped[product.id].quantity++;
            });
            return Object.values(grouped);  // Return as an array of grouped items
        },

        // Sort products by selected attribute and order
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

        // Validate the name
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

        // Validate the phone number
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

        // Submit the order
        submitOrder() {
            if (this.isCheckoutEnabled) {
                this.orderSubmitted = true;
                this.clearCart();
                this.name = '';
                this.phone = '';
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

        // Filter products based on search query and sorting
        filteredProducts() {
            return this.products.filter(product => {
                const query = this.searchQuery.toLowerCase();
                const subject = product.subject ? product.subject.toLowerCase() : '';
                const location = product.location ? product.location.toLowerCase() : '';
                const price = product.price ? product.price.toString() : '';
                const spaces = product.spaces ? product.spaces.toString() : '';

                return (
                    subject.includes(query) ||
                    location.includes(query) ||
                    price.includes(query) ||
                    spaces.includes(query)
                );
            });
        }
    }
});
