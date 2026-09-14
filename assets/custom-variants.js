


// previews version 

// class ProductVariants extends HTMLElement {

//     connectedCallback() {

//         this.variantStyle = this.dataset.variantStyle;
//         // if (this.variantStyle == 'select') {
//         //     this.addEventListener('click', this.onClick);
//         // }
//         if (this.variantStyle == 'button') {
//             this.addEventListener("change", this.onChange);
//         }

//         this.variants = JSON.parse(this.querySelector('[data-product-variants]').textContent);
//         this.selling_plans = JSON.parse(this.querySelector('[data-selling-plan]').textContent);

//         const result = this.findVariant();

//         console.log(this.variants);


//         this.addToCartButton = this.closest(".sellers__item")?.querySelector("[data-add-to-cart]");
//         this.addToCartButton.addEventListener("click", this.addToCart);

//     }


//     addToCart = async () => {


//         try {
//             this.addToCartButton.querySelector("span").style.display = "none"
//             this.addToCartButton.querySelector(".loader").classList.add("loader-show")



//             const variant = this.findVariant();
//             console.log(variant);
//             if (!variant) {
//                 return;

//             }
//             const sellingPlans = this.querySelector('selling-plans');
//             const sellingPlanId = sellingPlans?.sellingPlanId;

//             const item = {

//                 id: variant.id,
//                 quantity: 1
//             }

//             if (sellingPlanId) {
//                 item.selling_plan = sellingPlanId
//             }

//             const response = await fetch("/cart/add.js", {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': "application/json"
//                 },
//                 body: JSON.stringify({
//                     items: [item]
//                 })
//             });
//             console.log(response)

//         } catch (error) {
//             console.log(error)
//         } finally {
//             this.addToCartButton.querySelector("span").style.display = "inline-block"
//             this.addToCartButton.querySelector(".loader").classList.remove("loader-show")
//         }





//     }








//     onChange = (e) => {
//         const input = e.target;
//         if (!input.matches(".product-variants__input")) {
//             return;
//         }

//         const selectedOptions = this.getSelectedOptions();

//         this.updateAvailableOptions(selectedOptions);

//         const variant = this.findVariant();
//         if (!variant) {
//             return;
//         }


//         this.updatePrice(variant);
//         this.updateImage(variant);
//     }


//     getSelectedOptions = () => {

//         if (this.variantStyle == 'button') {
//             return [...this.querySelectorAll(".product-variants__input:checked")].map(input => input.value);

//         }

//         return [];

//     }


//     findVariant = () => {

//         const selectedOptions = this.getSelectedOptions();
//         console.log(this.variants)
//         if (this.variants.length === 1) {
//             return this.variants[0]
//         }
//         return this.variants.find((variant) => {
//             return variant.options.every((option, index) => {
//                 return option === selectedOptions[index]
//             })
//         })
//     }



//     updateImage = (variant) => {


//         const image = variant.featured_image;

//         if (!image) {
//             return;
//         }

//         const imageElement = this.closest('.sellers__item')?.querySelector('img');

//         if (!imageElement) {
//             return;
//         }

//         imageElement.src = image.src;

//         const widths = [200, 300, 400, 500];

//         imageElement.srcset = widths.map((width) => {
//             return `${image.src}&width=${width} ${width}w`;
//         }).join(', ');

//     };


//     updateAvailableOptions = (selectedOptions) => {

//         this.querySelectorAll(".product-variants__option").forEach((optionElement) => {

//             const optionPosition = Number(optionElement.dataset.optionPosition);

//             const availableOptions = this.getAvailableOptions(selectedOptions, optionPosition);
//             optionElement.querySelectorAll(".product-variants__input").forEach((input) => {
//                 input.disabled = !availableOptions.includes(input.value);
//             })


//         })
//     }


//     getAvailableOptions = (selectedOptions, optionPosition) => {
//         return this.variants.filter((variant) => {
//             return variant.options.every((option, index) => {
//                 if (index + 1 == optionPosition) {
//                     return true;
//                 }
//                 return !selectedOptions[index] || option === selectedOptions[index];
//             })
//         }).map((variant) => {
//             return variant.options[optionPosition - 1];
//         })

//     }


//     updatePrice = (variant) => {

//         const priceElement = this.closest('.sellers__item')?.querySelector('.sellers__item-price');
//         const variant_prce = this.closest('.sellers__item')?.querySelector('.variant_price');
//         if (!priceElement) {
//             return;
//         }
//         priceElement.innerText = Shopify.formatMoney(variant.price, Shopify.money_format);
//         variant_prce.innerText = Shopify.formatMoney(variant.price, Shopify.money_format);

