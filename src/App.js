new Vue({
    el: '#products',
    
    data: {
        sitename: "Vue.js School Store",  // Updated the sitename for relevancy
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
        cart: [],  // Cart to store added products
        checkOutArea: false,
        sortAttribute: 'subject',  // Default sort attribute
        sortOrder: 'asc'  // Default sort order
    },

    methods: {
        // Add item to the cart
        addItem(product) {
            if (product.spaces > 0) {
                this.cart.push(product);  // Add product to cart
                product.spaces--;         // Decrease available spaces
            }
        },

        // Remove the last item from the cart
        removeLastItem() {
            if (this.cart.length > 0) {
                const lastProduct = this.cart.pop();
                lastProduct.spaces++;  // Return space back to product when removed
            }
        },

        // Remove all items from the cart
        clearCart() {
            if (this.cart.length > 0) {
                this.cart.forEach(product => {
                    product.spaces++;  // Restore spaces for all products in the cart
                });
                this.cart = [];  // Empty the cart
            }
        },

         // Remove a specific product from the cart in batches
         removeItemFromCart(product) {
            const index = this.cart.findIndex(cartProduct => cartProduct.id === product.id);
            if (index !== -1) {
                this.cart.splice(index, 1);  // Remove one unit from the cart
                product.spaces++;  // Increase the available spaces for that product
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

        moveToOtherArea(){
            this.checkOutArea = !this.checkOutArea;
        }
    },

    computed: {
        // Determine if the cart has items for removal
        canRemoveCart() {
            return this.cart.length > 0;
        }
    }
});
