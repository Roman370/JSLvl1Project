
class GoodItem {

    name = ''
    price = 0
    count = 1
    img = ''

    constructor(name, price, img) {

        this.name = name
        this.price = price
        this.img = img


    }

    inc() {
        this.count++


    }

    dec() {
        this.count--
    }

    getInCartBtn() {

        const PlaceToRender = document.querySelector('.item__price__wrapp')

        const btnInCart = document.createElement('button')
        btnInCart.classList.add('item__btn')
        btnInCart.innerText = 'Купить'

        btnInCart.addEventListener('click', () => {
            const cartInstance = new Cart()

            cartInstance.add(this)

        })



        return btnInCart
    }

    getMinusCart() {
        const btn = document.createElement('div')
        btn.classList.add('btn__minus')
        btn.innerHTML = '-'

        btn.addEventListener('click', () => {
            const cartInstance = new Cart()

            cartInstance.remove(this)
        })

        return btn
    }

    getPlusCart() {
        const btn = document.createElement('div')
        btn.classList.add('btn__plus')
        btn.innerHTML = '+'

        btn.addEventListener('click', () => {
            const cartInstance = new Cart()

            cartInstance.add(this)
        })

        return btn
    }

    getCartTemplate() {

        const { name, price, img, count } = this
        const wrapper = document.createElement('div')
        wrapper.classList.add('product__item__cart')

        wrapper.innerHTML = `
        <img src="${img}"  alt="туфли" class="item__img">
        <h3 class="item__name">${name}</h3>
            
           
        `

        const priceWrapp = document.createElement('div')
        priceWrapp.classList.add('price__wrapp')
        const priceVal = document.createElement('span')
        priceVal.classList.add('item__price')
        priceVal.innerHTML = `${price}$`




        const input = document.createElement('input')
        input.classList.add('input')
        input.value = `${count}`

        input.addEventListener('input', event => {

            const value = event.target.value

            if (value) {
                this.count = +value
                const cartInstance = new Cart()

                if (this.count) {
                    cartInstance.render()
                } else {
                    cartInstance.remove(this)
                }
            }
        })


        priceWrapp.appendChild(priceVal)
        priceWrapp.appendChild(this.getMinusCart())
        priceWrapp.appendChild(input)
        priceWrapp.appendChild(this.getPlusCart())


        wrapper.appendChild(priceWrapp)

        return wrapper
    }

    getMainTemplate() {

        const { name, price, img } = this
        const wrapper = document.createElement('div')
        wrapper.classList.add('product__item')

        wrapper.innerHTML = `
        <img src="${img}"  alt="туфли" class="item__img">
        <h3 class="item__name">${name}</h3>
            <span class="item__price">${price}$</span> 
        `
        wrapper.appendChild(this.getInCartBtn())
        return wrapper
    }

}

class List {

    items = []

    constructor(items = []) {
        this.items = items

    }

    fetchGoods() {
        const rezult = fetch('http://localhost:3000/database.json')
        console.log(rezult)
        return rezult
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                this.items = data.data.map(cur => {
                    console.log(cur)
                    return new GoodItem(cur.name, cur.price, cur.img)
                })
                console.log(this.items)

            })

    }

    fetchGoods2() {
        const rezult = fetch('http://localhost:3000/database2.json')
        console.log(rezult)
        return rezult
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                this.items = data.data.map(cur => {
                    console.log(cur)
                    return new GoodItem(cur.name, cur.price, cur.img)
                })
                console.log(this.items)

            })

    }



    findGood(good) {
        return this.items.filter(item => item.name === good.name)[0]

    }
    add(item) {
        const exists = this.findGood(item)
        if (exists) {
            exists.inc()
        } else {
            this.items.push(item)
        }

        this.render()

    }

    remove(item) {


        const exists = this.findGood(item)
        if (!exists) {
            return
        }
        if (exists && exists.count > 1) {
            exists.dec()
        } else {
            this.items = this.items.filter(good => good.name !== item.name)
        }

        this.render()
    }

    render() {

    }


}

class Cart extends List {

    constructor(items) {

        if (Cart._instance) {
            return Cart._instance
        }

        super(items)
        this.init()

        Cart._instance = this

    }

