/* =========================================================
   IMAGE WITH ARROW
   ========================================================= */

if (!customElements.get('image-with-arrow')) {

  class ImageWithArrow extends HTMLElement {

    constructor() {
      super();

      this.slider = null;
      this.slides = [];
      this.dots = [];

      this.isSliderMode = false;
    }


    /* =======================================================
       CONNECTED
       ======================================================= */

    connectedCallback() {

      this.slider =
        this.querySelector(
          '[data-image-with-arrow-slider]'
        );

      this.slides = [
        ...this.querySelectorAll(
          '[data-image-with-arrow-slide]'
        )
      ];

      this.dots = [
        ...this.querySelectorAll(
          '[data-image-with-arrow-dot]'
        )
      ];


      if (!this.slider || this.slides.length < 2) {
        return;
      }


      this.bindEvents();

      this.updateSliderMode();

      this.updateActiveDot();


      this.handleResize =
        this.handleResize.bind(this);

      window.addEventListener(
        'resize',
        this.handleResize
      );
    }


    /* =======================================================
       EVENTS
       ======================================================= */

    bindEvents() {

      /*
       * Dot click
       */

      this.dots.forEach((dot) => {

        dot.addEventListener(
          'click',
          () => {

            const index =
              Number(
                dot.dataset.imageWithArrowDot
              );

            this.goToSlide(index);

          }
        );

      });


      /*
       * Native horizontal scroll
       */

      this.slider.addEventListener(
        'scroll',
        () => {
          this.updateActiveDot();
        },
        {
          passive: true
        }
      );
    }


    /* =======================================================
       SLIDER MODE
       ======================================================= */

    updateSliderMode() {

      this.isSliderMode =
        window.matchMedia(
          '(max-width: 1199px)'
        ).matches;


      if (!this.isSliderMode) {

        this.dots.forEach((dot) => {

          dot.classList.remove(
            'is-active'
          );

        });

        return;
      }


      this.updateActiveDot();
    }


    /* =======================================================
       RESIZE
       ======================================================= */

    handleResize() {
      this.updateSliderMode();
    }


    /* =======================================================
       ACTIVE DOT
       ======================================================= */

    updateActiveDot() {

      if (
        !this.slider ||
        !this.isSliderMode
      ) {
        return;
      }


      const scrollLeft =
        this.slider.scrollLeft;


      let closestIndex = 0;

      let closestDistance =
        Infinity;


      this.slides.forEach(
        (slide, index) => {

          const distance =
            Math.abs(
              slide.offsetLeft -
              scrollLeft
            );


          if (
            distance <
            closestDistance
          ) {

            closestDistance =
              distance;

            closestIndex =
              index;

          }

        }
      );


      this.dots.forEach(
        (dot, index) => {

          dot.classList.toggle(
            'is-active',
            index === closestIndex
          );

        }
      );
    }


    /* =======================================================
       GO TO SLIDE
       ======================================================= */

    goToSlide(index) {

      if (!this.slider) {
        return;
      }


      const slide =
        this.slides[index];


      if (!slide) {
        return;
      }


      this.slider.scrollTo({

        left: slide.offsetLeft,

        behavior: 'smooth'

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


    /* =======================================================
       DISCONNECTED
       ======================================================= */

    disconnectedCallback() {

      if (this.handleResize) {

        window.removeEventListener(
          'resize',
          this.handleResize
        );

      }
    }

  }


  customElements.define(
    'image-with-arrow',
    ImageWithArrow
  );

}