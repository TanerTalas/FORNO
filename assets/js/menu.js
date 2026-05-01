const menuData = [
  {
    id: "starters",
    label: "Starters",
    image: "assets/img/menu/starters.jpg",
    items: [
      { name: "Bruschetta", price: "€6" },
      { name: "Garlic Bread", price: "€4" },
      { name: "Arancini", price: "€8" },
      { name: "Burrata", price: "€10" },
    ],
  },
  {
    id: "pizzas",
    label: "Pizzas",
    image: "assets/img/menu/pizzas.jpg",
    items: [
      { name: "Margherita", price: "€12" },
      { name: "Diavola", price: "€14" },
      { name: "Quattro Formaggi", price: "€15" },
      { name: "Prosciutto e Rucola", price: "€16" },
      { name: "Funghi e Tartufo", price: "€17" },
    ],
  },
  {
    id: "pastas",
    label: "Pastas",
    image: "assets/img/menu/pastas.jpg",
    items: [
      { name: "Cacio e Pepe", price: "€13" },
      { name: "Amatriciana", price: "€14" },
      { name: "Carbonara", price: "€14" },
      { name: "Pesto Rigatoni", price: "€12" },
    ],
  },
  {
    id: "salads",
    label: "Salads",
    image: "assets/img/menu/salads.jpg",
    items: [
      { name: "Rucola e Parmigiano", price: "€9" },
      { name: "Caprese", price: "€10" },
      { name: "Insalata Mista", price: "€7" },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    image: "assets/img/menu/drinks.jpg",
    items: [
      { name: "Still Water", price: "€2" },
      { name: "Sparkling Water", price: "€2" },
      { name: "Soft Drink", price: "€3" },
      { name: "Draft Beer", price: "€5" },
      { name: "House Red Wine", price: "€6" },
      { name: "House White Wine", price: "€6" },
      { name: "Espresso", price: "€2" },
      { name: "Cappuccino", price: "€3" },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    image: "assets/img/menu/desserts.jpg",
    items: [
      { name: "Tiramisu", price: "€7" },
      { name: "Panna Cotta", price: "€6" },
      { name: "Gelato (2 scoops)", price: "€5" },
    ],
  },
  {
    id: "extras",
    label: "Extras",
    image: "assets/img/menu/extras.jpg",
    items: [
      { name: "Extra Cheese", price: "€2" },
      { name: "Extra Prosciutto", price: "€3" },
      { name: "Chili Oil", price: "€1" },
      { name: "Truffle Oil", price: "€2" },
      { name: "Dipping Sauce", price: "€1" },
    ],
  },
];

// ── DOM refs ──────────────────────────────────────────────────────────────────
const grid = document.getElementById("menu-grid");
const modal = document.getElementById("menu-modal");
const modalContent = document.getElementById("menu-modal-content");
const backdrop = document.getElementById("menu-modal-backdrop");
const closeBtn = document.getElementById("menu-modal-close");

// ── Build grid ────────────────────────────────────────────────────────────────
menuData.forEach((cat) => {
  const card = document.createElement("button");
  card.className = "menu-card";
  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", `Open ${cat.label}`);
  card.dataset.categoryId = cat.id;
  card.innerHTML = `
    <div class="menu-card-img-wrap">
      <img
        src="${cat.image}"
        alt="${cat.label}"
        width="600" height="600"
        loading="lazy"
        draggable="false"
        onerror="this.closest('.menu-card-img-wrap').classList.add('menu-card-img-fallback')"
      >
    </div>
    <p class="menu-card-label">${cat.label}</p>
  `;
  card.addEventListener("click", () => openModal(cat.id));
  grid.appendChild(card);
});

// ── Build modal content ───────────────────────────────────────────────────────
menuData.forEach((cat) => {
  const block = document.createElement("div");
  block.id = `modal-${cat.id}`;
  block.className = "menu-modal-block";
  block.innerHTML = `
    <div class="menu-modal-block-inner">
      <div class="menu-modal-block-img">
        <img
          src="${cat.image}"
          alt="${cat.label}"
          width="600" height="600"
          loading="lazy"
          draggable="false"
          onerror="this.closest('.menu-modal-block-img').classList.add('menu-card-img-fallback')"
        >
      </div>
      <div class="menu-modal-block-body">
        <h2 class="menu-modal-cat-title">${cat.label}</h2>
        <ul class="menu-modal-item-list">
          ${cat.items
            .map(
              (item, i) => `
            <li class="menu-modal-item${i === cat.items.length - 1 ? " last" : ""}">
              <span class="menu-modal-item-name">${item.name}</span>
              <span class="menu-modal-item-price">${item.price}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    </div>
  `;
  modalContent.appendChild(block);
});

// ── Modal open / close ────────────────────────────────────────────────────────
let previouslyFocused = null;

function openModal(categoryId) {
  previouslyFocused = document.activeElement;

  modal.hidden = false;
  backdrop.hidden = false;

  requestAnimationFrame(() => {
    modal.classList.add("is-open");
    backdrop.classList.add("is-open");
  });

  document.body.style.overflow = "hidden";

  const target = document.getElementById(`modal-${categoryId}`);
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  closeBtn.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  backdrop.classList.remove("is-open");

  const onEnd = () => {
    modal.hidden = true;
    backdrop.hidden = true;
    modal.removeEventListener("transitionend", onEnd);
  };
  modal.addEventListener("transitionend", onEnd, { once: true });

  document.body.style.overflow = "";

  if (previouslyFocused) previouslyFocused.focus();
}

closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// Trap focus inside modal
modal.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusable = Array.from(
    modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.disabled);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
