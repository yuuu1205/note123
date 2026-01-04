document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); 

    let product = null;
    let foundCategory = null;

    const categories = detaildata; 

    for (const categoryKey in categories) {
        if (categories.hasOwnProperty(categoryKey)) {
            const items = categories[categoryKey].items;
            const foundProduct = items.find(item => item.id.toString() === productId);
            if (foundProduct) {
                product = foundProduct;
                foundCategory = categoryKey;
                break;
            }
        }
    }


    if (product) {
        const titleElement = document.getElementById('product-title');
        const priceElement = document.getElementById('product-price-value');
        const imageElement = document.getElementById('product-main-image');
        const descriptionList = document.getElementById('product-description-list');
        const pageTitle = document.getElementById('page-title');

        pageTitle.textContent = `商品詳細頁面 - ${product.name}`;

        titleElement.textContent = product.name;
        imageElement.src = product.imageSrc;
        imageElement.alt = product.name;
        priceElement.textContent = product.price;

        descriptionList.innerHTML = ''; 
        product.description.forEach(desc => {
            const listItem = document.createElement('li');
            listItem.textContent = desc;
            descriptionList.appendChild(listItem);
        
        
        
        });

        const addToCartButton = document.getElementById('add-to-cart-button');
        const quantityInput = document.getElementById('quantity-input');

        addToCartButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            const existingProduct = cart.find(item => item.id.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: product.imageSrc
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert('商品已加入購物車！');
        });

    } else {
        document.getElementById('product-title').textContent = '商品載入失敗或不存在';
        document.querySelector('.product-image-area').style.display = 'none';
        document.querySelector('.purchase-options').style.display = 'none'; 
        document.getElementById('product-description-list').innerHTML = '<li>抱歉，找不到您想查看的商品資訊。</li>';
    }
});