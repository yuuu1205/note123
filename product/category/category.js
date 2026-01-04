const allProducts = { 
    pen: {
        title: "🖋️ 精準書寫",
        items: [
            { id: 1, name: "速乾水性筆", price: 45, imageSrc: "../image/photo1.jpg", 
                description: ["瞬寫速乾墨水：專為左撇子和筆記愛好者設計，書寫後即刻乾燥，徹底告別墨漬困擾。", "高精度筆尖：配備 0.4mm 碳化鎢筆尖，線條穩定、出墨流暢，適合精細筆記與勾勒。", "簡約美學設計：筆桿採霧面設計，輕量化機身，長時間書寫也舒適不疲勞。", "產地：台灣。"] },
            { id: 2, name: "自動鉛筆", price: 65, imageSrc: "../image/photo2.jpg", 
                description: ["專業級重心設計：採用全金屬握位，重心偏低，提供絕佳的穩定性和操控手感，適合製圖及細字書寫。", "內建筆芯緩衝：有效減輕書寫壓力，保護筆芯不易折斷，提高書寫效率。", "貼心組合：購買即附贈一管高密度筆芯，開箱即可使用。", "產地：台灣。"] },
            { id: 3, name: "2B鉛筆芯", price: 40, imageSrc: "../image/photo3.jpg", 
                description: ["高強度石墨配方：筆芯硬度均勻，書寫滑順且發色濃黑，同時具備出色的抗斷裂性能。", "規格標準：適用所有 0.5mm 自動鉛筆，2B 濃度適合繪圖與日常書寫。", "環保設計：附帶旋轉式筆芯收納盒，方便取用與保存。", "產地：台灣。"] },
            { id: 4, name: "橡皮擦", price: 25, imageSrc: "../image/photo4.jpg", 
                description: ["極淨不留痕：採用高分子柔軟材質，擦拭阻力小，能徹底清除鉛筆痕跡，不傷紙面、不產生過多橡皮屑。", "精準修正：方塊造型設計，邊角可用於細微處的精準擦拭。", "輕巧耐用：尺寸 5x2x1cm，體積適中，隨身攜帶或置於筆盒內皆宜。", "產地：台灣。"] },
            { id: 5, name: "螢光筆", price: 30, imageSrc: "../image/photo5.jpg", 
                description: ["雙頭多用途：一端為寬版斜頭，適合大面積標記；另一端為細圓頭，可用於劃線或註解細節。", "柔和護眼色彩：莫蘭迪色系顏料，色彩鮮豔但不過於刺眼，長時間閱讀也不易疲勞。", "墨水均勻持久：出水飽滿，不易透紙，讓您的筆記重點清晰可見。", "產地：台灣。"] },
            { id: 6, name: "修正帶", price: 28, imageSrc: "../image/photo6.jpg", 
                description: ["輕巧人體工學：外殼設計符合手部曲線，握持舒適，操作穩定不跑帶。", "修正平整服貼：帶芯服貼度高，修正後可立即書寫，字跡不滲透、不卡筆。", "高覆蓋力：帶寬 5mm，覆蓋力強，適用於大多數筆記本和文件。", "產地：台灣。"] }
        ]
    },

    book: {
        title: "📓 筆記介面",
        items: [
            { id: 10, name: "筆記本", price: 68, imageSrc: "../image/photo10.jpg", 
                description: ["鋼筆適用特製紙：內頁採用 80 磅厚紙張，抗墨水滲透性極佳，適合使用鋼筆或水性筆書寫。", "書寫體驗升級：紙張平滑細緻，減少書寫時的阻力與刮擦感，提升書寫樂趣。", "耐用設計：共 160 頁，封面抗污耐磨，適合每日攜帶使用。", "顏色隨機出貨。", "產地：台灣。"] },
            { id: 11, name: "活頁紙", price: 59, imageSrc: "../image/photo11.jpg", 
                description: ["標準孔距：適用於市面上所有標準活頁夾，方便分類與整理。", "清新橫線內頁：內頁線條顏色柔和，引導書寫同時不干擾閱讀。", "經濟實惠：內含 100 張優質活頁紙，是學生和上班族的理想選擇。", "產地：台灣。"] },
            { id: 12, name: "便利貼", price: 34, imageSrc: "../image/photo12.jpg", 
                description: ["超強黏性：採用特殊黏膠配方，可牢固黏貼於螢幕、文件或牆面，且可重複撕貼不留殘膠。", "重點提示必備：尺寸 7.5x7.5cm，提供足夠空間書寫重要事項或靈感。", "提升效率：適合進行工作或學習上的分類管理。", "顏色隨機出貨。", "產地：台灣。"] },
            { id: 13, name: "線圈速寫本", price: 75, imageSrc: "../image/photo13.jpg", 
                description: ["180 度攤平與折疊：堅固的線圈裝訂，無論攤平或完全反摺，都能提供穩定的書寫/繪圖平台。", "耐磨防水封面：硬挺封面可保護內頁，適合戶外寫生或隨身速記。", "規格實用：A4 尺寸大空間，內頁微黃，有助於減輕長時間閱讀的眼睛疲勞。", "顏色隨機出貨。", "產地：台灣。"] },
            { id: 14, name: "文件收納夾", price: 110, imageSrc: "../image/photo14.jpg", 
                description: ["多層分類管理：內部設有六層分隔，可輕鬆將不同專案或科目的文件分類歸檔。", "透明速查設計：半透明外殼設計，不需打開即可大致辨識內容，提高查找效率。", "大容量：可容納約 100 張 A4 紙張，是整理厚重資料的好幫手。", "顏色隨機出貨。", "產地：台灣。"] },
            { id: 15, name: "萬用手冊", price: 150, imageSrc: "../image/photo15.jpg", 
                description: ["彈性無時效規劃：內頁日期欄位為空白，可隨時開始使用，無需擔心浪費。", "質感皮革封面：採用 PU 皮革，手感溫潤舒適，展現專業氣質。", "多功能內頁：包含年計畫、月計畫、週計畫和自由筆記頁面，並附有精美書籤。", "顏色隨機出貨。", "產地：台灣。"] }
        ]
    },
    desk: {
        title: "💻 桌面環境",
        items: [
            { id: 20, name: "簡約桌墊", price: 280, imageSrc: "../image/photo20.jpg", 
                description: ["極簡風格美化桌面：提供寬敞且平滑的桌面工作區域，提升工作空間質感。", "皮革級防水耐用：採用優質 PU 皮革材質，具備防水防滑功能，保護桌面免受刮傷或潑濺。", "寬大尺寸：90x45cm，足以容納鍵盤、滑鼠和筆記本。", "顏色隨機出貨。", "產地：台灣。"] },
            { id: 21, name: "質感筆筒", price: 119, imageSrc: "../image/photo21.jpg", 
                description: ["現代金屬網格：鏤空設計，提供良好的透氣性，視覺上輕盈不笨重。", "分類收納大師：適合放置筆、剪刀、尺等文具，讓桌面保持整潔有序。", "防刮底部：底部設有防滑墊，防止移動時刮傷桌面。", "顏色隨機出貨。", "產地：台灣。"] },
            { id: 22, name: "LED檯燈", price: 299, imageSrc: "../image/photo22.jpg", 
                description: ["專業護眼光源：採用高演色性 LED 燈條，無頻閃，有效減少長時間閱讀對眼睛的負擔。", "智慧三段調光：可依據不同情境（工作、閱讀、休息）調整亮度與色溫。", "靈活鵝頸設計：燈頭可多角度調整，精準照明您所需的工作區域。", "功率：5W，顏色隨機出貨。", "產地：台灣。"] }, 
            { id: 23, name: "小時鐘", price: 250, imageSrc: "../image/photo23.jpg", 
                description: ["靜音掃秒機芯：採用高品質靜音機芯，指針平穩滑動，創造安靜的專注環境，無滴答聲干擾。", "北歐簡約設計：極簡時鐘面板，搭配 ABS 塑膠外框，適合任何現代辦公室或居家風格。", "易於閱讀：大數字刻度，即使遠距離也能清楚掌握時間。", "電源：4 號電池，顏色隨機出貨。", "產地：台灣。"] }, 
            { id: 24, name: "木製杯墊", price: 140, imageSrc: "../image/photo24.jpg", 
                description: ["天然櫸木紋理：使用天然櫸木一體成型，紋路獨特，為桌面增添溫暖自然氛圍。", "優異隔熱吸濕：有效隔絕冷飲或熱飲對桌面的傷害，並吸收水珠，保持桌面乾燥。", "輕巧實用：直徑 9cm，厚度適中，適用於大多數馬克杯和水瓶。", "顏色、木紋、深淺隨機出貨。", "產地：台灣。"] },
            { id: 25, name: "多肉植物", price: 129, imageSrc: "../image/photo25.jpg", 
                description: ["療癒系桌面夥伴：小巧可愛的多肉植物，有助於舒緩工作壓力，綠化視覺。", "附帶陶瓷盆栽：搭配簡約白色陶瓷盆，精緻美觀，可直接擺放。", "超低維護需求：耐旱易於照護，每週澆水一次即可，是新手入門的最佳選擇。", "品種、顏色隨機出貨。", "產地：台灣。"] }
        ]
    }
};

function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('type') || 'pen'; 
}

function renderProducts(categoryKey) {
    const data = allProducts[categoryKey]; 
    const productListContainer = document.getElementById('product-list-section');
    const categoryTitleElement = document.getElementById('category-title');

    if (!data) {
        categoryTitleElement.textContent = "❌ 找不到此商品類別";
        productListContainer.innerHTML = "<p>請確認您訪問的連結是否正確。</p>";
        document.title = "商品類別 - 錯誤";
        return;
    }

    categoryTitleElement.textContent = data.title;
    document.title = `商品類別 - ${data.title}`;
    
    let htmlContent = '';

    data.items.forEach(product => {
        htmlContent += `
            <a href="../detail/detail.html?id=${product.id}" class="product">
                <img src="${product.imageSrc}" alt="${product.name}" class="photo">  <h3>${product.name}</h3>
                <p>$${product.price}</p>
            </a>
        `;
    });
    productListContainer.innerHTML = htmlContent;
}

document.addEventListener('DOMContentLoaded', () => {
    const category = getCategoryFromUrl();
    renderProducts(category);
});
