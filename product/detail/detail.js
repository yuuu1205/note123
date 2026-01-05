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

    if (product && !product.reviews) {
        product.reviews = [];
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

    function updateAverageRating() {
        if (!product || !product.reviews || product.reviews.length === 0) {
            document.getElementById('product-reviews-list').innerHTML = '<p style="color:#888;">此商品暫無評論數據。</p>';
            const avgDisplay = document.getElementById('average-rating-display');
            if (avgDisplay) avgDisplay.style.display = 'none';
            return;
        }

        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / product.reviews.length;
        const reviewCount = product.reviews.length;

        product.rating = avgRating;
        
        document.getElementById('product-rating-stars').textContent = generateStarHTML(avgRating);
        document.getElementById('product-rating-value').textContent = avgRating.toFixed(1);
        document.getElementById('product-review-count').textContent = `(${reviewCount} 則評論)`;
        const avgDisplay = document.getElementById('average-rating-display');
        if (avgDisplay) avgDisplay.style.display = 'flex'; 

        renderReviews(product.reviews);
    }


    function renderReviews(reviews) {
        const reviewsListElement = document.getElementById('product-reviews-list');
        reviewsListElement.innerHTML = ''; 

        if (!reviews || reviews.length === 0) { 
            reviewsListElement.innerHTML = '<p style="color:#888;">此商品暫無評論。</p>';
            return;
        }

        const sortedReviews = [...reviews].reverse();

        sortedReviews.forEach(review => {
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
        const quantityInput = document.getElementById('quantity-input');

        updateAverageRating();
        
        const isUserLoggedIn = localStorage.getItem('userToken');
        const reviewFormContainer = document.getElementById('review-form-container');

        if (productId === '26') {
            
            const comingSoonMessage = product.description[0]; 
            if (purchaseOptionsDiv) {
                 purchaseOptionsDiv.innerHTML = `
                    <p style="color: #CC0000; font-size: 1.2em; font-weight: bold; margin: 10px 0; padding: 10px; border: 2px solid #CC0000; border-radius: 5px; background-color: #ffeaea;">
                        此為神祕新產品，將於 ${comingSoonMessage} 準時上市，敬請期待！
                    </p>
                `;
            }
            reviewFormContainer.innerHTML = `<p style="color: #CC0000; font-size: 1em;">此為即將上市產品，暫不開放評論。</p>`;
            
        } else {
            const addToCartButton = document.getElementById('add-to-cart-button');
            const loginPromptButton = document.getElementById('login-prompt-button');

            if (isUserLoggedIn) {
                addToCartButton.style.display = 'inline-block';
                loginPromptButton.style.display = 'none';

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
                addToCartButton.style.display = 'none';
                loginPromptButton.style.display = 'inline-block';

                loginPromptButton.addEventListener('click', () => {
                    alert('請先登入會員才能將商品加入購物車。');
                    window.location.href = '../login/login.html'; 
                });
            }

            if (isUserLoggedIn) {
                reviewFormContainer.innerHTML = `
                    <form id="submit-review-form" class="review-form">
                        <h3>留下您的評論</h3>
                        <div class="rating-input-group">
                            <label for="review-rating">您的評分:</label>
                            <div class="stars-input" id="stars-input">
                                <input type="radio" id="star5" name="review-rating" value="5" required /><label for="star5" title="5 顆星">★</label>
                                <input type="radio" id="star4" name="review-rating" value="4" /><label for="star4" title="4 顆星">★</label>
                                <input type="radio" id="star3" name="review-rating" value="3" /><label for="star3" title="3 顆星">★</label>
                                <input type="radio" id="star2" name="review-rating" value="2" /><label for="star2" title="2 顆星">★</label>
                                <input type="radio" id="star1" name="review-rating" value="1" /><label for="star1" title="1 顆星">★</label>
                            </div>
                        </div>
                        <div class="comment-input-group">
                            <label for="review-comment">評論內容:</label>
                            <textarea id="review-comment" name="review-comment" rows="4" placeholder="請輸入您的購買心得或建議..." required></textarea>
                        </div>
                        <button type="submit" class="submit-review-btn">提交評論</button>
                    </form>
                `;

                const reviewForm = document.getElementById('submit-review-form');
                if (reviewForm) {
                    reviewForm.addEventListener('submit', (event) => {
                        event.preventDefault(); 
                        
                        const ratingInput = document.querySelector('input[name="review-rating"]:checked');
                        if (!ratingInput) {
                            alert('請選擇您的評分星級！');
                            return;
                        }

                        const rating = parseFloat(ratingInput.value);
                        const comment = document.getElementById('review-comment').value.trim();
                        
                        const userName = localStorage.getItem('userName') || '會員'; 
                        
                        const newReview = {
                            user: userName,
                            comment: comment,
                            rating: rating
                        };

                        product.reviews.push(newReview);
                        
                        alert(`【評論提交成功 (模擬)】\n評分: ${rating} 顆星\n您的評論已即時顯示在評論區。`);
                        
                        updateAverageRating();
                        
                        reviewForm.reset();
                        
                    });
                }

            } else {
                reviewFormContainer.innerHTML = `
                    <div class="login-prompt-review">
                        <p>您尚未登入，請 <a href="../login/login.html" style="color: #007bff; text-decoration: underline;">登入會員</a> 即可發表評論。</p>
                    </div>
                `;
            }
        }
    } else {
        document.getElementById('product-title').textContent = '商品載入失敗或不存在';
        document.querySelector('.product-image-area').style.display = 'none';
        document.querySelector('.purchase-options').style.display = 'none'; 
        document.getElementById('product-description-list').innerHTML = '<li>抱歉，找不到您想查看的商品資訊。</li>';
        document.querySelector('.review-section').style.display = 'none'; 
    }
});