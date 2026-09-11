/* =========================================================
   CUSTOMER STORIES SLIDER
   ========================================================= */

class CustomerStoriesSlider extends HTMLElement {

  constructor() {
    super();

    this.slider = null;
    this.prevButton = null;
    this.nextButton = null;
    this.pagination = null;

    this.cards = [];

    this.resizeTimer = null;
  }


  /* =======================================================
     CONNECTED
     ======================================================= */

  connectedCallback() {

    this.slider = this.querySelector('[data-slider]');
    this.prevButton = this.querySelector('[data-slider-prev]');
    this.nextButton = this.querySelector('[data-slider-next]');
    this.pagination = this.querySelector('[data-pagination]');

    if (!this.slider) return;

    this.cards = [
      ...this.slider.querySelectorAll(
        '.customer-stories__card'
      )
    ];

    if (!this.cards.length) return;

    this.bindEvents();

    this.createPagination();

    this.updateControls();
    this.updatePagination();
  }


  /* =======================================================
     EVENTS
     ======================================================= */

  bindEvents() {

    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.scrollPrevious();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.scrollNext();
      });
    }

    this.slider.addEventListener(
      'scroll',
      this.handleScroll.bind(this),
      { passive: true }
    );

    window.addEventListener(
      'resize',
      this.handleResize.bind(this)
    );
  }


  /* =======================================================
     VIEWPORT
     ======================================================= */

  isDesktop() {
    return window.innerWidth >= 1200;
  }

  isTablet() {
    return window.innerWidth >= 768 &&
      window.innerWidth < 1200;
  }

  isMobile() {
    return window.innerWidth < 768;
  }


  /* =======================================================
     LAYOUT
     ======================================================= */

  isSliderEnabled() {

  
    return true;
  }


  /* =======================================================
     NAVIGATION TYPE
     ======================================================= */

  getNavigation() {

    if (this.isDesktop()) {
      return this.dataset.desktopNavigation || 'arrows';
    }

    if (this.isTablet()) {
      return this.dataset.tabletNavigation || 'arrows';
    }

    return this.dataset.mobileNavigation || 'arrows';
  }


  /* =======================================================
     UPDATE CONTROLS
     ======================================================= */

  updateControls() {

    const sliderEnabled = this.isSliderEnabled();
    const navigation = this.getNavigation();

    if (!sliderEnabled) {
      this.hideNavigation();
      return;
    }

    if (navigation === 'none') {
      this.hideNavigation();
      return;
    }

    if (navigation === 'arrows') {
      this.showArrows();
      this.hidePagination();
      this.updateArrowState();
      return;
    }

    if (navigation === 'dots') {
      this.hideArrows();
      this.showPagination();
      this.updatePagination();
      return;
    }
  }


  /* =======================================================
     HIDE NAVIGATION
     ======================================================= */

  hideNavigation() {
    this.hideArrows();
    this.hidePagination();
  }


  /* =======================================================
     ARROWS
     ======================================================= */

  showArrows() {

    if (this.prevButton) {
      this.prevButton.style.display = 'flex';
    }

    if (this.nextButton) {
      this.nextButton.style.display = 'flex';
    }
  }


  hideArrows() {

    if (this.prevButton) {
      this.prevButton.style.display = 'none';
    }

    if (this.nextButton) {
      this.nextButton.style.display = 'none';
    }
  }


  /* =======================================================
     PAGINATION
     ======================================================= */

  showPagination() {

    if (this.pagination) {
      this.pagination.style.display = 'flex';
    }
  }


  hidePagination() {

    if (this.pagination) {
      this.pagination.style.display = 'none';
    }
  }


  createPagination() {

    if (!this.pagination) return;

    this.pagination.innerHTML = '';

    this.cards.forEach((card, index) => {

      const dot = document.createElement('button');

      dot.type = 'button';

      dot.className = 'customer-stories__pagination-dot';

      dot.setAttribute(
        'aria-label',
        `Go to story ${index + 1}`
      );

      dot.addEventListener('click', () => {
        this.scrollToCard(index);
      });

      this.pagination.appendChild(dot);
    });

    this.updatePagination();
  }


  /* =======================================================
     SCROLL TO CARD
     ======================================================= */

  scrollToCard(index) {

    const card = this.cards[index];

    if (!card) return;

    this.slider.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth'
    });
  }


  /* =======================================================
     SCROLL AMOUNT
     ======================================================= */

  getScrollAmount() {

    const card = this.cards[0];

    if (!card) {
      return this.slider.clientWidth;
    }

    const styles = window.getComputedStyle(this.slider);

    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    return card.offsetWidth + gap;
  }


  /* =======================================================
     PREVIOUS
     ======================================================= */

  scrollPrevious() {

    if (!this.isSliderEnabled()) return;

    this.slider.scrollBy({
      left: -this.getScrollAmount(),
      behavior: 'smooth'
    });
  }


  /* =======================================================
     NEXT
     ======================================================= */

  scrollNext() {

    if (!this.isSliderEnabled()) return;

    this.slider.scrollBy({
      left: this.getScrollAmount(),
      behavior: 'smooth'
    });
  }


  /* =======================================================
     ARROW STATE
     ======================================================= */

  updateArrowState() {

    if (!this.prevButton || !this.nextButton) return;

    const maxScroll =
      this.slider.scrollWidth -
      this.slider.clientWidth;

    const currentScroll = this.slider.scrollLeft;

    this.prevButton.classList.toggle(
      'is-disabled',
      currentScroll <= 2
    );

    this.nextButton.classList.toggle(
      'is-disabled',
      currentScroll >= maxScroll - 2
    );
  }


  /* =======================================================
     PAGINATION STATE
     ======================================================= */

  updatePagination() {

    if (!this.pagination) return;

    const dots = [
      ...this.pagination.querySelectorAll(
        '.customer-stories__pagination-dot'
      )
    ];

    if (!dots.length) return;

    let closestIndex = 0;
    let closestDistance = Infinity;

    this.cards.forEach((card, index) => {

      const distance = Math.abs(
        card.offsetLeft -
        this.slider.scrollLeft
      );

      if (distance < closestDistance) {

        closestDistance = distance;
        closestIndex = index;

      }

    });

    dots.forEach((dot, index) => {

      dot.classList.toggle(
        'is-active',
        index === closestIndex
      );

    });
  }


  /* =======================================================
     SCROLL
     ======================================================= */

  handleScroll() {

    if (!this.isSliderEnabled()) return;

    const navigation = this.getNavigation();

    if (navigation === 'arrows') {
      this.updateArrowState();
    }

    if (navigation === 'dots') {
      this.updatePagination();
    }
  }


  /* =======================================================
     RESIZE
     ======================================================= */

  handleResize() {

    clearTimeout(this.resizeTimer);

    this.resizeTimer = setTimeout(() => {

      this.cards = [
        ...this.slider.querySelectorAll(
          '.customer-stories__card'
        )
      ];

      this.updateControls();
      this.updatePagination();

    }, 150);
  }

}


/* =========================================================
   DEFINE CUSTOM ELEMENT
   ========================================================= */

if (!customElements.get('customer-stories-slider')) {

  customElements.define(
    'customer-stories-slider',
    CustomerStoriesSlider
  );

}