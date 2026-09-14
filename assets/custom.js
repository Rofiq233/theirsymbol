var swiper = new Swiper('.product-gallery_thumbs', {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 5.5,
  freeMode: false,
  watchSlidesProgress: true,
});

var swiper2 = new Swiper('.product-gallery_main', {
  loop: true,
  spaceBetween: 10,

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  thumbs: {
    swiper: swiper,
  },

  on: {
    init: function () {
      updateGalleryCounter(this);
    },

    slideChange: function () {
      updateGalleryCounter(this);
    },
  },
});

function updateGalleryCounter(swiper) {
  var current = document.querySelector('.product-gallery__current');
  var total = document.querySelector('.product-gallery__total');

  if (!current || !total) return;

  var totalSlides = swiper.slides.filter(function (slide) {
    return !slide.classList.contains('swiper-slide-duplicate');
  }).length;

  var realIndex = swiper.realIndex + 1;

  current.textContent = realIndex;
  total.textContent = totalSlides;
}





swiper.on('click', function () {
  if (swiper.clickedIndex === undefined) return;

  var clickedIndex = swiper.clickedIndex;

  swiper.slideTo(clickedIndex);
});