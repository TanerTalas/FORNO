class FornoFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="border-t border-charcoal bg-bg">
        <div class="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-6 px-5 py-10 text-center md:grid-cols-3 md:gap-4 md:px-8 md:text-left lg:px-12">
          <div class="flex justify-center md:justify-start">
            <a href="index.html" aria-label="FORNO — home">
              <img src="assets/img/logo/logo.svg" alt="FORNO" width="110" height="26" class="h-6 w-auto">
            </a>
          </div>

          <p class="font-body text-sm text-cream-muted">
            We don't store any of your data.
          </p>

          <p class="font-body text-xs text-cream-muted md:text-right">
            &copy; ${year} FORNO. All rights reserved.
          </p>
        </div>
      </footer>
    `;
  }
}

customElements.define("forno-footer", FornoFooter);
