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
              class="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-charcoal text-cream transition-colors duration-fast hover:bg-surface"
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
            <label class="flex flex-col gap-1.5 sm:col-span-2">
              <span class="font-body text-xs font-medium text-cream-muted">Email</span>
              <input required type="email" name="email" autocomplete="email"
                class="rounded-md border border-charcoal bg-surface px-3 py-2.5 font-body text-sm text-cream placeholder:text-cream-muted focus:border-ember focus:outline-none">
            </label>
            <label class="flex flex-col gap-1.5">
              <span class="font-body text-xs font-medium text-cream-muted">Date</span>
              <input required type="date" name="date" data-date
                class="rounded-md border border-charcoal bg-surface px-3 py-2.5 font-body text-sm text-cream focus:border-ember focus:outline-none">
            </label>
            <label class="flex flex-col gap-1.5">
              <span class="font-body text-xs font-medium text-cream-muted">Time</span>
              <select required name="time" data-time
                class="rounded-md border border-charcoal bg-surface px-3 py-2.5 font-body text-sm text-cream focus:border-ember focus:outline-none">
                <option value="">— select —</option>
              </select>
            </label>
            <label class="flex flex-col gap-1.5 sm:col-span-2">
              <span class="font-body text-xs font-medium text-cream-muted">Party size</span>
              <input required type="number" name="party" min="1" max="20" value="2"
                class="rounded-md border border-charcoal bg-surface px-3 py-2.5 font-body text-sm text-cream focus:border-ember focus:outline-none">
            </label>
          </div>

          <div class="flex items-center justify-end gap-3">
            <button type="button" data-close
              class="cursor-pointer rounded-full px-4 py-2.5 font-body text-sm font-medium text-cream-muted transition-colors duration-fast hover:text-cream">
              Cancel
            </button>
            <button type="submit"
              class="cursor-pointer rounded-full bg-ember px-5 py-2.5 font-body text-sm font-semibold text-cream transition-colors duration-fast hover:bg-ember-hover">
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

    this.querySelector("[data-date]").addEventListener("change", () => {
      this.#updateTimeConstraints();
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
      this.#showToast("Reservation confirmed! See you at FORNO.");
    });

    document.addEventListener("forno:book-open", () => this.open());
  }

  #updateTimeConstraints() {
    const dateInput = this.querySelector("[data-date]");
    const timeSelect = this.querySelector("[data-time]");
    const today = new Date().toISOString().split("T")[0];

    let minMinutes = 9 * 60;
    if (dateInput.value === today) {
      const earliest = new Date();
      earliest.setHours(earliest.getHours() + 3, earliest.getMinutes(), 0, 0);
      const candidateMinutes = earliest.getHours() * 60 + earliest.getMinutes();
      minMinutes = Math.max(minMinutes, candidateMinutes);
    }
    const maxMinutes = 23 * 60;

    const prev = timeSelect.value;
    timeSelect.innerHTML = '<option value="">— select —</option>';

    for (let t = minMinutes; t <= maxMinutes; t += 30) {
      const h = String(Math.floor(t / 60)).padStart(2, "0");
      const m = String(t % 60).padStart(2, "0");
      const val = `${h}:${m}`;
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      if (val === prev) opt.selected = true;
      timeSelect.appendChild(opt);
    }
  }

  #showToast(message) {
    const toast = document.createElement("div");
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.style.cssText = [
      "position:fixed",
      "top:0",
      "left:50%",
      "transform:translate(-50%,-100%)",
      "z-index:9999",
      "display:flex",
      "align-items:center",
      "gap:10px",
      "padding:14px 20px",
      "background:#1A1109",
      "border:1px solid #3A2820",
      "border-top:none",
      "border-radius:0 0 12px 12px",
      "font-family:Inter,system-ui,sans-serif",
      "font-size:14px",
      "font-weight:500",
      "color:#F5EDDF",
      "box-shadow:0 8px 24px rgba(0,0,0,0.5)",
      "transition:transform 400ms cubic-bezier(0.16,1,0.3,1)",
    ].join(";");

    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7BA05B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      ${message}
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.transform = "translate(-50%, 0)";
      });
    });

    const hide = () => {
      toast.style.transition = "transform 300ms cubic-bezier(0.7,0,0.84,0)";
      toast.style.transform = "translate(-50%, -100%)";
      toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    };

    setTimeout(hide, 3500);
  }

  open() {
    this.#lastFocus = document.activeElement;
    const today = new Date().toISOString().split("T")[0];
    this.querySelector("[data-date]").min = today;
    this.#updateTimeConstraints();
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