//     };





// }


// if (!customElements.get('product-variants')) {
//     customElements.define(
//         'product-variants',
//         ProductVariants
//     );
// }


// class SellingPlans extends HTMLElement {

//     connectedCallback() {
//         this.sellingPlanId = null;
//         this.oneTime = this.querySelector('[value="one-time"]');
//         this.subscription = this.querySelector('[data-subscription]');
//         this.select = this.subscription?.querySelector('select');

//         this.addEventListener('click', this.onClick);
//         this.select?.addEventListener("change", this.selectSubsValue);
//         this.setDefaultPlan();
//     }

//     onClick = (event) => {

//         const onTime = event.target.closest('.ontime_wrap');
//         const subscription = event.target.closest('[data-subscription]');

//         if (onTime) {
//             this.selectOneTime();
//             return;
//         }

//         if (subscription) {
//             this.selectSubscription();
//         }

//     };

//     selectOneTime = () => {

//         if (this.oneTime.checked) {
//             return;
//         }
//         this.sellingPlanId = null;
//         this.oneTime.checked = true;

//         this.subscription.classList.remove('is-open');
//         this.select.hidden = true;

//     };

//     selectSubscription = () => {

//         if (this.subscription.classList.contains('is-open')) {
//             return;
//         }

//         this.oneTime.checked = false;

//         this.subscription.classList.add('is-open');
//         this.select.hidden = false;
//         this.selectSubsValue();

//     };


//     setDefaultPlan = () => {

//         if (!this.select) {
//             return;
//         }
//         this.select.value = this.select.options[0].value;
//         this.sellingPlanId = this.select.value;

//         this.updatePlanPrice();
//     };






//     selectSubsValue = () => {
//         const selectedId = this.select.value;
//         this.sellingPlanId = selectedId;
//         this.updatePlanPrice();
//     }


//     updatePlanPrice = () => {

//         const selectedOption = this.select.options[this.select.selectedIndex];

//         const selectedId = selectedOption.value;

//         const productVariants = this.closest("product-variants");


//         const plan = productVariants.selling_plans[0]?.selling_plans?.find(plan => String(plan.id) === String(selectedId));

//         const variant = productVariants.findVariant();
//         console.log(variant.price);

//         const price = this.calculateSellingPlanPrice(variant, plan);

//         this.querySelector('.subscription_sale_price').innerText = Shopify.formatMoney(price, Shopify.money_format);



//         // JSON থেকে এই plan খুঁজে বের করবো
//         // তারপর price_adjustments দেখে
//         // automatically price calculate করবো

//     };



//     calculateSellingPlanPrice = (variant, plan) => {
//         const adjustment = plan.price_adjustments[0];
//         console.log(plan.price_adjustments[0])

//         if (adjustment.value_type === "percentage") {
//             return variant.price - (variant.price * adjustment.value / 100);
//         }

//         if (adjustment.value_type === "fixed_amount") {
//             return variant.price - adjustment.value;
//         }

//         if (adjustment.value_type === "price") {
//             return adjustment.value;
//         }

//         return variant.price;
//     };




// }

// if (!customElements.get('selling-plans')) {
//     customElements.define('selling-plans', SellingPlans);
// }




// version 2 



// class ProductVariants extends HTMLElement {
//     connectedCallback() {
//         this.variantStyle = this.dataset.variantStyle;
//         this.button = this.querySelector(".product-variants__input");
//         if (this.variantStyle == 'button') {
//             this.addEventListener("change", this.onChange)
//         }
//         this.variants = JSON.parse(this.querySelector('[data-product-variants]').textContent);
//         console.log(this.variants);
//     }


//     // onchange variant 

//     onChange = (e) => {
//         const input = e.target;
//         if (!input.matches(".product-variants__input")) {
//             return;
//         }
//         const selectedOption = this.selectedOptions();
//         // const variant = this.findVariant();
//         this.updateAvailableOptions(selectedOption);


//     }



//     selectedOptions = () => {

//         return [...this.querySelectorAll(".product-variants__input:checked")].map((input) => input.value);
//     }

//     findVariant = () => {
//         const selectedOption = this.selectedOptions();
//         return this.variants.find((variant) => {
//             return variant.options.every((option, index) => {
//                 return option === selectedOption[index];
//             })

//         })
//     }

//     updateAvailableOptions = (selectedOption) => {
//         this.querySelectorAll(".product-variants__option").forEach((optionElement) => {
//             const optionPosition = Number(optionElement.dataset.optionPosition);

//             const availableOptions = this.getAvailableOptions(selectedOption, optionPosition);
//             optionElement.querySelectorAll(".product-variants__input").forEach((input) => {
//                 input.disabled = !availableOptions.includes(input.value);
//             })

