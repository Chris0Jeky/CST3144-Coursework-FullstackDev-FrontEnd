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
                image: 'https://via.placeholder.com/150'
            },
            {
                id: 1002,
                subject: "Music",
                location: "Cambridge",
                price: 90,
                spaces: 5,
                image: 'https://via.placeholder.com/150'
            },
            {
                id: 1003,
                subject: "English",
                location: "Oxford",
                price: 80,
                spaces: 5,
                image: 'https://via.placeholder.com/150'
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
        }
    },

    computed: {
        // Determine if the cart has items for removal
        canRemoveCart() {
            return this.cart.length > 0;
        }
    }
});
