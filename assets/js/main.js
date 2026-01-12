/**
* Template Name: FlexStart
* Updated: Jun 19 2023 with Bootstrap v5.3.0
* Template URL: https://bootstrapmade.com/flexstart-bootstrap-startup-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function () {
  "use strict";

  // ============ 全局变量 ============
  window.translations = {};     // 存放当前语言包
  window.currentLang = "zh-CN"; // 默认语言

  // ============ 获取要加载的语言 ============
  function detectLang() {
    // 1. URL 参数 ?lang=en-US
    const params = new URLSearchParams(location.search);
    const urlLang = params.get("lang");
    if (urlLang && ["zh-CN", "en-US", "zh-TW"].includes(urlLang)) {
      localStorage.setItem("app_lang", urlLang);
      return urlLang;
    }

    // 2. localStorage 记住的上次选择
    const saved = localStorage.getItem("app_lang");
    if (saved && ["zh-CN", "en-US", "zh-TW"].includes(saved)) {
      return saved;
    }

    // 3. 浏览器语言兜底
    const browser = (navigator.language || navigator.userLanguage || "zh-CN")
      .replace("-", "_");

    if (["zh-CN", "en-US", "zh-TW"].includes(browser)) {
      return browser;
    }

    // 4. 最终兜底！永远返回 zh-CN，绝不会 undefined
    return "zh-CN";
  }

  window.currentLang = detectLang();

  // ============ 动态加载语言文件（关键！） ============
  function loadLanguage(lang) {
    const script = document.createElement("script");
    script.src = `assets/lang/${lang}.js?t=${Date.now()}`; // 防缓存
    script.onload = function () {
      // JSON 文件会被当作 JS 执行，内容必须是：window.__LANG__ = { ... }
      if (window.__LANG__) {
        window.translations = window.__LANG__;
        delete window.__LANG__; // 清理
        applyTranslations();
        highlightActiveLang();
      }
    };
    script.onerror = function () {
      console.error("加载语言文件失败:", lang);
      // 兜底用简体中文
      window.translations = { title: "订单管理", submit: "提交" };
      applyTranslations();
    };
    document.head.appendChild(script);
  }

  // ============ 翻译函数 ============
  window.t = function (key) {
    return window.translations[key] || key;
  };

  // ============ 应用翻译 ============
  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (window.translations[key] !== undefined) {
        el.textContent = window.translations[key];
      }
    });
    const select = document.getElementById("languageSelect");
    if (select) {
      const savedLang = localStorage.getItem("app_lang") || currentLang || "zh-CN";
      select.value = savedLang;  // 自动选中！
    }
  }

  // ============ 高亮当前语言按钮 ============
  function highlightActiveLang() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
  }

  // ============ 切换语言 ============
  window.changeLang = function (lang) {
    localStorage.setItem("app_lang", lang);
    location.reload();
  };

  // ============ 启动加载 ============
  loadLanguage(currentLang);

  window.handleI18nClick = function (e) {
    changeLang(e.target.dataset.lang);
  };
  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    if (el === null) {
      return
    }
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      // return document.querySelector(el)
      return null
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    // console.log(" navbarlinks ", navbarlinks);
    if (!navbarlinks) return
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 10
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function (e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        aos_init();
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfokio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      1200: {
        slidesPerView: 3,
      }
    }
  });

  /**
   * Animation on scroll
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
    fetch('https://www.aiputing.com/releases/latest.json')
      .then(response => {
        // 检查网络请求是否成功
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // 将响应转换为 JSON 格式
        return response.json();
      })
      .then(data => {
        data.version;
        // 将data.version 写入到界面中通过id
        // document.getElementById("version").innerHTML = "最新版本 " + data.version;
      });
  });

  on('click', '.link-button,.platform-link', function (e) {
    // 定义一个变量来存储加载的 JSON 数据
    let versions;

    // 使用 fetch 进行异步请求
    fetch('https://www.aiputing.com/releases/latest.json')
      .then(response => {
        // 检查网络请求是否成功
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // 将响应转换为 JSON 格式
        return response.json();
      })
      .then(data => {
        // 将加载的 JSON 数据存储到变量 jsonData 中
        versions = data;
        // 在这里可以继续使用 jsonData 变量进行后续操作
        console.log(versions);
        // 如何获取html data-os 属性值
        var dataOs = this.getAttribute('data-os');
        var dataArch = this.getAttribute('data-arch');
        // 判断系统是什么系统什么版本下载对应的软件
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
          window.location.href = "https://www.pgyer.com/5Q1L";
        }
        if (isiOS) {
          window.location.href = "https://www.pgyer.com/5Q1L";
        }
        // Windows x86 64

        var platform = navigator.platform.toLowerCase();
        var userAgent = navigator.userAgent.toLowerCase();

        let os = "unknown";
        let arch = "unknown";

        if (platform.includes("win")) {
          os = "windows";
          arch = userAgent.includes("wow64") || userAgent.includes("win64")
            ? "x86_64"
            : "x86"; // 32-bit Windows or 64-bit Windows
        } else if (platform.includes("mac") || platform.includes("darwin")) {
          os = "darwin";
          arch = userAgent.includes("arm") ? "aarch64" : "x86_64"; // Apple Silicon (M1) or Intel
        } else if (platform.includes("linux")) {
          os = "linux";
          arch = userAgent.includes("arm64") ? "aarch64" : "x86_64"; // ARM64 or x86_64
        }

        console.log(os + "-" + arch);
        if (dataArch == "auto") {
          if (dataOs == "win" && arch == "x86_64") {
            window.open(versions.install["windows-x86_64"], "_blank");
          }
          if (dataOs == "win" && arch == "aarch64") {
            window.open(versions.install["windows-aarch64"], "_blank");
          }
          if (dataOs == "mac" && arch == "x86_64") {
            window.open(versions.install["darwin-x86_64"], "_blank");
          }
          if (dataOs == "mac" && arch == "aarch64") {
            window.open(versions.install["darwin-aarch64"], "_blank");
          }
          if (dataOs == "linux64_deb" && arch == "x86_64") {
            window.location.href = versions.install["linux-deb-x86_64"];
          }
          if (dataOs == "linux64_deb" && arch == "aarch64") {
            window.location.href = versions.install["linux-deb-aarch64"];
          }

          if (dataOs == "linux64_rpm" && arch == "x86_64") {
            window.location.href = versions.install["linux-rpm-x86_64"];
          }
          if (dataOs == "linux64_rpm" && arch == "aarch64") {
            window.location.href = versions.install["linux-rpm-aarch64"];
          }

        } else {
          if (dataOs == "win64user" && dataArch == "x86_64") {
            window.location.href = versions.install["windows-x86_64"];
          }
          if (dataOs == "win32arm64user" && dataArch == "aarch64") {
            window.location.href = versions.install["windows-aarch64"];
          }

          if (dataOs == "winzip" && dataArch == "x86_64") {
            window.location.href = versions.platforms["windows-x86_64"].url;
          }
          if (dataOs == "win32arm64zip" && dataArch == "aarch64") {
            window.location.href = versions.platforms["windows-aarch64"].url;
          }


          if (dataOs == "darwinx64" && dataArch == "x86_64") {
            window.location.href = versions.install["darwin-x86_64"];
          }
          if (dataOs == "darwinarm64" && dataArch == "aarch64") {
            window.location.href = versions.install["darwin-aarch64"];
          }

          if (dataOs == "darwinx64tar" && dataArch == "x86_64") {
            window.location.href = versions.platforms["darwin-x86_64"].url;
          }
          if (dataOs == "darwinarm64tar" && dataArch == "aarch64") {
            window.location.href = versions.platforms["darwin-aarch64"].url;
          }


          if (dataOs == "linux64_deb" && dataArch == "x86_64") {
            window.location.href = versions.install["linux-deb-x86_64"];
          }
          if (dataOs == "linuxarm64_deb" && dataArch == "aarch64") {
            window.location.href = versions.install["linux-deb-aarch64"];
          }

          if (dataOs == "linux64_rpm" && dataArch == "x86_64") {
            window.location.href = versions.isntall["linux-rpm-x86_64"];
          }
          if (dataOs == "linuxarm64_rpm" && dataArch == "aarch64") {
            window.location.href = versions.install["linux-rpm-aarch64"];
          }


          if (dataOs == "linux64tar" && dataArch == "x86_64") {
            window.location.href = versions.platforms["linux-x86_64"].url;
          }
          if (dataOs == "linuxarm64tar" && dataArch == "aarch64") {
            window.location.href = versions.platforms["linux-aarch64"].url;
          }

        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });




    //  alert("This is a link button");
  }, true);

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})();