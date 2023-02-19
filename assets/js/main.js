/**
 * Easy selector helper function
 */
const select = (el, all = false) => {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
};

/**
 * Easy event listener function
 */
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all);
  if (selectEl) {
    if (all) {
      selectEl.forEach((e) => e.addEventListener(type, listener));
    } else {
      selectEl.addEventListener(type, listener);
    }
  }
};

/**
 * Easy on scroll event listener
 */
const onscroll = (el, listener) => {
  el.addEventListener("scroll", listener);
};

/**
 * Navbar links active state on scroll
 */
let navbarlinks = select("#navbar .scrollto", true);
const navbarlinksActive = () => {
  let position = window.scrollY + 200;
  navbarlinks.forEach((navbarlink) => {
    if (!navbarlink.hash) return;
    let section = select(navbarlink.hash);
    if (!section) return;
    if (
      position >= section.offsetTop &&
      position <= section.offsetTop + section.offsetHeight
    ) {
      navbarlink.classList.add("active");
    } else {
      navbarlink.classList.remove("active");
    }
  });
};
window.addEventListener("load", navbarlinksActive);
onscroll(document, navbarlinksActive);

/**
 * Scrolls to an element with header offset
 */
const scrollto = (el) => {
  let header = select("#header");
  let offset = header.offsetHeight;

  let elementPos = select(el).offsetTop;
  window.scrollTo({
    top: elementPos - offset,
    behavior: "smooth",
  });
};

/**
 * Toggle .header-scrolled class to #header when page is scrolled
 */
let selectHeader = select("#header");
if (selectHeader) {
  const headerScrolled = () => {
    if (window.scrollY > 100) {
      selectHeader.classList.add("header-scrolled");
    } else {
      selectHeader.classList.remove("header-scrolled");
    }
  };
  window.addEventListener("load", headerScrolled);
  onscroll(document, headerScrolled);
}

/**
 * Back to top button
 */
let backtotop = select(".back-to-top");
if (backtotop) {
  const toggleBacktotop = () => {
    if (window.scrollY > 100) {
      backtotop.classList.add("active");
    } else {
      backtotop.classList.remove("active");
    }
  };
  window.addEventListener("load", toggleBacktotop);
  onscroll(document, toggleBacktotop);
}

/**
 * Mobile nav toggle
 */
on("click", ".mobile-nav-toggle", function (e) {
  select("#navbar").classList.toggle("navbar-mobile");
  this.classList.toggle("bi-list");
  this.classList.toggle("bi-x");
});

/**
 * Mobile nav dropdowns activate
 */
on(
  "click",
  ".navbar .dropdown > a",
  function (e) {
    if (select("#navbar").classList.contains("navbar-mobile")) {
      e.preventDefault();
      this.nextElementSibling.classList.toggle("dropdown-active");
    }
  },
  true
);

/**
 * Scrool with ofset on links with a class name .scrollto
 */
on(
  "click",
  ".scrollto",
  function (e) {
    if (select(this.hash)) {
      e.preventDefault();

      let navbar = select("#navbar");
      if (navbar.classList.contains("navbar-mobile")) {
        navbar.classList.remove("navbar-mobile");
        let navbarToggle = select(".mobile-nav-toggle");
        navbarToggle.classList.toggle("bi-list");
        navbarToggle.classList.toggle("bi-x");
      }
      scrollto(this.hash);
    }
  },
  true
);

/**
 * Scroll with ofset on page load with hash links in the url
 */
window.addEventListener("load", () => {
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  }
});

/**
 * Preloader
 */
let preloader = select("#preloader");
if (preloader) {
  window.addEventListener("load", () => {
    preloader.remove();
  });
}

window.addEventListener("load", () => {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });
});

let ahadisContainer = document.querySelector(".ahadisContainer"),
  next = document.querySelector(".buttons .next"),
  prev = document.querySelector(".buttons .prev"),
  number = document.querySelector(".buttons .number");
ahadith();
let index = 0;
function ahadith() {
  fetch("https://api.hadith.gading.dev/books/bukhari?range=1-300")
    .then((response) => response.json())
    .then((data) => {
      let hadiths = data.data.hadiths;
      // console.log(hadiths[index].arab);
      getHadith();
      next.addEventListener("click", () => {
        index == 299 ? (index = 0) : (index += 1);
        getHadith();
      });
      prev.addEventListener("click", () => {
        index == 0 ? (index = 299) : (index -= 1);
        getHadith();
      });
      function getHadith() {
        ahadisContainer.innerHTML = hadiths[index].arab;
        number.innerHTML = `300 - ${index + 1}`;
      }
    });
}
let sorasContainer = document.querySelector(".sorasContainer");

function getAllSowar() {
  fetch("http://api.alquran.cloud/v1/meta")
    .then((response) => response.json())
    .then((data) => {
      let surahs = data.data.surahs.references;
      for (let i = 0; i < 114; i++) {
        sorasContainer.innerHTML += ` <div class="soreh"
         type="button"
  data-bs-toggle="modal"
  data-bs-target="#staticBackdrop"">
            <p>${surahs[i].name}</p>
            <p>${surahs[i].englishName}</p>
          </div>`;
      }
      let surahtitle = document.querySelectorAll(".soreh");
      let modalBody = document.querySelector(".modal-body");
      surahtitle.forEach((title, index) => {
        title.addEventListener("click", () => {
          fetch(`http://api.alquran.cloud/v1/surah/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              modalBody.innerHTML = ``;
              let ayah = data.data.ayahs;
              ayah.forEach((ayah) => {
                modalBody.innerHTML += `<span>(${ayah.numberInSurah}) ${ayah.text}</span>`;
              });
            });
        });
      });
    });
}
getAllSowar();
let startButton = document.querySelector(".home1 .startButton1"),
  hadithSection = document.querySelector(".ahadis");
startButton.addEventListener("click", () => {
  hadithSection.scrollIntoView({
    behavior: "smooth",
  });
});

let cardes = document.querySelector(".cardes");
function getTimes() {
  fetch(
    `http://api.aladhan.com/v1/timingsByCity/19-02-2023?city=Dubai&country=United+Arab+Emirates&method=8`
  )
    .then((response) => response.json())
    .then((data) => {
      let timings = data.data.timings;
      cardes.innerHTML = "";
      for (let time in timings) {
        // console.log(timings[time]);
        // console.log(time);
        cardes.innerHTML += ` <div class="curd">
            <div class="circle">
              <svg>
                <circle cx="100" cy="100" r="100"></circle>
                <div class="time">${timings[time]}</div>
              </svg>
            </div>
            <p>${time}</p>
          </div>`;
      }
    });
}
getTimes();
