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
                spaces: 5,
                image: '../images/calculator_12320345.gif'
            },
            {
                id: 1002,
                subject: "Maths",
                location: "Cambridge",
                price: 90,
                spaces: 5,
                image: '../images/calculator_17518098.gif'
            },
            {
                id: 1003,
                subject: "Maths",
                location: "Oxford",
                price: 120,
                spaces: 5,
                image: '../images/calculator_6454138.gif'
            },
            {
                id: 1004,
                subject: "English",
                location: "Oxford",
                price: 140,
                spaces: 5,
                image: '../images/dictionary_11935089.gif'
            },
            {
                id: 1005,
                subject: "English",
                location: "London",
                price: 160,
                spaces: 5,
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
                spaces: 5,
                image: '../images/chemistry_12035107.gif'
            },
            {
                id: 1008,
                subject: "Music",
                location: "Oxford",
                price: 230,
                spaces: 5,
                image: '../images/guitar_16431853.gif'
            },
            {
                id: 1009,
                subject: "Music",
                location: "Cambridge",
                price: 10,
                spaces: 5,
                image: '../images/guitar_16431853.gif'
            },
            {
                id: 1010,
                subject: "Music",
                location: "London",
                price: 300,
                spaces: 5,
                image: '../images/guitar_16431853.gif'
            }
        ],
        cart: [],  // Cart to store added products
        checkOutArea: false
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

        moveToOtherArea: function(){
            if (this.checkOutArea == true) {
                this.checkOutArea = false;
            } else {
                this.checkOutArea = true;
            }
            return this.checkOutArea;
        }
    },

    computed: {
        // Determine if the cart has items for removal
        canRemoveCart() {
            return this.cart.length > 0;
        }
    }
});
