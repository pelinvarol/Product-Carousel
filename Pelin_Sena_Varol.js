(() => {
    const FETCH_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
    const ALL_PRODUCTS = "carousel_products";
    const FAVORITES = "carousel_favorites";
    const CAROUSEL_TITLE = "Beğenebileceğinizi düşündüklerimiz";
    let products = [];
    let favorites = [];
  
    async function init() {
      if (window.location.pathname !== "/") {
        console.log("wrong page");
        return;
      }
      await loadData();
      buildHTML();
      buildCSS();
      setEvents();
    }
  
    async function loadData() {
      //my test stataments
      console.log("function will load the products for the first time or get the product info from local storage");
      favorites = JSON.parse(localStorage.getItem(FAVORITES) || "[]");
      const loaded = localStorage.getItem(ALL_PRODUCTS);
      if (loaded) {
        console.log("function won't send request because carousel_products in local storage is not empty");
        products = JSON.parse(loaded);
      } else {
        console.log("function will send request to fetch the products");
        const res = await fetch(FETCH_URL);
        products = await res.json();
        localStorage.setItem(ALL_PRODUCTS, JSON.stringify(products));
      }
    }
  
    function buildHTML() {
      const section = document.createElement("section");
      section.className = "carousel-section";
      section.innerHTML = `
          <div class="carousel-header">
            <h2 class="carousel-title">${CAROUSEL_TITLE}</h2>
          </div>
          <button class="carousel-arrow left" aria-label="Geri"><svg width="32" height="32"><circle cx="16" cy="16" r="15" fill="#fff" stroke="#ff9100" stroke-width="2"/><path d="M19 10l-5 6 5 6" stroke="#ff9100" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <div class="carousel-list-wrap">
            <div class="carousel-list">
              ${products.map(productCard).join("")}
            </div>
          </div>
          <button class="carousel-arrow right" aria-label="İleri"><svg width="32" height="32"><circle cx="16" cy="16" r="15" fill="#fff" stroke="#ff9100" stroke-width="2"/><path d="M13 10l5 6-5 6" stroke="#ff9100" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        `;
      const section1 = document.querySelector(".Section1");
      if (section1) {
        section1.insertAdjacentElement("afterend", section);
      } 
    }
  
    function productCard(product) {
      const isFavorited = favorites.includes(product.id);
      const discounted = product.price < product.original_price;
      const discountRate = discounted ? Math.round(100 - (product.price / product.original_price) * 100) : 0;
      const price = product.price.toLocaleString("tr-TR", {minimumFractionDigits: 2,maximumFractionDigits: 2,}) + " TL";
      const originalPrice = product.original_price.toLocaleString("tr-TR", {minimumFractionDigits: 2,maximumFractionDigits: 2,}) + " TL";
      //number of stars and number of comments were visible in the image, but this information was not in the fetch url. since it was on the original page, i wanted to add it to my task visually and i created some data randomly
      const stars = Math.floor(Math.random() * 6);
      const reviews = Math.floor(Math.random() * 201); 
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        const fillingAndEdgeColor = i < stars ? '#ffc107' : '#e0e0e0';
        starsHtml += `<svg width="18" height="18" viewBox="0 0 24 24" fill="${fillingAndEdgeColor}" stroke="${fillingAndEdgeColor}"><polygon points="12,2 15,9 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 9,9"/></svg>`;
      }
      return `
          <div class="carousel-card" data-id="${product.id}">
            <a class="product-item-anchor" href="${product.url}" target="_blank">
              <div class="carousel-img-wrap">
                <img src="${product.img}" alt="${product.name}" />
                <button class="carousel-fav${
                  isFavorited ? " active" : ""
                }" title="Favorilere ekle" tabindex="0">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="${
                        isFavorited ? "#ff9100" : "none"
                      }" stroke="#ff9100" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              <div class="carousel-info">
                <h2 class="item-brand">
                  <b>${product.brand} - </b>
                  <span>${product.name}</span>
                </h2>
                <div class="carousel-rating">
                  ${starsHtml}
                  <span class="review-count">(${reviews})</span>
                </div>
                <div class="carousel-prices">
                  ${
                    discounted
                      ? `
                    <span class="item__old-price">${originalPrice}</span>
                    <span class="item__percent">%${discountRate}</span>
                  ` : ""
                  }
                </div>
                <div class="item__new-price${discounted ? ' item__new-price--discounted' : ''}">${price}</div>
                <button class="btn carousel-cart-btn" type="submit">Sepete Ekle</button>
              </div>
            </a>
          </div>
        `;
    }
  
    function buildCSS() {
      const css = `
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
          .carousel-section {
            max-width: 1320px;
            margin: 40px auto;
            padding: 0 0 32px 0;
            background: #fff;
            border-radius: 32px;
            box-shadow: 8px 8px 12px 8px rgba(174,174,174,0.08);
            position: relative;
          }
          .carousel-header {
            background: #fff6ec;
            border-radius: 32px 32px 0 0;
            padding: 32px 0 24px 48px;
            text-align: left;
            margin-bottom: 0;
            display: flex;
            align-items: center;
          }
          .carousel-title {
            font-family: 'Quicksand-Bold', 'Arial', sans-serif;
            font-size: 3rem;
            font-weight: 700;
            line-height: 1.11;
            color: #f28e00;
            margin: 0;
            padding-left: 20px;
          }
          .carousel-list-wrap {
            overflow-x: auto;
            position: relative;
            padding: 0 32px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .carousel-list-wrap::-webkit-scrollbar {
            display: none;
          }
          .carousel-list {
            display: flex;
            gap: 24px;
            transition: scroll-left 0.3s;
            scroll-behavior: smooth;
            padding-bottom: 8px;
          }
          .carousel-card {
            min-width: 280px;
            max-width: 280px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
            border: 1.5px solid #f3f3f3;
            transition: border 0.2s, box-shadow 0.2s;
            position: relative;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin-top: 16px;
            margin-bottom: 8px;
          }
          .carousel-card:hover {
            border: 3px solid #ff9100;
            box-shadow: 0 4px 16px 0 rgba(255,145,0,0.08);
          }
          .product-item-anchor {
            text-decoration: none;
            color: inherit;
            display: block;
            height: 100%;
          }
          .carousel-img-wrap {
            position: relative;
            width: 100%;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px 12px 0 0;
            overflow: hidden;
          }
          .carousel-img-wrap img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
          }
          .carousel-fav {
            position: absolute;
            top: 12px;
            right: 12px;
            background: #fff;
            border: 2px solid #fff;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: border 0.2s;
            z-index: 2;
            padding: 0;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
          }
          .carousel-fav svg {
            display: block;
          }
          .carousel-fav.active,
          .carousel-fav:hover {
            border: 2px solid #ff9100;
          }
          .carousel-info {
            padding: 16px 12px 12px 12px;
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
          }
          .item-brand {
            font-family: Poppins, "cursive";
            font-size: 1.2rem;
            color: #7d7d7d;
            font-weight: 400;
            margin-bottom: 10px;
            overflow: hidden;
            line-height: 1.4;
          }
          .item-brand b {
            font-weight: 600;
          }
          .carousel-prices {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
          }
          .item__old-price {
            font-size: 1.4rem;
            font-weight: 500;
            text-decoration: line-through;
            color: #7d7d7d;
          }
          .item__percent {
            color: #00a365;
            font-size: 18px;
            font-weight: 700;
            display: inline-flex;
            justify-content: center;
            margin-left: 10px;
          }
          .item__percent .icon {
              display: inline-block;
              height: 22px;
              font-size: 22px;
              margin-left: 3px;
          }
          .item__new-price {
            display: block;
            width: 100%;
            font-size: 2.2rem;
            font-weight: 600;
            color: #7d7d7d;
            margin-bottom: 8px;
          }
          .item__new-price--discounted {
            color: #00a365
          }
          .carousel-cart-btn {
            font-family: Poppins, "cursive";
            background: #fff7ec;
            color: #ff9100;
            line-height: 1.34;
            border: none;
            border-radius: 37.5px;
            padding: 14px 0;
            font-size: 1.4rem;
            font-weight: 700;
            margin-top: auto;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            margin-bottom: 8px;
            width: 100%;
          }
          .carousel-cart-btn:hover {
            background: #ff9100;
            color: #fff;
          }
          .carousel-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            outline: none;
            cursor: pointer;
            z-index: 10;
            transition: background 0.2s, border 0.2s;
            padding: 0;
          }
          .carousel-arrow.left { left: 8px; }
          .carousel-arrow.right { right: 8px; }
          .carousel-arrow svg circle {
            transition: fill 0.2s, stroke 0.2s;
          }
          .carousel-arrow:hover svg circle {
            fill: #ff9100;
            stroke: #ff9100;
          }
          .carousel-arrow:hover svg path {
            stroke: #fff;
          }
          @media (max-width: 1100px) {
            .carousel-section { max-width: 100%; }
            .carousel-list { gap: 12px; }
            .carousel-card { min-width: 200px; max-width: 200px; }
            .carousel-header { padding-left: 16px; }
            .carousel-list-wrap { padding: 0 8px; }
          }
          @media (max-width: 700px) {
            .carousel-title { font-size: 1.3rem; }
            .carousel-card { min-width: 160px; max-width: 160px; }
            .carousel-img-wrap { height: 120px; }
            .carousel-arrow { width: 36px; height: 36px; font-size: 1.2rem; }
            .carousel-header { padding: 12px 0 8px 8px; }
          }
          .carousel-rating {
            display: flex;
            align-items: center;
            gap: 2px;
            margin-bottom: 8px;
          }
          .review-count {
            color: #888;
            font-size: 1rem;
            margin-left: 4px;
          }
          .carousel-rating svg {
            vertical-align: middle;
          }
        `;
      const style = document.createElement("style");
      style.className = "carousel-style";
      style.textContent = css;
      document.head.appendChild(style);
    }
  
    function setEvents() {
      document.querySelectorAll(".carousel-card").forEach((card) => {
        card.addEventListener("click", function (e) {
          if (
            e.target.closest(".carousel-fav") ||
            e.target.closest(".carousel-cart-btn")
          )
            return;
          const id = Number(card.getAttribute("data-id"));
          const product = products.find((p) => p.id === id);
          if (product) window.open(product.url, "_blank");
        });
      });

      document.querySelectorAll(".carousel-fav").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          const card = btn.closest(".carousel-card");
          const id = Number(card.getAttribute("data-id"));
          const path = btn.querySelector("path");
      
          const index = favorites.indexOf(id);
          if (index !== -1) {
            favorites.splice(index, 1);
            btn.classList.remove("active");
            path.setAttribute("fill", "none");
          } else {
            favorites.push(id);
            btn.classList.add("active");
            path.setAttribute("fill", "#ff9100");
          }
          localStorage.setItem(FAVORITES, JSON.stringify(favorites));
        });
      });
      
      const listWrap = document.querySelector(".carousel-list-wrap");
      document.querySelector(".carousel-arrow.left").addEventListener("click", function (e) {
          e.preventDefault();
          listWrap.scrollBy({ left: -280, behavior: "smooth" });
        });
      document.querySelector(".carousel-arrow.right").addEventListener("click", function (e) {
          e.preventDefault();
          listWrap.scrollBy({ left: 280, behavior: "smooth" });
        });
    }
    init();
  })();
  