class FornoFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="border-t border-charcoal bg-bg">
        <div class="mx-auto max-w-[1280px] px-5 py-10 md:px-8 lg:px-12">

          <!-- Top row: logo + nav links -->
          <div class="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
            <a href="index.html" aria-label="FORNO — home">
              <img src="assets/img/logo/logo.svg" alt="FORNO" width="110" height="26" draggable="false" class="h-6 w-auto">
            </a>

            <nav aria-label="Footer navigation">
              <ul class="flex items-center gap-8">
                <li>
                  <a href="index.html" class="font-body text-sm font-medium text-cream-muted transition-colors duration-fast hover:text-cream">Home</a>
                </li>
                <li>
                  <a href="menu.html" class="font-body text-sm font-medium text-cream-muted transition-colors duration-fast hover:text-cream">Menu</a>
                </li>
                <li>
                  <a href="index.html#contact" class="font-body text-sm font-medium text-cream-muted transition-colors duration-fast hover:text-cream">Contact</a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Divider -->
          <div class="my-6 border-t border-charcoal"></div>

          <!-- Bottom row: privacy note + copyright -->
          <div class="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
            <p class="font-body text-xs text-cream-muted">
              We don't store any of your data.
            </p>
            <p class="font-body text-xs text-cream-muted">
              &copy; ${year} FORNO. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    `;
  }
}

customElements.define("forno-footer", FornoFooter);
