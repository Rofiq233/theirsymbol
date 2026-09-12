/* =========================================================
   WATCH — FROM ELENA'S FAMILY
   WEB COMPONENT
   ========================================================= */

if (!customElements.get('watch-family-slider')) {

  class WatchFamilySlider extends HTMLElement {

    constructor() {
      super();

      this.track =
        this.querySelector('[data-track]');

      this.slides =
        Array.from(
          this.querySelectorAll('[data-slide]')
        );

      this.dots =
        Array.from(
          this.querySelectorAll('[data-dot]')
        );

      this.currentIndex = 0;

      this.visibleSlides = 3;

      this.resizeTimer = null;

      this.touchStartX = 0;

      this.touchEndX = 0;

      this.isTouching = false;
    }


    /* =====================================================
       CONNECTED CALLBACK
       ===================================================== */

    connectedCallback() {

      if (
        !this.track ||
        !this.slides.length
      ) {
        return;
      }


      this.setupVideos();

      this.setupSlider();

      this.setupDots();

      this.setupTouch();

      this.updateVisibleSlides();

      this.updateDots();

      this.updateSlider();
    }


    /* =====================================================
       VIDEO SETUP
       ===================================================== */

    setupVideos() {

      const cards =
        this.querySelectorAll(
          '[data-video-card]'
        );


      cards.forEach((card) => {

        const video =
          card.querySelector(
            '[data-video]'
          );

        const playButton =
          card.querySelector(
            '[data-play]'
          );

        const duration =
          card.querySelector(
            '[data-duration]'
          );


        if (!video) {
          return;
        }


        /* =================================================
           LOAD VIDEO DURATION
           ================================================= */

        video.addEventListener(
          'loadedmetadata',
          () => {

            if (
              Number.isFinite(
                video.duration
              ) &&
              video.duration > 0
            ) {

              if (duration) {

                duration.textContent =
                  this.formatDuration(
                    video.duration
                  );

              }

            }

          }
        );


        /*
         * Sometimes metadata is already loaded
         * before listener gets attached.
         */

        if (
          video.readyState >= 1 &&
          Number.isFinite(video.duration) &&
          video.duration > 0
        ) {

          if (duration) {

            duration.textContent =
              this.formatDuration(
                video.duration
              );

          }

        }


        /* =================================================
           PLAY
           ================================================= */

        video.addEventListener(
          'play',
          () => {

            this.pauseOtherVideos(
              video
            );


            card.classList.add(
              'is-playing'
            );

          }
        );


        /* =================================================
           PAUSE
           ================================================= */

        video.addEventListener(
          'pause',
          () => {

            card.classList.remove(
              'is-playing'
            );

          }
        );


        /* =================================================
           ENDED
           ================================================= */

        video.addEventListener(
          'ended',
          () => {

            card.classList.remove(
              'is-playing'
            );

            video.currentTime = 0;

          }
        );


        /* =================================================
           PLAY ICON CLICK
           ================================================= */

        if (playButton) {

          playButton.addEventListener(
            'click',
            (event) => {

              event.preventDefault();

              event.stopPropagation();

              this.playVideo(video);

            }
          );

        }


        /* =================================================
           VIDEO CLICK
           ================================================= */

        video.addEventListener(
          'click',
          (event) => {

            event.preventDefault();

            event.stopPropagation();


            if (video.paused) {

              this.playVideo(
                video
              );

            } else {

              video.pause();

            }

          }
        );


        /* =================================================
           CARD CLICK
           ================================================= */

        card.addEventListener(
          'click',
          (event) => {

            /*
             * Don't execute twice when
             * play button was clicked.
             */

            if (
              event.target.closest(
                '[data-play]'
              )
            ) {
              return;
            }


            /*
             * If clicking another area
             * of card, play video.
             */

            if (
              event.target === card
            ) {

              if (video.paused) {

                this.playVideo(
                  video
                );

              } else {

                video.pause();

              }

            }

          }
        );

      });
    }


    /* =====================================================
       PLAY VIDEO
       ===================================================== */

    playVideo(video) {

      if (!video) {
        return;
      }


      /*
       * Pause all other videos.
       */

      this.pauseOtherVideos(
        video
      );


      /*
       * Play selected video.
       */

      const playPromise =
        video.play();


      if (
        playPromise !== undefined
      ) {

        playPromise.catch(
          () => {
            /*
             * Browser playback
             * was prevented.
             */
          }
        );

      }
    }


    /* =====================================================
       PAUSE OTHER VIDEOS
       ===================================================== */

    pauseOtherVideos(
      currentVideo
    ) {

      const videos =
        this.querySelectorAll(
          '[data-video]'
        );


      videos.forEach(
        (video) => {

          if (
            video !== currentVideo &&
            !video.paused
          ) {

            video.pause();

          }

        }
      );
    }


    /* =====================================================
       FORMAT DURATION
       ===================================================== */

    formatDuration(
      totalSeconds
    ) {

      const seconds =
        Math.floor(
          totalSeconds
        );


      const minutes =
        Math.floor(
          seconds / 60
        );


      const remainingSeconds =
        seconds % 60;


      return (
        `${minutes}:` +
        `${String(
          remainingSeconds
        ).padStart(
          2,
          '0'
        )}`
      );
    }


    /* =====================================================
       SLIDER SETUP
       ===================================================== */

    setupSlider() {

      window.addEventListener(
        'resize',
        () => {

          clearTimeout(
            this.resizeTimer
          );


          this.resizeTimer =
            setTimeout(
              () => {

                this.updateVisibleSlides();

                this.updateDots();

                this.updateSlider();

              },
              120
            );

        }
      );
    }


    /* =====================================================
       UPDATE VISIBLE SLIDES
       ===================================================== */

    updateVisibleSlides() {

      const width =
        window.innerWidth;


      /*
       * Mobile
       */

      if (width <= 767) {

        this.visibleSlides = 1;

      }


      /*
       * Tablet
       */

      else if (width <= 991) {

        this.visibleSlides = 2;

      }


      /*
       * Desktop
       */

      else {

        this.visibleSlides = 3;

      }


      const maxIndex =
        this.getMaxIndex();


      if (
        this.currentIndex >
        maxIndex
      ) {

        this.currentIndex =
          maxIndex;

      }
    }


    /* =====================================================
       MAX INDEX
       ===================================================== */

    getMaxIndex() {

      return Math.max(
        0,
        this.slides.length -
        this.visibleSlides
      );
    }


    /* =====================================================
       DOT SETUP
       ===================================================== */

    setupDots() {

      this.dots.forEach(
        (dot) => {

          dot.addEventListener(
            'click',
            () => {

              if (
                window.innerWidth > 991
              ) {
                return;
              }


              const index =
                Number(
                  dot.dataset.dot
                );


              this.goTo(
                index
              );

            }
          );

        }
      );
    }


    /* =====================================================
       GO TO
       ===================================================== */

    goTo(index) {

      if (
        window.innerWidth > 991
      ) {
        return;
      }


      const maxIndex =
        this.getMaxIndex();


      this.currentIndex =
        Math.max(
          0,
          Math.min(
            index,
            maxIndex
          )
        );


      this.updateSlider();

      this.updateDots();
    }


    /* =====================================================
       UPDATE SLIDER
       ===================================================== */

    updateSlider() {

      /*
       * Desktop:
       * normal CSS grid.
       */

      if (
        window.innerWidth > 991
      ) {

        this.track.style.transform =
          'translate3d(0, 0, 0)';

        return;
      }


      const firstSlide =
        this.slides[0];


      if (!firstSlide) {
        return;
      }


      const slideWidth =
        firstSlide
          .getBoundingClientRect()
          .width;


      const styles =
        window.getComputedStyle(
          this.track
        );


      const gap =
        parseFloat(
          styles.columnGap
        ) ||
        parseFloat(
          styles.gap
        ) ||
        0;


      const move =
        (
          slideWidth +
          gap
        ) *
        this.currentIndex;


      this.track.style.transform =
        `translate3d(-${move}px, 0, 0)`;
    }


    /* =====================================================
       UPDATE DOTS
       ===================================================== */

    updateDots() {

      if (!this.dots.length) {
        return;
      }


      /*
       * Desktop:
       * no active dot.
       */

      if (
        window.innerWidth > 991
      ) {

        this.dots.forEach(
          (dot) => {

            dot.classList.remove(
              'is-active'
            );

            dot.hidden = true;

          }
        );

        return;
      }


      /*
       * Calculate page count.
       */

      const totalPages =
        Math.ceil(
          this.slides.length /
          this.visibleSlides
        );


      const currentPage =
        Math.floor(
          this.currentIndex /
          this.visibleSlides
        );


      this.dots.forEach(
        (dot, index) => {

          /*
           * Hide extra dots.
           */

          dot.hidden =
            index >= totalPages;


          /*
           * Active dot.
           */

          dot.classList.toggle(
            'is-active',
            index === currentPage
          );

        }
      );
    }


    /* =====================================================
       TOUCH / SWIPE
       ===================================================== */

    setupTouch() {

      this.track.addEventListener(
        'touchstart',
        (event) => {

          if (
            window.innerWidth > 991
          ) {
            return;
          }


          this.isTouching = true;


          this.touchStartX =
            event.touches[0].clientX;


          this.touchEndX =
            this.touchStartX;

        },
        {
          passive: true
        }
      );


      this.track.addEventListener(
        'touchmove',
        (event) => {

          if (
            !this.isTouching
          ) {
            return;
          }


          this.touchEndX =
            event.touches[0].clientX;

        },
        {
          passive: true
        }
      );


      this.track.addEventListener(
        'touchend',
        () => {

          if (
            !this.isTouching
          ) {
            return;
          }


          this.isTouching = false;


          const distance =
            this.touchStartX -
            this.touchEndX;


          const threshold = 50;


          /*
           * Swipe left
           */

          if (
            distance > threshold
          ) {

            this.goTo(
              this.currentIndex +
              this.visibleSlides
            );

          }


          /*
           * Swipe right
           */

          else if (
            distance < -threshold
          ) {

            this.goTo(
              this.currentIndex -
              this.visibleSlides
            );

          }

        }
      );
    }

  }


  customElements.define(
    'watch-family-slider',
    WatchFamilySlider
  );

}