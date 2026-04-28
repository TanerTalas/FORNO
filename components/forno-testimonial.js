class FornoTestimonial extends HTMLElement {
  static get observedAttributes() {
    return ["quote", "name", "avatar"];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.#render();
  }

  #render() {
    const quote = this.getAttribute("quote") ?? "";
    const name = this.getAttribute("name") ?? "";
    const avatar = this.getAttribute("avatar") ?? "";

    this.innerHTML = `
      <article class="flex h-full w-[300px] shrink-0 flex-col gap-5 rounded-2xl border border-charcoal/80 bg-surface/70 p-6 backdrop-blur-sm md:w-[360px] md:p-7">
        <svg class="h-6 w-6 text-mustard" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7.17 6C4.31 6 2 8.31 2 11.17c0 2.86 2.31 5.17 5.17 5.17.34 0 .67-.03.99-.1-.45 1.32-1.55 2.4-3.16 2.76v2c3.83-.5 6.34-3.34 6.34-7.83V11.17C11.34 8.31 9.03 6 7.17 6Zm12 0c-2.86 0-5.17 2.31-5.17 5.17 0 2.86 2.31 5.17 5.17 5.17.34 0 .67-.03.99-.1-.45 1.32-1.55 2.4-3.16 2.76v2c3.83-.5 6.34-3.34 6.34-7.83V11.17C24.34 8.31 22.03 6 19.17 6Z"/>
        </svg>

        <p class="font-body text-sm leading-relaxed text-cream md:text-base">
          ${this.#escape(quote)}
        </p>

        <div class="mt-auto flex items-center gap-3 pt-2">
          ${avatar ? `<img src="${this.#escape(avatar)}" alt="${this.#escape(name)}" width="40" height="40" loading="lazy" class="h-10 w-10 rounded-full object-cover">` : ""}
          <span class="font-body text-sm font-semibold text-cream-muted">${this.#escape(name)}</span>
        </div>
      </article>
    `;
  }

  #escape(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}

customElements.define("forno-testimonial", FornoTestimonial);
