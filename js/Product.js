'use strict';

class Product {
    constructor (id, name, price, mainImg, rate, container = 'div.products', link = 'single-page.html') {
        this.id = id;
        this.link = link;
        this.name = name;
        this.price = price;
        this.rate = rate;
        this.img = {
                src: mainImg.src,
                alt: mainImg.alt
            };
        this.container = container;
    
        this._render(this.container);
    }
    
    
    
    _render(container) {
        const $container = $('<a/>', {
           href: this.link,
           class: 'products-item'
        });
        const $imgContainer = $('<div/>', {
            class: 'products-item-img',
        });
        const $img = $('<img/>', {
            src: this.img.src,
            alt: this.img.alt
        });
        const $addBtn = $('<button/>', {
            class: 'add-cart-btn secondary-btn',
            text: 'Add to Cart',
            'data-id': this.id,
            'data-name': this.name,
            'data-price': this.price,
            'data-rate': this.rate,
            'data-src': this.img.src,
            'data-alt': this.alt
        });
        const $descContainer = $('<div/>', {
            class: 'products-item-description'
        });
        const $name = $('<div/>', {
            class: 'products-item-name',
            text: this.name
        });
        const $price = $('<div/>', {
            class: 'products-item-price',
            text: this.price
        });
        
        //Создание структуры
        $imgContainer.appendTo($container);
        $img.appendTo($imgContainer);
        $addBtn.appendTo($imgContainer);
        $descContainer.appendTo($container);
        $name.appendTo($descContainer);
        $price.appendTo($descContainer);
        $container.appendTo(this.container);
    }
}