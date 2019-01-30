'use strict';

class Cart {
    constructor (source, topCartContainer = '.cart-list', mainCartContainer = '.cart-items-table') {
        this.source = source;
        this.topCartContainer = topCartContainer;
        this.mainCartContainer = mainCartContainer;
        this.countGoods = 0;
        this.amount = 0;
        this.cartItems = [];
        
        this._init();
    }
    
    _init() {
        fetch(this.source)
            .then(result => result.json())
            .then(data => {
                data.contents.forEach(key => {
                    this.cartItems.push(key);
                    this._renderItem(key);
                    const $findContainer = $(document).find('.cart-items-table');
                    if ($findContainer) {
                        this._renderMainCart($findContainer, key);
                    }
                });
                this.countGoods = data.countGoods;
                this.amount = data.amount;
                this._renderSum();
                this._getCartBadge();
                this._clearCart();
            });
    }
    
    _renderMainCart(findContainer, product) {
        const $container = $('<div>', {
            class: 'table-row',
            'data-id': product.id
        });
        const $descriptionContainer = $('<div/>', {
            class: 'table-cell table-cell-description'
        });
        const $img = $('<img/>', {
            src: product.img.src,
            alt: product.img.alt
        });
        const $detailsContainer = $('<div/>', {
            class: 'table-product-details' 
        });
        const $name = $('<div/>', {
            class: 'table-cell-name',
            text: product.name
        });
        const $color = $('<div/>', {
            class: 'table-cell-color',
            text: product.color
        });        
        const $size = $('<div/>', {
            class: 'table-cell-size',
            text: product.size
        });
        const $price = $('<div/>', {
            class: 'table-cell table-cell-price',
            text: product.price
        });
        const $quantityContainer = $('<div/>', {
            class: 'table-cell table-cell-quantity'
        });
        const $quantityInput = $('<input/>', {
            type: 'number',
            min: 0,
            max: 10,
            value: product.quantity,
            'data-id': product.id
        });
        const $shipping = $('<div/>', {
            class: 'table-cell table-cell-shipping',
            text: product.shipping
        });
        const $subtotal = $('<div/>', {
            class: 'table-cell table-cell-subtotal',
            text: product.quantity * product.price
        });
        const $deleteBtnContainer = $('<div/>', {
            class: "table-cell table-cell-delete-btn"
        });
        const $deleteBtn = $('<button/>', {
            class: 'delete-item',
            'data-id': product.id
        });   
        
        $container.insertBefore('.table-footer');
        $descriptionContainer.appendTo($container);
        $img.appendTo($descriptionContainer);
        $detailsContainer.appendTo($descriptionContainer);
        $name.appendTo($detailsContainer);
        $color.appendTo($detailsContainer);
        $size.appendTo($detailsContainer);
        $price.appendTo($container);
        $quantityContainer.appendTo($container);
        $quantityInput.appendTo($quantityContainer);
        $shipping.appendTo($container);
        $subtotal.appendTo($container);
        $deleteBtnContainer.appendTo($container);
        $deleteBtn.appendTo($deleteBtnContainer); 

        $deleteBtn.click(e => {
            this._removeProduct(e.target);
        });
        
        this._changeQuantity($quantityInput);
    }
    
    _renderItem(product) {
        const $container = $('<div/>', {
            class: 'cart-item',
            'data-id': product.id
        });
        const $img = $('<img/>', {
            src: product.img.src,
            alt: product.img.alt
        });
        const $descContainer = $('<div/>', {
            class: 'cart-item-description'
        });
        const $name = $('<div/>', {
            class: 'cart-item-name',
            text: product.name
        });
        const $rateContainer = $('<div/>', {
            class: 'cart-item-rate'
        });
        const $sumContainer = $('<div/>', {
            class: 'cart-item-numbers'
        });
        const $quantity = $('<div/>', {
            class: 'cart-item-quantity',
            text: product.quantity
        });
        const $price = $('<div/>', {
            class: 'cart-item-price',
            text: product.quantity * product.price
        });
        const $removeBtn = $('<button/>', {
            class: product.quantity > 1 ? 'remove-item' : 'delete-item',
            'data-id': product.id
        });
        
        const $star = $('<span/>', {
            class: 'icon-star-full'
        });
            
        //Структура
        $img.appendTo($container);
        $descContainer.appendTo($container);
        $name.appendTo($descContainer);
        $rateContainer.appendTo($descContainer);    
        $sumContainer.appendTo($descContainer);
        $quantity.appendTo($sumContainer);
        $removeBtn.appendTo($container);
        $price.appendTo($sumContainer);
        $container.appendTo(this.topCartContainer);
        
        this._getRate(product, $rateContainer);
        
        $removeBtn.click(e => {
            this._removeProduct(e.target);
        });
    }
    
