class RealPeopleImpact extends HTMLElement {

  constructor() {
    super();

    this.counters = [];
    this.hasStarted = false;

    // Counter animation duration
    this.duration = 1800;
  }


  connectedCallback() {

    this.counters = this.querySelectorAll(
      "[data-counter]"
    );

    if (!this.counters.length) {
      return;
    }

    this.setupObserver();
  }


  /*
   * Start counter when section
   * enters the viewport
   */

  setupObserver() {

    const observer = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          if (this.hasStarted) {
            return;
          }

          this.hasStarted = true;

          this.startCounters();

          observer.unobserve(this);

        });

      },
      {
        threshold: 0.25
      }
    );


    observer.observe(this);
  }


  /*
   * Start all counters
   */

  startCounters() {

    this.counters.forEach((counter) => {

      this.animateCounter(counter);

    });

  }


  /*
   * Animate individual counter
   */

  animateCounter(counter) {

    const valueElement =
      counter.querySelector(
        ".real-people-impact__number-value"
      );


    if (!valueElement) {
      return;
    }


    /*
     * Get target number
     */

    const target = Number(
      counter.dataset.target
    );


    /*
     * Get prefix and suffix
     */

    const prefix =
      counter.dataset.prefix || "";

    const suffix =
      counter.dataset.suffix || "";


    /*
     * Check invalid number
     */

    if (Number.isNaN(target)) {

      valueElement.textContent =
        prefix + "0" + suffix;

      return;
    }


    /*
     * Animation start time
     */

    const startTime =
      performance.now();


    /*
     * Update counter
     */

    const updateCounter = (currentTime) => {

      const elapsed =
        currentTime - startTime;


      /*
       * Progress:
       * 0 → 1
       */

      const progress =
        Math.min(
          elapsed / this.duration,
          1
        );


      /*
       * Ease-out effect
       *
       * Start fast
       * Finish slowly
       */

      const easedProgress =
        1 -
        Math.pow(
          1 - progress,
          3
        );


      /*
       * Calculate current number
       */

      const currentValue =
        Math.floor(
          target * easedProgress
        );


      /*
       * Update HTML
       */

      valueElement.textContent =
        prefix +
        this.formatNumber(currentValue) +
        suffix;


      /*
       * Continue animation
       */

      if (progress < 1) {

        requestAnimationFrame(
          updateCounter
        );

      } else {

        /*
         * Make sure final number
         * is exactly the target
         */

        valueElement.textContent =
          prefix +
          this.formatNumber(target) +
          suffix;

      }

    };


    /*
     * Start animation
     */

    requestAnimationFrame(
      updateCounter
    );
  }


  /*
   * Format number
   *
   * 5980 → 5,980
   * 8420 → 8,420
   * 126300 → 126,300
   */

  formatNumber(number) {

    return new Intl.NumberFormat(
      "en-US"
    ).format(number);

  }

}


/*
 * Register Web Component
 *
 * Prevent duplicate custom element error
 */

if (
  !customElements.get(
    "real-people-impact"
  )
) {

  customElements.define(
    "real-people-impact",
    RealPeopleImpact
  );

}