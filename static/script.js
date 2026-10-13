// Тема 02 «Добра Річ»: мобильное меню, переключатель категорий в левой колонке,
// модальное окно заказа, галерея товара, сортировка по цене
(function () {
  // --- Бургер и выпадающее меню ---
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  function setNav(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !burger.contains(e.target)) setNav(false);
    });
  }

  // --- Список категорий на мобильном (левая колонка каталога) ---
  var sideToggle = document.getElementById('side-toggle'), catnav = document.getElementById('catnav');
  if (sideToggle && catnav) {
    sideToggle.addEventListener('click', function () {
      var open = catnav.classList.toggle('is-open');
      sideToggle.classList.toggle('is-open', open);
      sideToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // --- Модальное окно заказа ---
  var modal = document.getElementById('order-modal'), omProduct = document.getElementById('om-product'), omMail = document.getElementById('om-mail');
  function openModal(name, sku) {
    if (!modal) return;
    var label = (name || '') + (sku ? ' (арт. ' + sku + ')' : '');
    if (omProduct) omProduct.textContent = label;
    if (omMail) {
      var base = omMail.getAttribute('href').split('?')[0];
      omMail.setAttribute('href', base + '?subject=' + encodeURIComponent('Замовлення: ' + label) +
        '&body=' + encodeURIComponent('Доброго дня! Цікавить: ' + label + '\nКількість: \nТелефон для зв\'язку: '));
    }
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    var close = document.getElementById('om-close');
    if (close) close.focus();
  }
  function closeModal() {
    if (modal && !modal.hidden) { modal.hidden = true; document.body.classList.remove('no-scroll'); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.js-order');
    if (b) { e.preventDefault(); openModal(b.dataset.name, b.dataset.sku); return; }
    if (e.target === modal || e.target.id === 'om-close') closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); setNav(false); }
  });

  // --- Галерея: клик по миниатюре меняет главное фото ---
  var main = document.getElementById('gal-main');
  var thumbs = document.querySelectorAll('.gallery__thumb');
  if (main && thumbs.length) {
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = t.dataset.src;
        thumbs.forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
      });
    });
  }

  // --- Сортировка карточек по цене (страница категории) ---
  var sort = document.getElementById('sort'), grid = document.getElementById('grid');
  if (sort && grid) {
    var cards = Array.prototype.slice.call(grid.children);
    cards.forEach(function (c, i) {
      var priceEl = c.querySelector('.price');
      c.dataset.i = i;
      c.dataset.p = parseFloat(((priceEl && priceEl.textContent) || '0').replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    });
    sort.addEventListener('change', function () {
      var v = sort.value;
      cards.sort(function (a, b) {
        if (v === 'price-asc') return a.dataset.p - b.dataset.p;
        if (v === 'price-desc') return b.dataset.p - a.dataset.p;
        return a.dataset.i - b.dataset.i;
      });
      cards.forEach(function (c) { grid.appendChild(c); });
    });
  }
})();