//         })
//     }

//     getAvailableOptions = (selectedOptions, optionPosition) => {
//         return this.variants.filter((variant) => {
//             return variant.options.every((option, index) => {
//                 if (index + 1 == optionPosition) {
//                     return true;
//                 }
//                 return !selectedOptions[index] || option === selectedOptions[index];
//             })
//         }).map((variant) => {
//             return variant.options[optionPosition - 1];
//         })

//     }
//     variantAvailable = () => {
//         const variant = this.findVariant();
//           const inputs = this.querySelectorAll('.product-variants__input');
//           inputs.forEach((input)=>{
//               if (!variant?.available) {
//                 input.disabled = true;
//               }else{
//                  input.disabled = false;
//               }

//           })

//     }  

// }

// if (!customElements.get("product-variants")) {
//     customElements.define("product-variants", ProductVariants)
// }






Shopify.money_format = Shopify.money_format || "${{amount}}";
Shopify.formatMoney = (cents, format) => {
    if (typeof cents === 'string') {
        cents = cents.replace('.', '');
    }
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || Shopify.money_format;
    const defaultOption = (option, defaultValue) => {
        return typeof option === 'undefined' ? defaultValue : option;
    };
    const formatWithDelimiters = (number, precision, thousands, decimal) => {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal = defaultOption(decimal, '.');
        if (isNaN(number) || number == null) {
            return 0;
        }
        number = (number / 100.0).toFixed(precision);
        const parts = number.split('.');
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
        const cents = parts[1] ? (decimal + parts[1]) : '';
        return dollars + cents;
    };
    const match = formatString.match(placeholderRegex);
    if (!match) {
        return formatString;
    }
    let value = '';
    switch (match[1]) {
        case 'amount':
            value = formatWithDelimiters(cents, 2);
            break;
        case 'amount_no_decimals':
            value = formatWithDelimiters(cents, 0);
            break;
        case 'amount_with_comma_separator':
            value = formatWithDelimiters(cents, 2, '.', ',');
            break;
        case 'amount_no_decimals_with_comma_separator':
            value = formatWithDelimiters(cents, 0, '.', ',');
            break;
    }
    return formatString.replace(placeholderRegex, value);
};










class CustomProductVariants extends HTMLElement {

    connectedCallback() {

        console.log("Connected!!!");

        this.button = this.querySelector(".product-variants__input");

        this.addEventListener("change", this.onChange);


        this.variants = JSON.parse(
            this.querySelector('[data-product-variantss]').textContent
        );


        const variant = this.findVariant();
        // this.updatePrice(variant);
    }


    // // onchange variant

    onChange = (e) => {

        const input = e.target;

        if (!input.matches(".product-variants__input")) {
            return;
        }

        const variant = this.findVariant();
        this.updateURL(variant);

        let variantValueSet = document.querySelector(".product-buy__purchase").querySelector('[name="id"]');

        variantValueSet.value = variant.id;

        document.querySelector(".product-buy__price").innerText = Shopify.formatMoney(variant.price, Shopify.money_format);

    }


    updateURL = (variant) => {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url.toString());
    };

    selectedOptions = () => {
        return [...this.querySelectorAll(".product-variants__input:checked")].map((input) => input.value);
    }

    findVariant = () => {

        const selectedOption = this.selectedOptions();

        return this.variants.find((variant) => {

            return variant.options.every((option, index) => {

                return option === selectedOption[index];

            });

        });

    }
}

if (!customElements.get("custom-variants")) {

    customElements.define(
        "custom-variants",
        CustomProductVariants
    );
}






// class ProductForm extends HTMLElement {

//     connectedCallback() {
//         this.form = this.querySelector("form");
//         this.addBtn = this.querySelector("button");
//         this.variantInput = this.querySelector('[name="id"]');
//         this.loader = this.addBtn.querySelector(".loader");
//         if (!this.form) {
//             return;
//         }
//         this.form.addEventListener("submit", this.addToCart);

//     }

//     addToCart = async (e) => {



//         const cartDrawer = document.querySelector("cart-drawer");
//         console.log(cartDrawer);
//         e.preventDefault();
//         this.addBtn.querySelector("span").style.display = 'none';
//         this.loader.classList.add("loader-show")
//         let variant;

//         const productCard = this.closest("product-card");
//         const productVariants = productCard?.querySelector("product-variants");
//         if (productVariants) {
//             variant = productVariants.findVariant();
//         } else {
//             variant = {
//                 id: this.variantInput.value
//             };
//         }

//         this.variantInput.value = variant.id;
//         const formData = new FormData(this.form);


