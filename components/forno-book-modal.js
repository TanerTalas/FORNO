class FornoBookModal extends HTMLElement {
  #lastFocus = null;

  connectedCallback() {
    this.innerHTML = `
      <dialog
        data-modal
        class="m-auto w-full max-w-[480px] rounded-2xl border border-charcoal bg-bg-elevated p-0 text-cream backdrop:bg-soot/70 backdrop:backdrop-blur-sm"
      >
        <form method="dialog" class="flex flex-col gap-5 p-6 md:p-8" data-form novalidate>
          <header class="flex items-start justify-between gap-4">
            <div>
              <p class="font-accent text-xl text-mustard">Reserve a table</p>
              <h2 class="font-display text-3xl text-cream">Book at FORNO</h2>
            </div>
            <button
              type="button"
              data-close
              aria-label="Close"
              class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal text-cream transition-colors duration-fast hover:bg-surface"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </header>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label class="flex flex-col gap-1.5 sm:col-span-2">
              <span class="font-body text-xs font-medium text-cream-muted">Name</span>
              <input required type="text" name="name" autocomplete="name"
                class="rounded-md border border-charcoal bg-surface px-3 py-2.5 font-body text-sm text-cream placeholder:text-cream-muted focus:border-ember focus:outline-none">
            </label>
            <label class="flex flex-col gap-1.5">
              <span class="font-body text-xs font-medium text-cream-muted">Date</span>
              <input required type="date" name="date"
                class="rounded-md border border-charcoal bg-surface px-3 py-2.5 font-body text-sm text-cream focus:border-ember focus:outline-none">
            </label>
            <label class="flex flex-col gap-1.5">
              <span class="font-body text-xs font-medium text-cream-muted">Time</span>
              <input required type="time" name="time"
                class="rounded-md border border-charcoal bg-surface px-3 py-2.5 font-body text-sm text-cream focus:border-ember focus:outline-none">
            </label>
            <label class="flex flex-col gap-1.5 sm:col-span-2">
              <span class="font-body text-xs font-medium text-cream-muted">Party size</span>
              <input required type="number" name="party" min="1" max="20" value="2"
                class="rounded-md border border-charcoal bg-surface px-3 py-2.5 font-body text-sm text-cream focus:border-ember focus:outline-none">
            </label>
          </div>

          <div class="flex items-center justify-end gap-3">
            <button type="button" data-close
              class="rounded-full px-4 py-2.5 font-body text-sm font-medium text-cream-muted transition-colors duration-fast hover:text-cream">
              Cancel
            </button>
            <button type="submit"
              class="rounded-full bg-ember px-5 py-2.5 font-body text-sm font-semibold text-cream transition-colors duration-fast hover:bg-ember-hover">
              Confirm
            </button>
          </div>
        </form>
      </dialog>
    `;

    this.dialog = this.querySelector("[data-modal]");
    this.form = this.querySelector("[data-form]");

    this.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", () => this.close())
    );

    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) this.close();
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!this.form.checkValidity()) {
        this.form.reportValidity();
        return;
      }
      this.dispatchEvent(new CustomEvent("forno:book-submit", {
        bubbles: true,
        composed: true,
        detail: Object.fromEntries(new FormData(this.form)),
      }));
      this.close();
      this.form.reset();
    });

    document.addEventListener("forno:book-open", () => this.open());
  }

  open() {
    this.#lastFocus = document.activeElement;
    if (typeof this.dialog.showModal === "function") {
      this.dialog.showModal();
    } else {
      this.dialog.setAttribute("open", "");
    }
  }

  close() {
    if (typeof this.dialog.close === "function") {
      this.dialog.close();
    } else {
      this.dialog.removeAttribute("open");
    }
    if (this.#lastFocus && typeof this.#lastFocus.focus === "function") {
      this.#lastFocus.focus();
    }
  }
}

customElements.define("forno-book-modal", FornoBookModal);
