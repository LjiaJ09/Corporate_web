(function () {
  var HERO_SLIDES = [
    {
      titleMain: "追求精工品质",
      titleRight: "铸造行业品牌",
      subtitle: "SEIKO QUALITY CASTING INDUSTRY BRAND",
      desc: "以优质的服务团队和优秀的产品，打造行业第一品牌。",
    },
    {
      titleMain: "精工制造品质",
      titleRight: "服务创造价值",
      subtitle: "CRAFTING QUALITY SERVICE CREATES VALUE",
      desc: "让客户更快找到品牌、产品和联系方式。",
    },
  ];

  var currentHeroIndex = 0;
  var heroSwitchTimer = null;

  function getData() {
    if (!window.SITE_DATA) {
      throw new Error("SITE_DATA 未加载");
    }

    return window.SITE_DATA;
  }

  function setText(selector, value) {
    var nodes = document.querySelectorAll(selector);
    var i;

    for (i = 0; i < nodes.length; i += 1) {
      nodes[i].textContent = value;
    }
  }

  function fillCompanyInfo(data) {
    setText("[data-company-name]", data.company.name);
    setText("[data-company-english]", data.company.englishName);
    setText("[data-hotline]", data.company.hotline);
  }

  function createNewsItem(item, isFeatured) {
    var article = document.createElement("article");
    var title = document.createElement("h4");
    var date = document.createElement("span");
    var text = null;
    var thumb = null;
    var arrow = null;

    article.className = isFeatured ? "news-card is-active" : "news-card";
    title.className = isFeatured ? "news-title-main" : "news-title-list";
    date.className = isFeatured ? "news-date-main" : "news-date-list";
    title.textContent = item.title;
    date.textContent = item.date;

    if (item.url && item.url !== "#") {
      article.style.cursor = "pointer";
      article.addEventListener("click", function () {
        window.open(item.url, "_blank", "noopener,noreferrer");
      });
    }

    if (isFeatured) {
      thumb = document.createElement("div");
      thumb.className = "news-thumb";

      if (item.image) {
        thumb.style.backgroundImage = "url('" + item.image + "')";
      }

      text = document.createElement("p");
      text.className = "news-text-main";
      text.textContent = item.text;

      article.appendChild(thumb);
      article.appendChild(title);
      article.appendChild(text);
      return article;
    }

    arrow = document.createElement("span");
    arrow.className = "news-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "›";

    article.appendChild(arrow);
    article.appendChild(title);
    article.appendChild(date);
    return article;
  }

  function createProductCard(item) {
    var card = document.createElement("article");
    var image = document.createElement("div");
    var imageElement = null;
    var body = document.createElement("div");
    var actions = document.createElement("div");
    var detailLink = document.createElement("a");
    var title = document.createElement("h4");
    var text = document.createElement("p");

    card.className = "product-card";
    image.className = "product-image";
    body.className = "product-body";
    actions.className = "product-actions";
    detailLink.className = "product-detail-link";
    detailLink.href = "./product-detail.html?code=" + encodeURIComponent(item.code);
    detailLink.textContent = "查看详情";
    detailLink.setAttribute("data-after", "→");

    if (item.image) {
      imageElement = document.createElement("img");
      imageElement.className = "product-image-photo";
      imageElement.src = item.image;
      imageElement.alt = item.name;
      imageElement.loading = "lazy";
      imageElement.addEventListener("error", function () {
        image.classList.remove("has-photo");
        image.innerHTML = "";
        image.textContent = item.code;
      });
      image.classList.add("has-photo");
      image.appendChild(imageElement);
    } else {
      image.textContent = item.code;
    }

    title.textContent = item.name;
    text.textContent = item.text;

    actions.appendChild(detailLink);
    body.appendChild(title);
    body.appendChild(text);
    body.appendChild(actions);
    card.appendChild(image);
    card.appendChild(body);
    return card;
  }

  function createContactItem(item) {
    var row = document.createElement("div");
    var label = document.createElement("span");
    var value = document.createElement("strong");

    row.className = "contact-item";
    label.textContent = item.label;
    value.textContent = item.value;

    row.appendChild(label);
    row.appendChild(value);
    return row;
  }

  function renderHero(slide) {
    var heroVisual = document.getElementById("heroVisual");

    setText("#heroTitleMain", slide.titleMain);
    setText("#heroTitleRight", slide.titleRight);
    setText("#heroSubtitle", slide.subtitle);
    setText("#heroDesc", slide.desc);

    if (heroVisual) {
      heroVisual.setAttribute("data-slide", String(currentHeroIndex));
    }
  }

  function renderHeroWithTransition(slide) {
    var heroSection = document.getElementById("home");

    if (!heroSection) {
      renderHero(slide);
      return;
    }

    if (heroSwitchTimer) {
      window.clearTimeout(heroSwitchTimer);
      heroSwitchTimer = null;
    }

    heroSection.classList.add("hero-switching");
    heroSwitchTimer = window.setTimeout(function () {
      renderHero(slide);
      heroSection.classList.remove("hero-switching");
      heroSwitchTimer = null;
    }, 180);
  }

  function renderIndicators(container) {
    var i;

    if (!container) {
      return;
    }

    container.innerHTML = "";
    for (i = 0; i < HERO_SLIDES.length; i += 1) {
      var button = document.createElement("button");

      button.type = "button";
      button.className = i === currentHeroIndex ? "indicator is-active" : "indicator";
      button.setAttribute("data-index", String(i));
      button.setAttribute("aria-label", "切换横幅 " + (i + 1));
      container.appendChild(button);
    }
  }

  function goToSlide(index, container) {
    if (index < 0 || index >= HERO_SLIDES.length) {
      return;
    }

    currentHeroIndex = index;
    renderHeroWithTransition(HERO_SLIDES[currentHeroIndex]);
    renderIndicators(container);
  }

  function nextHeroSlide(container) {
    var nextIndex = currentHeroIndex + 1;

    if (nextIndex >= HERO_SLIDES.length) {
      nextIndex = 0;
    }

    goToSlide(nextIndex, container);
  }

  function prevHeroSlide(container) {
    var prevIndex = currentHeroIndex - 1;

    if (prevIndex < 0) {
      prevIndex = HERO_SLIDES.length - 1;
    }

    goToSlide(prevIndex, container);
  }

  function bindHeroSwipe(heroSection, container) {
    var startX = 0;
    var startY = 0;
    var deltaX = 0;
    var deltaY = 0;
    var isPointerDown = false;
    var SWIPE_THRESHOLD = 48;

    if (!heroSection) {
      return;
    }

    function onPointerDown(clientX, clientY) {
      isPointerDown = true;
      startX = clientX;
      startY = clientY;
      deltaX = 0;
      deltaY = 0;
    }

    function onPointerMove(clientX, clientY) {
      if (!isPointerDown) {
        return;
      }

      deltaX = clientX - startX;
      deltaY = clientY - startY;
    }

    function onPointerUp() {
      var absX;
      var absY;

      if (!isPointerDown) {
        return;
      }

      isPointerDown = false;
      absX = Math.abs(deltaX);
      absY = Math.abs(deltaY);

      if (absX < SWIPE_THRESHOLD || absX <= absY) {
        return;
      }

      if (deltaX < 0) {
        nextHeroSlide(container);
      } else {
        prevHeroSlide(container);
      }
    }

    heroSection.addEventListener("touchstart", function (event) {
      var touch;

      if (!event.touches || event.touches.length === 0) {
        return;
      }

      touch = event.touches[0];
      onPointerDown(touch.clientX, touch.clientY);
    }, { passive: true });

    heroSection.addEventListener("touchmove", function (event) {
      var touch;

      if (!event.touches || event.touches.length === 0) {
        return;
      }

      touch = event.touches[0];
      onPointerMove(touch.clientX, touch.clientY);
    }, { passive: true });

    heroSection.addEventListener("touchend", onPointerUp);
    heroSection.addEventListener("touchcancel", onPointerUp);

    heroSection.addEventListener("mousedown", function (event) {
      onPointerDown(event.clientX, event.clientY);
    });

    heroSection.addEventListener("mousemove", function (event) {
      onPointerMove(event.clientX, event.clientY);
    });

    heroSection.addEventListener("mouseup", onPointerUp);
    heroSection.addEventListener("mouseleave", onPointerUp);
  }

  function render() {
    var data = getData();
    var heroSection = document.getElementById("home");
    var heroIndicators = document.getElementById("heroIndicators");
    var heroPrevBtn = document.getElementById("heroPrevBtn");
    var heroNextBtn = document.getElementById("heroNextBtn");
    var featuredNews = document.getElementById("featuredNews");
    var newsList = document.getElementById("newsList");
    var aboutText = document.getElementById("aboutText");
    var productsGrid = document.getElementById("productsGrid");
    var contactList = document.getElementById("contactList");
    var i;

    fillCompanyInfo(data);
    renderHero(HERO_SLIDES[currentHeroIndex]);
    renderIndicators(heroIndicators);

    if (heroIndicators) {
      heroIndicators.addEventListener("click", function (event) {
        var target = event.target;
        var index;

        if (target.tagName !== "BUTTON") {
          return;
        }

        index = Number(target.getAttribute("data-index"));
        if (Number.isNaN(index)) {
          return;
        }

        goToSlide(index, heroIndicators);
      });
    }

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener("click", function (event) {
        prevHeroSlide(heroIndicators);
        event.currentTarget.blur();
      });
    }

    if (heroNextBtn) {
      heroNextBtn.addEventListener("click", function (event) {
        nextHeroSlide(heroIndicators);
        event.currentTarget.blur();
      });
    }

    bindHeroSwipe(heroSection, heroIndicators);

    window.setInterval(function () {
      nextHeroSlide(heroIndicators);
    }, 5000);

    if (featuredNews && data.news.length > 0) {
      featuredNews.appendChild(createNewsItem(data.news[0], true));
    }

    for (i = 1; i < data.news.length; i += 1) {
      if (newsList) {
        newsList.appendChild(createNewsItem(data.news[i], false));
      }
    }

    if (aboutText) {
      aboutText.textContent = data.about.summary;
    }

    for (i = 0; i < data.products.length; i += 1) {
      if (productsGrid) {
        productsGrid.appendChild(createProductCard(data.products[i]));
      }
    }

    for (i = 0; i < data.contacts.length; i += 1) {
      if (contactList) {
        contactList.appendChild(createContactItem(data.contacts[i]));
      }
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
