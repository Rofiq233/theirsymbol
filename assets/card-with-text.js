/* =========================================================
   CARD WITH TEXT
   ========================================================= */

if (!customElements.get('card-with-text')) {

  class CardWithText extends HTMLElement {

    constructor() {
      super();

      this.slider = null;

      this.slides = [];

      this.dots = [];

      this.isSliderMode = false;

      this.handleResize =
        this.handleResize.bind(this);

      this.handleScroll =
        this.handleScroll.bind(this);
    }


    /* =====================================================
       CONNECTED
       ===================================================== */

    connectedCallback() {

      this.slider =
        this.querySelector(
          '[data-slider]'
        );


      this.slides =
        Array.from(
          this.querySelectorAll(
            '[data-slide]'
          )
        );


      this.dots =
        Array.from(
          this.querySelectorAll(
            '[data-dot]'
          )
        );


      if (!this.slider) {
        return;
      }


      this.bindEvents();

      this.updateSliderMode();

      this.updateActiveDot();
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    bindEvents() {

      window.addEventListener(
        'resize',
        this.handleResize
      );


      this.slider.addEventListener(
        'scroll',
        this.handleScroll,
        {
          passive: true
        }
      );


      this.dots.forEach(
        (dot) => {

          dot.addEventListener(
            'click',
            () => {

              const index =
                Number(
                  dot.dataset.dot
                );

              this.goToSlide(index);

            }
          );

        }
      );
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    handleResize() {

      this.updateSliderMode();

      this.updateActiveDot();
    }


    /* =====================================================
       SCROLL
       ===================================================== */

    handleScroll() {

      if (!this.isSliderMode) {
        return;
      }

      this.updateActiveDot();
    }


    /* =====================================================
       SLIDER MODE
       ===================================================== */

    updateSliderMode() {

      this.isSliderMode =
        window.matchMedia(
          '(max-width: 1199px)'
        ).matches;


      if (!this.isSliderMode) {

        this.dots.forEach(
          (dot, index) => {

            dot.classList.toggle(
              'is-active',
              index === 0
            );

          }
        );

        return;
      }


      this.updateActiveDot();
    }


    /* =====================================================
       ACTIVE DOT
       ===================================================== */

    updateActiveDot() {

      if (
        !this.isSliderMode ||
        !this.slider ||
        !this.slides.length
      ) {
        return;
      }


      let activeIndex = 0;

      let closestDistance =
        Infinity;


      this.slides.forEach(
        (slide, index) => {

          const distance =
            Math.abs(
              slide.offsetLeft -
              this.slider.scrollLeft
            );


          if (
            distance <
            closestDistance
          ) {

            closestDistance =
              distance;

            activeIndex =
              index;

          }

        }
      );


      this.dots.forEach(
        (dot, index) => {

          dot.classList.toggle(
            'is-active',
            index === activeIndex
          );

        }
      );
    }


    /* =====================================================
       GO TO SLIDE
       ===================================================== */

    goToSlide(index) {

      if (
        !this.isSliderMode ||
        !this.slider
      ) {
        return;
      }


      const slide =
        this.slides[index];


      if (!slide) {
        return;
      }


      this.slider.scrollTo({

        left:
          slide.offsetLeft,

        behavior:
          'smooth'

      });


      this.dots.forEach(
        (dot, dotIndex) => {

          dot.classList.toggle(
            'is-active',
            dotIndex === index
          );

        }
      );
    }


    /* =====================================================
       DISCONNECTED
       ===================================================== */

    disconnectedCallback() {

      window.removeEventListener(
        'resize',
        this.handleResize
      );


      if (this.slider) {

        this.slider.removeEventListener(
          'scroll',
          this.handleScroll
        );

      }
    }

  }
 

  customElements.define(
    'card-with-text',
    CardWithText
  );

}