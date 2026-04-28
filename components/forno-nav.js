class FornoNav extends HTMLElement {
  connectedCallback() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const isHome = path === "" || path === "index.html";
    const isMenu = path === "menu.html";

    const linkBase = "font-body text-sm font-medium transition-colors duration-fast";
    const linkIdle = "text-cream/80 hover:text-cream";
    const linkActive = "text-cream";

    this.innerHTML = `
      <header class="fixed inset-x-0 top-0 z-50 transition-colors duration-normal" data-nav-root>
        <div class="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-8 md:py-5 lg:px-12">
          <a href="index.html" class="flex items-center gap-3" aria-label="FORNO — home">
            <img src="assets/img/logo/logo.svg" alt="FORNO" width="120" height="28" class="h-7 w-auto md:h-8">
          </a>

          <nav class="hidden items-center gap-8 md:flex" aria-label="Primary">
            <a href="index.html" class="${linkBase} ${isHome ? linkActive : linkIdle}">Home</a>
            <a href="menu.html" class="${linkBase} ${isMenu ? linkActive : linkIdle}">Menu</a>
          </nav>

          <div class="flex items-center gap-3">
            <button
              type="button"
              data-book-trigger
              class="rounded-full bg-ember px-5 py-2.5 font-body text-sm font-semibold text-cream transition-colors duration-fast hover:bg-ember-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard"
            >BOOK</button>

            <button
              type="button"
              data-menu-toggle
              aria-expanded="false"
              aria-controls="forno-mobile-menu"
              aria-label="Open menu"
              class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal text-cream"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </div>

        <div
          id="forno-mobile-menu"
          data-mobile-menu
          hidden
          class="md:hidden border-t border-charcoal bg-bg-elevated"
        >
          <nav class="mx-auto flex max-w-[1280px] flex-col px-5 py-4" aria-label="Mobile">
            <a href="index.html" class="py-3 ${linkBase} ${isHome ? linkActive : linkIdle}">Home</a>
            <a href="menu.html" class="py-3 ${linkBase} ${isMenu ? linkActive : linkIdle}">Menu</a>
          </nav>
        </div>
      </header>
    `;

    this.#bind();
  }

  #bind() {
    const root = this.querySelector("[data-nav-root]");
    const bookBtn = this.querySelector("[data-book-trigger]");
    const menuBtn = this.querySelector("[data-menu-toggle]");
    const mobileMenu = this.querySelector("[data-mobile-menu]");

    bookBtn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("forno:book-open", { bubbles: true, composed: true }));
    });

    menuBtn.addEventListener("click", () => {
      const open = mobileMenu.hasAttribute("hidden");
      if (open) {
        mobileMenu.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
        menuBtn.setAttribute("aria-label", "Close menu");
      } else {
        mobileMenu.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    });

    const onScroll = () => {
      if (window.scrollY > 12) {
        root.classList.add("bg-bg/85", "backdrop-blur", "border-b", "border-charcoal");
      } else {
        root.classList.remove("bg-bg/85", "backdrop-blur", "border-b", "border-charcoal");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
}

customElements.define("forno-nav", FornoNav);
