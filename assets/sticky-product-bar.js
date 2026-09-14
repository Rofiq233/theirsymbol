/* =========================================================
   EVO STICKY PRODUCT BAR
   ========================================================= */

if (!customElements.get('sticky-product-bar')) {
  class StickyProductBar extends HTMLElement {

    constructor() {
      super();

      this.currentVariant = null;
      this.threshold = Number(this.dataset.threshold) || 300;
    }


    connectedCallback() {
      this.variantData = this.querySelector('[data-product-variants]');

      this.variantInputs = this.querySelectorAll('[data-variant-input]');
      this.variantCards = this.querySelectorAll('[data-variant-card]');

      this.productPrice = this.querySelector('[data-product-price]');
      this.addButton = this.querySelector('[data-add-to-cart]');
      this.addLabel = this.querySelector('.sticky-product-bar__add-label');
      this.addPrice = this.querySelector('[data-add-price]');

      this.loadVariants();
      this.bindEvents();
      this.handleScroll();

      window.addEventListener(
        'scroll',
        this.handleScroll.bind(this),
        { passive: true }
      );
    }


    /* =======================================================
       LOAD VARIANTS
       ======================================================= */

    loadVariants() {
      if (!this.variantData) return;

      try {
        this.variants = JSON.parse(
          this.variantData.textContent
        );
      } catch (error) {
        console.error(
          'Sticky Product Bar:',
          error
        );

        this.variants = [];
      }

      const selectedInput = this.querySelector(
        '[data-variant-input]:checked'
      );

      if (selectedInput) {
        this.setVariant(
          Number(selectedInput.value)
        );
      }
    }


    /* =======================================================
       EVENTS
       ======================================================= */

    bindEvents() {

      this.variantInputs.forEach((input) => {

        input.addEventListener(
          'change',
          () => {

            this.setVariant(
              Number(input.value)
            );

          }
        );

      });


      if (this.addButton) {

        this.addButton.addEventListener(
          'click',
          () => {
            this.handleAddToCart();
          }
        );

      }
    }


    /* =======================================================
       SCROLL
       ======================================================= */

    handleScroll() {

      if (window.scrollY >= this.threshold) {

        this.classList.add('is-visible');

      } else {

        this.classList.remove('is-visible');

      }
    }


    /* =======================================================
       SET VARIANT
       ======================================================= */

    setVariant(variantId) {

      const variant = this.variants.find(
        (item) => item.id === variantId
      );

      if (!variant) return;

      this.currentVariant = variant;

      this.updateVariantCards();

      this.updateProductPrice();

      this.updateAddButton();
    }


    /* =======================================================
       UPDATE ACTIVE CARD
       ======================================================= */

    updateVariantCards() {

      this.variantCards.forEach((card) => {

        const cardVariantId = Number(
          card.dataset.variantId
        );

        card.classList.toggle(
          'is-selected',
          cardVariantId === this.currentVariant.id
        );

      });


      this.variantInputs.forEach((input) => {

        input.checked =
          Number(input.value) ===
          this.currentVariant.id;

      });
    }


    /* =======================================================
       UPDATE PRODUCT PRICE
       ======================================================= */

    updateProductPrice() {

      if (!this.productPrice) return;

      this.productPrice.textContent =
        this.formatMoney(
          this.currentVariant.price
        );
    }


    /* =======================================================
       UPDATE ADD BUTTON
       ======================================================= */

    updateAddButton() {

      if (!this.addButton) return;

      if (!this.currentVariant.available) {

        this.addButton.disabled = true;

        if (this.addLabel) {
          this.addLabel.textContent = 'Sold Out';
        }

        if (this.addPrice) {
          this.addPrice.textContent = '';
        }

        return;
      }


      this.addButton.disabled = false;

      if (this.addLabel) {
        this.addLabel.textContent = 'Add to Cart';
      }

      if (this.addPrice) {
        this.addPrice.textContent =
          this.formatMoney(
            this.currentVariant.price
          );
      }
    }


    /* =======================================================
       ADD TO CART
       ======================================================= */

    async handleAddToCart() {

      if (
        !this.currentVariant ||
        !this.currentVariant.available ||
        !this.addButton
      ) {
        return;
      }


      const cartDrawer =
        document.querySelector('cart-drawer');


      if (!cartDrawer) {

        console.error(
          'Dawn cart drawer not found.'
        );

        return;
      }


      const originalLabel =
        this.addLabel
          ? this.addLabel.textContent
          : 'Add to Cart';


      try {

        this.addButton.disabled = true;


        if (this.addLabel) {
          this.addLabel.textContent = 'Adding...';
        }


        /*
         * Dawn needs the sections that should be
         * re-rendered after adding the product.
         */

        const sectionsToRender =
          typeof cartDrawer.getSectionsToRender === 'function'
            ? cartDrawer
                .getSectionsToRender()
                .map(
                  (section) => section.id
                )
            : [];


        /*
         * Important for Dawn focus handling.
         */

        if (
          typeof cartDrawer.setActiveElement ===
          'function'
        ) {
          cartDrawer.setActiveElement(
            this.addButton
          );
        }


        const response = await fetch(
          window.Shopify.routes.root +
            'cart/add.js',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              'Accept':
                'application/json'
            },

            body: JSON.stringify({

              items: [
                {
                  id: this.currentVariant.id,
                  quantity: 1
                }
              ],

              sections:
                sectionsToRender,

              sections_url:
                window.location.pathname

            })
          }
        );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.description ||
            data.message ||
            'Unable to add product.'
          );
        }


        /*
         * IMPORTANT:
         *
         * Dawn's cart drawer starts with
         * "is-empty" when the cart is empty.
         *
         * Remove it BEFORE renderContents()
         * so Dawn's focus trap gets #CartDrawer
         * instead of null.
         */

        cartDrawer.classList.remove(
          'is-empty'
        );


        if (
          typeof cartDrawer.renderContents ===
          'function'
        ) {

          cartDrawer.renderContents(
            data
          );

        }


        if (this.addLabel) {
          this.addLabel.textContent =
            'Added';
        }


        setTimeout(() => {

          if (this.addLabel) {
            this.addLabel.textContent =
              originalLabel;
          }

          this.addButton.disabled = false;

        }, 1200);


      } catch (error) {

        console.error(
          'Sticky Product Bar:',
          error
        );


        if (this.addLabel) {
          this.addLabel.textContent =
            'Try Again';
        }


        this.addButton.disabled = false;


        setTimeout(() => {

          if (this.addLabel) {
            this.addLabel.textContent =
              originalLabel;
          }

        }, 1500);
      }
    }


    /* =======================================================
       MONEY FORMAT
       ======================================================= */

    formatMoney(cents) {

      if (
        window.Shopify &&
        typeof Shopify.formatMoney ===
          'function'
      ) {

        return Shopify.formatMoney(
          cents,
          window.theme?.moneyFormat ||
            '${{amount}}'
        );

      }


      return '$' +
        (Number(cents) / 100)
          .toFixed(2);
    }

  }


  customElements.define(
    'sticky-product-bar',
    StickyProductBar
  );
}