    _getCartBadge() {
        if (this.countGoods > 0) {
            $('.cart-btn-badge')
                .addClass('active')
                .text(this.countGoods);
        } else {
            $('.cart-btn-badge')
                .removeClass('active')
                .text('');
        }
    }
    
    _getRate(product, container) {
        const $star = $('<span/>', {
            class: 'icon-star-full'
        });
        const $halfStar = $('<span/>', {
            class: 'icon-star-half'
        });
        
        let $fullStarQuantity = 0;
        let $isHalfStar = false;
        
        if (product.rate % 1 === 0) {
            $fullStarQuantity = product.rate / 1;
        } else {
            $fullStarQuantity = product.rate - product.rate % 1;
            $isHalfStar = true;
        }
        
        if ($isHalfStar) {
            $(container).wrapInner($halfStar);
        }
        
        for (let i = 1; i <= $fullStarQuantity; i++) {
            $(container).wrapInner($star);
        }
    }
    
    _renderSum() {
        $('.total-sum-numbers').text(this.amount);
        $('.sub-total span').text(this.amount);
        $('.grand-total span').text(this.amount);
    }
    
    _updateCart(product) {
        
        const $container = $(`div[data-id="${product.id}"]`);
        const $containerNumbers = $(`div[data-id="${product.id}"]`)
            .children('.cart-item-description')
            .children('.cart-item-numbers');
        
        $containerNumbers.children('.cart-item-quantity').text(product.quantity);
        $containerNumbers.children('.cart-item-price').text(product.quantity * product.price);
        
        if (product.quantity === 1) {
            $container.children('button').addClass('delete-item');
            $container.children('button').removeClass('remove-item');
        } else {
            $container.children('button').addClass('remove-item');
            $container.children('button').removeClass('delete-item');
        }
        
        
    }
    _removeProduct(item) {
        const productId = +$(item).data('id');
        const find = this.cartItems.find(product => product.id === productId);
        
        if (find.quantity > 1) {        
             find.quantity--;
             this.countGoods--;
             this.amount -= find.price;
             this._updateCart(find);
         } else if (find.quantity >= 0) {
             find.quantity--;
             this.countGoods--;
             this.amount -= find.price;
             $.each($('.cart-item'), (index, data) => {
                if ($(data).data('id') === find.id) {
                    data.remove();
                }
             });
             
             $.each($('.table-row'), (index, data) => {
                 if ($(data).data('id') === find.id) {
                     data.remove();
                 }
             });
             
             console.log(this.countGoods);
             this.cartItems.unshift(...this.cartItems.splice(this.cartItems.indexOf(find), 1));
             this.cartItems.shift();
         };
         this._renderSum();
         this._getCartBadge();
    }
    
    _changeQuantity(item) {
        let $startVal = item.val();
        
        item.on('input', () => {
            const productId = +$(item).data('id');
            const find = this.cartItems.find(product => product.id === productId);
            
            if ($startVal < item.val()) {
                find.quantity++;
                this.countGoods++;
                this.amount += find.price;
                this._updateCart(find);
                $startVal++;
            } else if ($startVal > 0 && $startVal > item.val()) {
                find.quantity--;
                this.countGoods--;
                this.amount -= find.price;
                this._updateCart(find);
                $startVal--
            }
            
            console.log(`Начальное значение после изменения ${$startVal}`)
            this._renderSum();
            this._getCartBadge();
            
        });
    }
    
    _clearCart() {
        const $elements = $('.table-row');
        $(".clear-cart-btn").click(() => {
            this.cartItems.length = 0;
            this.amount = 0;
            this.countGoods = 0;
            
            $('.cart-item').remove();
            $('.table-row').filter('[data-id]').remove();
            
            this._renderSum();
            this._getCartBadge();
        });
    }
    
    
    addProduct(item) {
        const productId = +$(item).data('id');
        
        const find = this.cartItems.find(product => product.id === productId);
        
        if (find) {
            find.quantity = ($('input.product-quantity').length > 0) ? find.quantity+ +$('.product-quantity').val() : find.quantity + 1;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            const product = {
                id: productId,
                name: $(item).data('name'),
                price: +$(item).data('price'),
                img: {
                    src: $(item).data('src'),
                    alt: $(item).data('alt'),
                },
                rate: +$(item).data('rate'),
                quantity: ($('input.product-quantity').length > 0) ? +$('.product-quantity').val() : 1
            };
            this.cartItems.push(product);
            this._renderItem(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
        };
        
        this._renderSum();
        this._getCartBadge();
    }
    
}