(function () {
  function setText(selector, value) {
    var nodes = document.querySelectorAll(selector);
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      nodes[i].textContent = value;
    }
  }

  // 数字递增动画
  function animateCounter(element, target) {
    var current = 0;
    var increment = Math.ceil(target / 60);
    var duration = 1500;
    var stepTime = duration / (target / increment);

    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current;
    }, stepTime);
  }

  // 初始化数字动画
  function initCounters() {
    var counters = document.querySelectorAll('.counter[data-target]');
    var i;

    for (i = 0; i < counters.length; i += 1) {
      var counter = counters[i];
      var target = parseInt(counter.getAttribute('data-target'), 10);

      if (!counter.classList.contains('animated')) {
        counter.classList.add('animated');
        animateCounter(counter, target);
      }
    }
  }

  // 滚动动画观察器
  function initScrollAnimations() {
    var sections = document.querySelectorAll('.about-intro, .about-capabilities, .about-scope, .about-philosophy, .about-cta');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            // 如果是包含统计数字的区域，触发数字动画
            if (entry.target.classList.contains('about-intro')) {
              setTimeout(initCounters, 400);
            }
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      sections.forEach(function (section) {
        observer.observe(section);
      });
    } else {
      // 降级处理：直接显示所有内容
      for (var i = 0; i < sections.length; i += 1) {
        sections[i].classList.add('is-visible');
      }
      initCounters();
    }
  }

  function render() {
    if (!window.SITE_DATA) return;
    var data = window.SITE_DATA;

    setText("[data-company-name]", data.company.name);
    setText("[data-company-english]", data.company.englishName);
    setText("[data-hotline]", data.company.hotline);

    // Hero 图片加载动画
    var hero = document.querySelector('.about-hero');
    if (hero) {
      // 开始播放动画
      setTimeout(function() {
        hero.classList.add('zooming');
      }, 100);

      // 动画结束后切换到 zoomed 状态
      var img = hero.querySelector('.about-hero-bg img');
      if (img) {
        img.addEventListener('animationend', function() {
          hero.classList.remove('zooming');
          hero.classList.add('zoomed');
        });
      }
    }

    var fullTextEl = document.getElementById("aboutFullText");
    if (fullTextEl && data.about.fullText) {
      var paragraphs = data.about.fullText.split("\n\n");
      var i;
      for (i = 0; i < paragraphs.length; i += 1) {
        var p = document.createElement("p");
        p.textContent = paragraphs[i];
        fullTextEl.appendChild(p);
      }
    }

    // 初始化滚动动画
    initScrollAnimations();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
