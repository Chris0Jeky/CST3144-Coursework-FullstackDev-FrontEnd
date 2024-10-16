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

        name: '',
        phone: '',
        nameError: '',
        phoneError: '',
        orderSubmitted: false,

        checkOutArea: false,
        sortAttribute: 'subject',  // Default sort attribute
        sortOrder: 'asc'  // Default sort order
    },

    methods: {
        // Add item to the cart
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

        // Remove a specific product from the cart in batches
        removeItemFromCart(product) {
            // Find the index of the product in the cart
            const index = this.cart.findIndex(cartProduct => cartProduct.id === product.id);
        
            if (index !== -1) {
                // Remove the product from the cart
                const removedProduct = this.cart.splice(index, 1)[0]; 
        
                // Find the original product in the products array and increase its spaces
                const originalProduct = this.products.find(prod => prod.id === removedProduct.id);
        
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

        // Sort products by a selected attribute and order
        sortProducts() {
            const sortedProducts = [...this.products].sort((a, b) => {
                if (this.sortOrder === 'asc') {
                    return a[this.sortAttribute] > b[this.sortAttribute] ? 1 : -1;
                } else {
                    return a[this.sortAttribute] < b[this.sortAttribute] ? 1 : -1;
                }
            });
            this.products = sortedProducts;
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
                // Simulate order submission
                this.orderSubmitted = true;

                // Clear the cart and reset the form after submission
                this.clearCart();
                this.name = '';
                this.phone = '';
            }
        }
    },

    computed: {
        // Determine if the cart has items for removal
        canRemoveCart() {
            return this.cart.length > 0;
        },

        isCheckoutEnabled() {
            return this.validateName() && this.validatePhone();
        }
    }
});