    init() {

        const PlaceToRender = document.querySelector('.header__wrapp')
        const cart = document.createElement('div')
        cart.classList.add('cart')

        const btn = document.createElement('div')
        btn.innerHTML = '<img src="img/shape.png" alt="Корзина" class="cart__img">'

        const cartSummVal = document.createElement('div')
        cartSummVal.classList.add('cart_summ__val')


        const empty = document.createElement('div')
        empty.classList.add('cart__empty')


        btn.addEventListener('click', () => {
            empty.classList.toggle('shown')
        })



        if (cart) {
            cart.appendChild(btn)
            cart.appendChild(empty)
            cart.appendChild(cartSummVal)

        }
        if (PlaceToRender) {
            PlaceToRender.appendChild(cart)
        }

        this.render()

        return cart

    }

    cartSummHeader() {

        const summ = this.items.reduce((rezult, curItem) => {
            return rezult + curItem.price * curItem.count

        }, 0)

        const cartSumm = document.createElement('span')
        cartSumm.classList.add('header_cart__summ')
        cartSumm.innerText = ` $${summ} `


        return cartSumm
    }



    cartSumm() {

        const summ = this.items.reduce((rezult, curItem) => {
            return rezult + curItem.price * curItem.count

        }, 0)

        const cartSumm = document.createElement('span')
        cartSumm.classList.add('cart__summ')
        cartSumm.innerText = `Общая сумма: ${summ} $`




        return cartSumm
    }

    cartEmpty() {
        const block = document.createElement('div')
        block.classList.add('cart__empty__block')
        block.innerHTML = 'Корзина пуста'

        return block
    }



    render() {

        const PlaceToRender = document.querySelector('.cart__empty')
        const PlaceToCart = document.querySelector('.cart_summ__val')

        if (!PlaceToCart) {
            return
        }
        PlaceToCart.innerHTML = ''
        PlaceToCart.appendChild(this.cartSummHeader())



        if (!PlaceToRender) {
            return

        }
        PlaceToRender.innerHTML = ''

        this.items.forEach(item => {
            const template = item.getCartTemplate()
            PlaceToRender.appendChild(template)

        })


        if (this.items.length) {
            PlaceToRender.appendChild(this.cartSumm())

        } else {
            PlaceToRender.appendChild(this.cartEmpty())
        }



    }



}

class GoodList extends List {

    constructor(items) {
        super(items)
        let goodsPromise = this.fetchGoods()
        goodsPromise.then(() => {
            this.render()
        })

    }



    btnOnList() {
        const btnOnload = document.createElement('div')
        btnOnload.classList.add('btn_onload')
        btnOnload.innerHTML = 'Загрузить ещё'

        btnOnload.addEventListener('click', () => {
            let goodsPromise = this.fetchGoods2()
            goodsPromise.then(() => {
                console.log(this.items)
                this.renderOnload()
            })
        })

        return btnOnload
    }

    render() {

        const PlaceToRender = document.querySelector('.product__wrapp')



        if (!PlaceToRender) {
            return

        }
        PlaceToRender.innerHTML = ''

        this.items.forEach(item => {
            const template = item.getMainTemplate()
            PlaceToRender.appendChild(template)

        })

        PlaceToRender.appendChild(this.btnOnList())


    }


    renderOnload() {

        const PlaceToRender = document.querySelector('.product__wrapp')


        if (!PlaceToRender) {
            return

        }

        this.items.forEach(item => {
            const template = item.getMainTemplate()
            PlaceToRender.appendChild(template)

        })
    }


}

/*
const good1 = new GoodItem('Туфли женские', 300, 'img/tufli_jen.png')
const good2 = new GoodItem('Футболка', 200, 'img/footb_2.png')
const good3 = new GoodItem('Туфли мужские', 250, 'img/tufli.png')
const good4 = new GoodItem('Футболка Levis', 350, 'img/footbol_3.png')
const good5 = new GoodItem('Сумка женская', 200, 'img/sumka.png')
const good6 = new GoodItem('Шорты мужские', 270, 'img/shorty.png')*/

/*
const goodListInstance = new GoodList()*/
const cartInstance = new Cart()
const goodListInstance = new GoodList()


/*
goodListInstance.add(good1)
goodListInstance.add(good2)
goodListInstance.add(good3)
goodListInstance.add(good4)
goodListInstance.add(good5)
goodListInstance.add(good6)


goodListInstance.render()*/


/*Кнопка бургер, для моб.версии */
const navButton = document.querySelector('.nav_button')
const headerNav = document.querySelector('.header__nav')
const body = document.querySelector('body')
navButton.addEventListener('click', () => {
    navButton.classList.toggle('_active')
    headerNav.classList.toggle('_active')
    body.classList.toggle('overflow')

})