//         try {
//             const response = await fetch("/cart/add.js", {
//                 method: "POST",
//                 body: formData
//             })
//             if (!response.ok) {
//                 throw new Error("Product not added !")
//             }
//             cartDrawer?.open();

//         } catch (error) {
//             console.log(error.message)
//         } finally {
//             this.addBtn.querySelector("span").style.display = 'inline-block';
//             this.loader.classList.remove("loader-show");
//         }
//     }







// }

// if (!customElements.get("product-form")) {
//     customElements.define('product-form', ProductForm);
// }



























// getAvailableOptions = (selectedOptions, optionPosition) => {

//     return this.variants.filter((variant) => {
//         return variant.options.every((option, index) => {
//             if (index + 1 === optionPosition) {
//                 return true;
//             }

//             return !selectedOptions[index] || option === selectedOptions[index];

//         });

//     }).map((variant) => {
//         return variant.options[optionPosition - 1];

//     });
// };






// onChnage = (event) => {
//     const input = event.target;
//     if (!input.matches(".product-variants__input")) {
//         return;
//     }

//     const selectedOptions = this.getSelectedOptions();
//     this.updateAvailableOptions(selectedOptions);
//     const variant = this.findVariant();

//     if (!variant) {
//         return;
//     }
//     this.updateURL(variant);
// }

// updateAvailableOptions = (selectedOptions) => {
//     this.querySelectorAll('.product-variants__option').forEach((optionElement) => {
//         const optionPosition = Number(optionElement.dataset.optionPosition);
//         const availableOptions = this.getAvailableOptions(selectedOptions, optionPosition);
//         optionElement.querySelectorAll('.product-variants__input').forEach((input) => {
//             input.disabled = !availableOptions.includes(input.value);
//         });
//         optionElement.querySelectorAll('.product-variants__select-option').forEach((option) => {
//             const isAvailable = availableOptions.includes(option.dataset.optionValue);
//             option.toggleAttribute('disabled', !isAvailable);
//         });
//     });
// };

// setInitialVariant = () => {
//     const url = new URL(window.location.href);
//     const variantId = url.searchParams.get('variant');
//     if (!variantId) {
//         return;
//     }
//     const variant = this.variants.find((variant) => String(variant.id) === variantId);
//     if (!variant) {
//         return;
//     }
// };


// updateURL = (variant) => {
//     const url = new URL(window.location.href);
//     url.searchParams.set('variant', variant.id);
//     window.history.replaceState({}, '', url.toString());
// };

// onClick = (event) => {
//     const trigger = event.target.closest(".product-variants__select-trigger");
//     if (trigger) {
//         this.toggleSelect(trigger);
//         console.log(trigger)
//         return;
//     }
//     const option = event.target.closest('.product-variants__select-option');
//     if (option) {
//         this.selectOption(option);
//     }
// }

// toggleSelect = (trigger) => {
//     const select = trigger.closest('.product-variants__select');
//     const options = select.querySelector('.product-variants__options');
//     const isOpen = trigger.getAttribute('aria-expanded') === 'true';
//     trigger.setAttribute('aria-expanded', !isOpen);
//     options.hidden = isOpen;
// }

// selectOption = (option) => {
//     if (option.hasAttribute('disabled')) {
//         return;
//     }

//     const select = option.closest('.product-variants__select');
//     const trigger = select.querySelector('.product-variants__select-trigger');
//     const value = select.querySelector('.product-variants__select-value');

//     select.querySelectorAll(".product-variants__select-option").forEach((option) => {
//         option.removeAttribute("checked");
//     });

//     option.setAttribute("checked", "");
//     value.textContent = option.dataset.optionValue;
//     trigger.setAttribute('aria-expanded', 'false');
//     select.querySelector('.product-variants__options').hidden = true;
//     const selectedOptions = this.getSelectedOptions();
//     this.updateAvailableOptions(selectedOptions);
//     const variant = this.findVariant();

//     if (!variant) {
//         return;
//     }

//     this.updateURL(variant);
// };

// getSelectedOptions = () => {

//     if (this.variantStyle === 'select') {
//         return [...this.querySelectorAll(".product-variants__select-option[checked]")].map(input => input.dataset.optionValue)
//     }
//     if (this.variantStyle === 'button') {
//         return [...this.querySelectorAll(".product-variants__input:checked")].map(input => input.value);
//     }
//     return [];

// }



// findVariant = () => {
//     const selectedOptions = this.getSelectedOptions();
//     return this.variants.find((variant) => {

//         return variant.options.every((option, index) => {
//             return option === selectedOptions[index];
//         })
//     })
// }