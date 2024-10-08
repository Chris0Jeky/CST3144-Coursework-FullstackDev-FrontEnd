new Vue({
    el: '#products',  
    
    data: {
        sitename: "Vue.js pet store",
        products: {
            maths: {
                id: 1001,
                subject: "Maths",
                location: "London",
                price: 100,
                spaces: 5
            },
            music: {
                id: 1002,
                subject: "Music",
                location: "Cambridge",
                price: 100,
                spaces: 5
            },
            english: {
                id: 1003,
                subject: "English",
                location: "Oxford",
                price: 100,
                spaces: 5
            },
            maths: {
                id: 1004,
                subject: "Maths",
                location: "Bristol",
                price: 100,
                spaces: 5
            },
            english: {
                id: 1005,
                subject: "English",
                location: "Roma roma mia",
                price: 100,
                spaces: 5 
            }

        },
        listOfProducts: [],
        cart: [],
        checkOutArea: false
    },

    methods: {
        addItem: function(){
            this.cart.push( this.product.id );
            this.product.availability -= 1; 
            console.log(this.cart);
            console.log(this.product.availability);
        },

        removeLastItem: function(){
            console.log(this.cart);
            this.cart.pop();
            this.product.availability++;
            console.log(this.cart);
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
        canAddToCart: function(){
            if (this.product.availability > 0) {
                return true;
            }
            else return false;
        },

        canRemoveCart: function(){
            if (this.cart.length > 0) {
                return true;
            }
            else if (this.cart.length < 1) {
                return false
            } 
        }
    }
});
