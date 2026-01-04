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

    function generateStarHTML(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        if (halfStar) {
            stars += '½'; 
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }
        
        return stars;
    }

    function renderReviews(reviews) {
        const reviewsListElement = document.getElementById('product-reviews-list');
        reviewsListElement.innerHTML = ''; 

        if (!reviews || reviews.length === 0) { 
            reviewsListElement.innerHTML = '<p style="color:#888;">此商品暫無評論。</p>';
            return;
        }

        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card'; 
            
            const reviewRatingStars = generateStarHTML(review.rating);
            
            reviewCard.innerHTML = `
                <div class="user-info">${review.user}</div>
                <div class="review-rating">${reviewRatingStars} (${review.rating.toFixed(1)} 顆星)</div>
                <p class="review-text">${review.comment}</p>
            `;
            reviewsListElement.appendChild(reviewCard);
        });
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

        const purchaseOptionsDiv = document.querySelector('.purchase-options');
        const addToCartButton = document.getElementById('add-to-cart-button');
        const quantityInput = document.getElementById('quantity-input');

        if (product.rating && product.reviews) {
            const avgRating = product.rating;
            const reviewCount = product.reviews.length;
            
            document.getElementById('product-rating-stars').textContent = generateStarHTML(avgRating);
            document.getElementById('product-rating-value').textContent = avgRating.toFixed(1);
            document.getElementById('product-review-count').textContent = `(${reviewCount} 則評論)`;
            document.getElementById('average-rating-display').style.display = 'flex'; 

            renderReviews(product.reviews);
        } else {
            document.getElementById('product-reviews-list').innerHTML = '<p style="color:#888;">此商品暫無評論數據。</p>';
            document.getElementById('average-rating-display').style.display = 'none';
        }

        if (productId === '26') {
            
            const comingSoonMessage = product.description[0]; 
            if (purchaseOptionsDiv) {
                 purchaseOptionsDiv.innerHTML = `
                    <p style="color: #CC0000; font-size: 1.2em; font-weight: bold; margin: 10px 0; padding: 10px; border: 2px solid #CC0000; border-radius: 5px; background-color: #ffeaea;">
                        此為神祕新產品，將於 ${comingSoonMessage} 準時上市，敬請期待！
                    </p>
                `;
            }
            
        } else {

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
        }
        

    } else {
        document.getElementById('product-title').textContent = '商品載入失敗或不存在';
        document.querySelector('.product-image-area').style.display = 'none';
        document.querySelector('.purchase-options').style.display = 'none'; 
        document.getElementById('product-description-list').innerHTML = '<li>抱歉，找不到您想查看的商品資訊。</li>';
        document.querySelector('.review-section').style.display = 'none'; 
    }
});