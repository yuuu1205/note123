function performSearch(query) {
    const results = [];
    const lowerQuery = query.trim().toLowerCase();

    if (typeof detaildata === 'undefined') {
        console.error('錯誤：產品資料 (detaildata) 未載入！請檢查 detaildata.js 是否正確連結。');
        return results;
    }

    Object.values(detaildata).forEach(category => {
        category.items.forEach(product => {
            
            const nameMatch = product.name.toLowerCase().includes(lowerQuery);
            
            if (nameMatch) {
                results.push(product);
            }
        });
    });
    return results;
}

function renderSearchResults(products, container) {
    if (products.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 20px;'>抱歉，沒有找到符合關鍵字的產品。</p>";
        return;
    }
    
    let htmlContent = '';

    products.forEach(product => {
        htmlContent += `
            <a href="../detail/detail.html?id=${product.id}" class="product">
                <img src="${product.imageSrc}" alt="${product.name}" class="photo">  
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            </a>
        `;
    });
    container.innerHTML = htmlContent;
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get('q');
    
    const searchTitleElement = document.getElementById('search-title');
    const resultsContainer = document.getElementById('search-results-section');
    
    if (!searchTerm) {
        searchTitleElement.textContent = "🔍 請輸入關鍵字開始搜尋";
        resultsContainer.innerHTML = "<p>請在上方搜尋欄位輸入您想找的產品名稱。</p>";
        document.title = "搜尋結果 - 請輸入關鍵字"; 
        return;
    }

    searchTitleElement.textContent = `🔍 搜尋結果: "${searchTerm}"`;
    document.title = `搜尋結果 - ${searchTerm}`;

    const searchResults = performSearch(searchTerm);
    renderSearchResults(searchResults, resultsContainer);
});