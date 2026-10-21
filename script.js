(function(){
  // ---------- Nav scroll state ----------
  var nav = document.getElementById('siteNav');
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 20){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll); onScroll();

  // ---------- Mobile menu ----------
  var toggle = document.getElementById('navToggle');
  var overlay = document.getElementById('navOverlay');
  var navLinks = document.getElementById('navLinks');

  function openMenu(){
    nav.classList.add('menu-open');
    document.body.classList.add('nav-open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close menu');
  }
  function closeMenu(returnFocus){
    nav.classList.remove('menu-open');
    document.body.classList.remove('nav-open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    if(returnFocus){ toggle.focus(); }
  }
  if(toggle){
    toggle.addEventListener('click', function(){
      nav.classList.contains('menu-open') ? closeMenu(false) : openMenu();
    });
    overlay.addEventListener('click', function(){ closeMenu(false); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && nav.classList.contains('menu-open')){ closeMenu(true); }
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ closeMenu(false); });
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 760 && nav.classList.contains('menu-open')){ closeMenu(false); }
    });
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, {threshold:.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('visible'); });
  }

  // ---------- Animated counters ----------
  var counted = false;
  var statsGrid = document.querySelector('.stats-grid');
  function animateCounters(){
    document.querySelectorAll('.stat-number').forEach(function(el){
      var target = parseInt(el.getAttribute('data-target'),10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0; var dur = 1300; var t0 = performance.now();
      function tick(now){
        var p = Math.min((now-t0)/dur, 1);
        var val = Math.floor(start + (target-start)*(1-Math.pow(1-p,3)));
        el.textContent = val.toLocaleString();
        if(p < 1){ requestAnimationFrame(tick); }
        else { el.innerHTML = target.toLocaleString() + '<span class="suffix">'+suffix+'</span>'; }
      }
      requestAnimationFrame(tick);
    });
  }
  if(statsGrid){
    var statIo = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting && !counted){ counted = true; animateCounters(); statIo.disconnect(); }
      });
    }, {threshold:.4});
    statIo.observe(statsGrid);
  }

  // ---------- Testimonial slider ----------
  var track = document.getElementById('sliderTrack');
  if(track){
    var cards = track.children.length;
    var perView = window.innerWidth <= 920 ? 1 : 3;
    var index = 0;
    var dotsWrap = document.getElementById('sliderDots');
    var maxIndex = Math.max(0, cards - perView);
    function buildDots(){
      dotsWrap.innerHTML = '';
      for(var i=0;i<=maxIndex;i++){
        var d = document.createElement('span');
        d.className = 'dot' + (i===index?' active':'');
        d.addEventListener('click', function(idx){ return function(){ index = idx; render(); }; }(i));
        dotsWrap.appendChild(d);
      }
    }
    function render(){
      var cardW = track.children[0].getBoundingClientRect().width;
      var gap = 22;
      track.style.transform = 'translateX(' + (-(index*(cardW+gap))) + 'px)';
      Array.prototype.forEach.call(dotsWrap.children, function(d,i){ d.classList.toggle('active', i===index); });
    }
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    if(prevBtn) prevBtn.addEventListener('click', function(){ index = index<=0 ? maxIndex : index-1; render(); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ index = index>=maxIndex ? 0 : index+1; render(); });
    window.addEventListener('resize', function(){
      perView = window.innerWidth <= 920 ? 1 : 3;
      maxIndex = Math.max(0, cards - perView);
      if(index>maxIndex) index = maxIndex;
      buildDots(); render();
    });
    buildDots(); render();
    var autoplay = setInterval(function(){ index = index>=maxIndex ? 0 : index+1; render(); }, 6000);
    document.querySelector('.slider').addEventListener('mouseenter', function(){ clearInterval(autoplay); });
  }

  // ---------- Appointment form ----------
  var form = document.getElementById('apptForm');
  var success = document.getElementById('formSuccess');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      form.classList.add('hide');
      success.classList.add('show');
      success.setAttribute('tabindex','-1');
      success.focus();
    });
  }

  // ---------- Contact form ----------
  var cform = document.getElementById('contactForm');
  var csuccess = document.getElementById('formSuccess');
  if(cform){
    cform.addEventListener('submit', function(e){
      e.preventDefault();
      cform.classList.add('hide');
      csuccess.classList.add('show');
      csuccess.setAttribute('tabindex','-1');
      csuccess.focus();
    });
  }

  // ---------- Pre-fill service from services page links ----------
  var params = new URLSearchParams(window.location.search);
  var svc = params.get('service');
  var svcField = document.getElementById('fservice');
  if(svc && svcField){
    Array.prototype.forEach.call(svcField.options, function(opt){
      if(opt.value === svc){ opt.selected = true; }
    });
  }
})();
/* =====================================================================
   DE KINGS EYES CLINIC — SITE REFRESH ADDITIONS
   Branches, WhatsApp float button, appointment branch binding
===================================================================== */
(function(){

  // ---------- Shared branch data ----------
  // NOTE: Addresses, phone numbers and hours below are clearly-labelled
  // PLACEHOLDERS. Replace them with the clinic's real branch details.
  window.DK_BRANCHES = [
    {
      id: 'ikorodu',
      name: 'Ikorodu Branch',
      address: 'Address to be confirmed — Ikorodu, Lagos',
      phone: '+234 800 000 0001 (placeholder)',
      hours: 'Mon–Fri 8am–6pm · Sat 9am–3pm'
    },
    {
      id: 'sango',
      name: 'Sango Branch',
      address: 'Address to be confirmed — Sango-Ota, Ogun State',
      phone: '+234 800 000 0002 (placeholder)',
      hours: 'Mon–Fri 8am–6pm · Sat 9am–3pm'
    },
    {
      id: 'mowe',
      name: 'Mowe Branch',
      address: 'Address to be confirmed — Mowe, Ogun State',
      phone: '+234 800 000 0003 (placeholder)',
      hours: 'Mon–Fri 8am–6pm · Sat 9am–3pm'
    },
    {
      id: 'ojota',
      name: 'Ojota Branch',
      address: 'Address to be confirmed — Ojota, Lagos',
      phone: '+234 800 000 0004 (placeholder)',
      hours: 'Mon–Fri 8am–6pm · Sat 9am–3pm'
    }
  ];

  // ---------- WhatsApp config ----------
  // Reuses the clinic's existing WhatsApp number found elsewhere in this
  // codebase (appointment.html / contact.html): +234 801 234 5678.
  window.DK_WHATSAPP_NUMBER = '2348012345678';
  window.DK_WHATSAPP_MESSAGE = "Hello, I would like to make an enquiry about your eye-care services.";

  // ---------- Floating WhatsApp button (every page) ----------
  function injectWhatsApp(){
    if(document.querySelector('.wa-float')) return;
    var a = document.createElement('a');
    a.className = 'wa-float';
    a.href = 'https://wa.me/' + window.DK_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(window.DK_WHATSAPP_MESSAGE);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chat with De Kings Eyes Clinic on WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1-1.4-.6-2.3-1.1-3.2-2.6-.2-.3 0-.5.1-.6.1-.1.6-.7.7-.9.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.4-.2.3-.9 1-.9 2.3 0 1.4 1 2.7 1.2 2.9.2.2 1.7 2.6 4.1 3.5 2 .8 2 .6 2.4.6.4 0 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z"/></svg><span class="wa-label">Chat with us</span>';
    document.body.appendChild(a);
  }
  injectWhatsApp();

  // ---------- Branch selector builder (used on index.html + appointment.html) ----------
  function branchIconSVG(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-7.5 7-12.5A7 7 0 0 0 5 9.5C5 14.5 12 22 12 22Z"/><circle cx="12" cy="9.5" r="2.4"/></svg>';
  }

  function buildBranchGrid(container, opts){
    opts = opts || {};
    var name = opts.name || 'branch';
    var selected = opts.selected || null;
    var html = '';
    window.DK_BRANCHES.forEach(function(b, i){
      var checked = (selected === b.id) ? ' checked' : '';
      html += '' +
        '<label class="branch-card" style="--i:'+i+'">' +
          '<input type="radio" name="'+name+'" value="'+b.id+'"'+checked+'>' +
          '<span class="bic">'+branchIconSVG()+'</span>' +
          '<h4>'+b.name+'</h4>' +
          '<div class="baddr">'+b.address+'</div>' +
          '<div class="bmeta"><span>'+b.phone+'</span><span>'+b.hours+'</span></div>' +
          '<span class="bcheck"></span>' +
        '</label>';
    });
    container.innerHTML = html;
  }
  window.DK_buildBranchGrid = buildBranchGrid;

  // ---------- Homepage branch picker ----------
  var homeBranchGrid = document.getElementById('homeBranchGrid');
  if(homeBranchGrid){
    var storedBranch = null;
    try{ storedBranch = localStorage.getItem('dk_branch'); }catch(e){}
    buildBranchGrid(homeBranchGrid, {name: 'homeBranch', selected: storedBranch});
    homeBranchGrid.addEventListener('change', function(e){
      if(e.target && e.target.name === 'homeBranch'){
        try{ localStorage.setItem('dk_branch', e.target.value); }catch(err){}
      }
    });
    var homeBranchCta = document.getElementById('homeBranchCta');
    if(homeBranchCta){
      homeBranchCta.addEventListener('click', function(ev){
        var picked = homeBranchGrid.querySelector('input[name="homeBranch"]:checked');
        if(picked){
          ev.preventDefault();
          window.location.href = 'appointment.html?branch=' + encodeURIComponent(picked.value);
        }
        // if nothing picked, link falls through to appointment.html with no branch pre-selected
      });
    }
  }

  // ---------- Appointment page branch picker + validation ----------
  var apptBranchGrid = document.getElementById('apptBranchGrid');
  if(apptBranchGrid){
    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get('branch');
    var fromStorage = null;
    try{ fromStorage = localStorage.getItem('dk_branch'); }catch(e){}
    var preselect = fromUrl || fromStorage;
    buildBranchGrid(apptBranchGrid, {name: 'apptBranch', selected: preselect});

    var branchErr = document.getElementById('branchError');
    apptBranchGrid.addEventListener('change', function(e){
      if(e.target && e.target.name === 'apptBranch'){
        apptBranchGrid.classList.remove('has-error');
        if(branchErr) branchErr.classList.remove('show');
        try{ localStorage.setItem('dk_branch', e.target.value); }catch(err){}
      }
    });

    var apptFormEl = document.getElementById('apptForm');
    if(apptFormEl){
      apptFormEl.addEventListener('submit', function(e){
        var picked = apptBranchGrid.querySelector('input[name="apptBranch"]:checked');
        if(!picked){
          e.preventDefault();
          e.stopImmediatePropagation();
          apptBranchGrid.classList.add('has-error');
          if(branchErr) branchErr.classList.add('show');
          apptBranchGrid.scrollIntoView({behavior:'smooth', block:'center'});
          return false;
        }
        var branchObj = window.DK_BRANCHES.filter(function(b){ return b.id === picked.value; })[0];
        var successEl = document.getElementById('formSuccess');
        if(successEl && branchObj){
          var p = successEl.querySelector('p');
          if(p){
            p.textContent = 'Thank you — our front desk will call you shortly to confirm your appointment at the ' + branchObj.name + '.';
          }
        }
      }, true); // capture phase so this runs before the existing submit handler in script.js
    }
  }

})();

/* =====================================================================
   DE KINGS EYES CLINIC — DEMO SHOP
   Frontend-only product catalogue + cart (no payment / backend).
===================================================================== */
(function(){

  var GLASSES_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="13" r="3.6"/><circle cx="18" cy="13" r="3.6"/><path d="M9.6 12h4.8M2 13l1-4M22 13l-1-4"/></svg>';

  var PRODUCTS = [
    {id:'frames-01', name:'Classic Tortoise Acetate Frame', cat:'frames', catLabel:'Prescription Frames', price:18500, desc:'A timeless tortoiseshell acetate frame, hand-finished and fitted to your prescription by our lab.', options:['Standard Fit','Narrow Fit','Wide Fit']},
    {id:'frames-02', name:'Slim Titanium Rectangle Frame', cat:'frames', catLabel:'Prescription Frames', price:32000, desc:'Lightweight titanium frame with spring hinges — built for everyday comfort and durability.', options:['Gunmetal','Matte Black','Rose Gold']},
    {id:'frames-03', name:"Kids Flex Frame (Ages 5–12)", cat:'frames', catLabel:'Prescription Frames', price:14000, desc:'Flexible, near-unbreakable frame designed for active children, with a soft adjustable fit.', options:['Blue','Pink','Green']},
    {id:'sun-01', name:'Aviator UV400 Sunglasses', cat:'sunglasses', catLabel:'Sunglasses', price:21000, desc:'Classic aviator silhouette with full UV400 protection and anti-reflective coating.', options:['Gold Frame','Silver Frame','Black Frame']},
    {id:'sun-02', name:'Polarized Wayfarer Sunglasses', cat:'sunglasses', catLabel:'Sunglasses', price:19500, desc:'Polarized lenses cut glare for driving and outdoor wear, in a classic wayfarer shape.', options:['Matte Black','Tortoise','Navy']},
    {id:'sun-03', name:'Sport Wrap Sunglasses', cat:'sunglasses', catLabel:'Sunglasses', price:23000, desc:'Wraparound sport frame with a secure grip — built for running, cycling and outdoor activity.', options:['Black/Grey','Red/Black']},
    {id:'contacts-01', name:'Monthly Clear Contact Lenses (6-pack)', cat:'contacts', catLabel:'Contact Lenses', price:15000, desc:'Breathable monthly-wear lenses. Fitting and prescription required at your appointment.', options:['Per Eye Pack','Pair Pack']},
    {id:'contacts-02', name:'Daily Disposable Contact Lenses (30-pack)', cat:'contacts', catLabel:'Contact Lenses', price:22000, desc:'Fresh lenses every day for convenience and comfort — no cleaning or solution required.', options:['Per Eye Pack','Pair Pack']},
    {id:'contacts-03', name:'Colour Contact Lenses', cat:'contacts', catLabel:'Contact Lenses', price:17500, desc:'Cosmetic tinted lenses available in a range of natural shades, prescription or plano.', options:['Hazel','Blue','Grey']},
    {id:'lens-01', name:'Single Vision Anti-Glare Lenses (Pair)', cat:'lenses', catLabel:'Eyeglass Lenses', price:12000, desc:'Standard single-vision lenses with an anti-glare coating, ground to your prescription.', options:['Index 1.56','Index 1.61','Index 1.67']},
    {id:'lens-02', name:'Progressive No-Line Lenses (Pair)', cat:'lenses', catLabel:'Eyeglass Lenses', price:38000, desc:'Seamless progressive lenses for distance, intermediate and near vision in one lens.', options:['Standard','Premium Wide-Field']},
    {id:'lens-03', name:'Blue-Light Filter Coating (Add-on)', cat:'lenses', catLabel:'Eyeglass Lenses', price:6500, desc:'An add-on coating that filters high-energy blue light from screens — added to any lens order.', options:['Add to Existing Order']},
    {id:'kit-01', name:'Lens Cleaning Kit', cat:'kits', catLabel:'Eye-Care Kits', price:3500, desc:'Anti-fog lens spray and a microfibre cloth, sized to carry in a bag or glasses case.', options:['Standard']},
    {id:'kit-02', name:'Contact Lens Travel Case & Solution Set', cat:'kits', catLabel:'Eye-Care Kits', price:4200, desc:'A travel-sized lens case paired with a small bottle of multipurpose contact lens solution.', options:['Standard']},
    {id:'kit-03', name:'Eyewear Care Bundle', cat:'kits', catLabel:'Eye-Care Kits', price:7800, desc:'Case, cloth, cleaning spray and a sport strap — everything to keep glasses clean and secure.', options:['Standard']}
  ];
  window.DK_PRODUCTS = PRODUCTS;

  var CATS = [
    {id:'all', label:'All Products'},
    {id:'frames', label:'Prescription Frames'},
    {id:'sunglasses', label:'Sunglasses'},
    {id:'contacts', label:'Contact Lenses'},
    {id:'lenses', label:'Eyeglass Lenses'},
    {id:'kits', label:'Eye-Care Kits'}
  ];

  function ngn(n){ return '₦' + n.toLocaleString('en-NG'); }

  function getCart(){
    try{ return JSON.parse(localStorage.getItem('dk_cart') || '[]'); }catch(e){ return []; }
  }
  function setCart(c){
    try{ localStorage.setItem('dk_cart', JSON.stringify(c)); }catch(e){}
    renderCartBadge();
  }
  function cartCount(){
    return getCart().reduce(function(s,i){ return s + i.qty; }, 0);
  }
  function renderCartBadge(){
    document.querySelectorAll('.cart-count').forEach(function(el){
      el.textContent = cartCount();
    });
  }

  var grid = document.getElementById('productGrid');
  var isShopPage = !!grid;

  if(isShopPage){
    var searchInput = document.getElementById('shopSearch');
    var filterWrap = document.getElementById('shopFilters');
    var activeCat = 'all';
    var activeQuery = '';

    function buildFilters(){
      filterWrap.innerHTML = CATS.map(function(c){
        return '<button type="button" class="chip' + (c.id==='all'?' active':'') + '" data-cat="' + c.id + '">' + c.label + '</button>';
      }).join('');
      filterWrap.querySelectorAll('.chip').forEach(function(btn){
        btn.addEventListener('click', function(){
          filterWrap.querySelectorAll('.chip').forEach(function(b){ b.classList.remove('active'); });
          btn.classList.add('active');
          activeCat = btn.getAttribute('data-cat');
          renderGrid();
        });
      });
    }

    function renderGrid(){
      var list = PRODUCTS.filter(function(p){
        var matchCat = activeCat === 'all' || p.cat === activeCat;
        var matchQuery = !activeQuery || p.name.toLowerCase().indexOf(activeQuery) > -1 || p.catLabel.toLowerCase().indexOf(activeQuery) > -1;
        return matchCat && matchQuery;
      });
      if(!list.length){
        grid.innerHTML = '<div class="empty-state">No products match your search. Try a different term or category.</div>';
        return;
      }
      grid.innerHTML = list.map(function(p){
        return '' +
          '<div class="product-card">' +
            '<a href="shop.html?product=' + p.id + '" class="product-thumb" aria-label="View ' + p.name + '">' +
              '<span class="demo-tag">Demo</span>' + GLASSES_ICON +
            '</a>' +
            '<div class="product-body">' +
              '<span class="product-cat">' + p.catLabel + '</span>' +
              '<h3><a href="shop.html?product=' + p.id + '">' + p.name + '</a></h3>' +
              '<div class="product-price">' + ngn(p.price) + '</div>' +
              '<div class="product-actions">' +
                '<a href="shop.html?product=' + p.id + '" class="btn btn-outline btn-sm">View</a>' +
                '<button type="button" class="btn btn-primary btn-sm" data-quick-add="' + p.id + '">Add to Cart</button>' +
              '</div>' +
            '</div>' +
          '</div>';
      }).join('');
      grid.querySelectorAll('[data-quick-add]').forEach(function(btn){
        btn.addEventListener('click', function(){
          addToCart(btn.getAttribute('data-quick-add'), 0, 1);
          openCart();
        });
      });
    }

    if(searchInput){
      searchInput.addEventListener('input', function(){
        activeQuery = searchInput.value.trim().toLowerCase();
        renderGrid();
      });
    }

    function addToCart(id, optIndex, qty){
      var cart = getCart();
      var existing = cart.filter(function(i){ return i.id === id && i.opt === optIndex; })[0];
      if(existing){ existing.qty += qty; }
      else { cart.push({id:id, opt:optIndex, qty:qty}); }
      setCart(cart);
      renderCartDrawer();
    }
    window.DK_addToCart = addToCart;

    function removeFromCart(id, optIndex){
      var cart = getCart().filter(function(i){ return !(i.id === id && i.opt === optIndex); });
      setCart(cart);
      renderCartDrawer();
    }
    function changeQty(id, optIndex, delta){
      var cart = getCart();
      var item = cart.filter(function(i){ return i.id === id && i.opt === optIndex; })[0];
      if(!item) return;
      item.qty += delta;
      if(item.qty <= 0){ cart = cart.filter(function(i){ return i !== item; }); }
      setCart(cart);
      renderCartDrawer();
    }

    function renderCartDrawer(){
      var itemsWrap = document.getElementById('cartItems');
      var subtotalEl = document.getElementById('cartSubtotal');
      if(!itemsWrap) return;
      var cart = getCart();
      if(!cart.length){
        itemsWrap.innerHTML = '<div class="empty-state">Your cart is empty. Browse products to add items.</div>';
        if(subtotalEl) subtotalEl.textContent = ngn(0);
        return;
      }
      var subtotal = 0;
      itemsWrap.innerHTML = cart.map(function(item){
        var p = PRODUCTS.filter(function(x){ return x.id === item.id; })[0];
        if(!p) return '';
        var lineTotal = p.price * item.qty;
        subtotal += lineTotal;
        var optLabel = (p.options && p.options[item.opt]) ? p.options[item.opt] : '';
        return '' +
          '<div class="cart-item">' +
            '<span class="ci-thumb">' + GLASSES_ICON + '</span>' +
            '<div class="ci-body">' +
              '<h5>' + p.name + '</h5>' +
              (optLabel ? '<div class="ci-opt">' + optLabel + '</div>' : '') +
              '<div class="ci-qty">' +
                '<button type="button" data-qty-minus="' + p.id + '" data-opt="' + item.opt + '">−</button>' +
                '<span>' + item.qty + '</span>' +
                '<button type="button" data-qty-plus="' + p.id + '" data-opt="' + item.opt + '">+</button>' +
              '</div>' +
              '<div class="ci-remove" data-remove="' + p.id + '" data-opt="' + item.opt + '" role="button" tabindex="0">Remove</div>' +
            '</div>' +
            '<div class="ci-price">' + ngn(lineTotal) + '</div>' +
          '</div>';
      }).join('');
      if(subtotalEl) subtotalEl.textContent = ngn(subtotal);

      itemsWrap.querySelectorAll('[data-qty-plus]').forEach(function(b){
        b.addEventListener('click', function(){ changeQty(b.getAttribute('data-qty-plus'), parseInt(b.getAttribute('data-opt'),10), 1); });
      });
      itemsWrap.querySelectorAll('[data-qty-minus]').forEach(function(b){
        b.addEventListener('click', function(){ changeQty(b.getAttribute('data-qty-minus'), parseInt(b.getAttribute('data-opt'),10), -1); });
      });
      itemsWrap.querySelectorAll('[data-remove]').forEach(function(b){
        b.addEventListener('click', function(){ removeFromCart(b.getAttribute('data-remove'), parseInt(b.getAttribute('data-opt'),10)); });
      });
    }

    var cartDrawer = document.getElementById('cartDrawer');
    var cartOverlay = document.getElementById('cartOverlay');
    function openCart(){
      if(cartDrawer){ cartDrawer.classList.add('open'); }
      if(cartOverlay){ cartOverlay.classList.add('open'); }
      renderCartDrawer();
    }
    function closeCart(){
      if(cartDrawer){ cartDrawer.classList.remove('open'); }
      if(cartOverlay){ cartOverlay.classList.remove('open'); }
    }
    document.querySelectorAll('[data-cart-open]').forEach(function(b){ b.addEventListener('click', openCart); });
    document.querySelectorAll('[data-cart-close]').forEach(function(b){ b.addEventListener('click', closeCart); });
    if(cartOverlay){ cartOverlay.addEventListener('click', closeCart); }

    var checkoutBtn = document.getElementById('checkoutBtn');
    if(checkoutBtn){
      checkoutBtn.addEventListener('click', function(){
        var cart = getCart();
        if(!cart.length) return;
        var lines = cart.map(function(item){
          var p = PRODUCTS.filter(function(x){ return x.id === item.id; })[0];
          if(!p) return '';
          var optLabel = (p.options && p.options[item.opt]) ? ' (' + p.options[item.opt] + ')' : '';
          return '- ' + p.name + optLabel + ' x' + item.qty;
        }).join('\n');
        var msg = "Hello De Kings Eyes Clinic, I'd like to enquire about these demo shop items:\n" + lines + "\n\nThis is a demo enquiry — please confirm pricing and availability.";
        window.open('https://wa.me/' + window.DK_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      });
    }

    // ---------- Product detail view ----------
    var detailWrap = document.getElementById('productDetail');
    var listingWrap = document.getElementById('shopListing');
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('product');

    function renderDetail(id){
      var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
      if(!p || !detailWrap){ return false; }
      if(listingWrap) listingWrap.style.display = 'none';
      detailWrap.style.display = 'block';
      var optionsHtml = (p.options && p.options.length) ?
        '<div class="pd-options"><label for="pdOption">Available Option</label><select id="pdOption">' +
        p.options.map(function(o,i){ return '<option value="'+i+'">'+o+'</option>'; }).join('') +
        '</select></div>' : '';
      detailWrap.innerHTML = '' +
        '<a href="shop.html" class="back-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg> Back to Shop</a>' +
        '<div class="product-detail reveal visible">' +
          '<div class="pd-image">' + GLASSES_ICON + '</div>' +
          '<div class="pd-body">' +
            '<span class="product-cat">' + p.catLabel + ' · Demo Product</span>' +
            '<h1>' + p.name + '</h1>' +
            '<div class="pd-price">' + ngn(p.price) + '</div>' +
            '<p class="pd-desc">' + p.desc + '</p>' +
            optionsHtml +
            '<div class="pd-qty" style="margin-bottom:22px;">' +
              '<button type="button" id="pdQtyMinus">−</button><span id="pdQtyVal">1</span><button type="button" id="pdQtyPlus">+</button>' +
            '</div>' +
            '<div class="pd-actions">' +
              '<button type="button" class="btn btn-primary" id="pdAddBtn">Add to Cart</button>' +
              '<a href="appointment.html" class="btn btn-outline">Book A Fitting Instead</a>' +
            '</div>' +
          '</div>' +
        '</div>';
      var qty = 1;
      var qtyVal = document.getElementById('pdQtyVal');
      document.getElementById('pdQtyMinus').addEventListener('click', function(){ if(qty>1){ qty--; qtyVal.textContent = qty; } });
      document.getElementById('pdQtyPlus').addEventListener('click', function(){ qty++; qtyVal.textContent = qty; });
      document.getElementById('pdAddBtn').addEventListener('click', function(){
        var optSel = document.getElementById('pdOption');
        var optIndex = optSel ? parseInt(optSel.value,10) : 0;
        addToCart(p.id, optIndex, qty);
        openCart();
      });
      return true;
    }

    buildFilters();
    renderGrid();
    renderCartBadge();
    renderCartDrawer();
    if(productId){ renderDetail(productId); }
  }

})();

/* =====================================================================
   DE KINGS EYES CLINIC — DEMO BLOG
===================================================================== */
(function(){

  var ARTICLES = [
    {
      slug:'why-regular-eye-exams-matter', title:'Why Regular Eye Exams Matter More Than You Think',
      cat:'eye-exams', catLabel:'Eye Exams', date:'2026-09-02',
      excerpt:"Many eye conditions develop with no early symptoms. Here's why a routine exam catches problems vision alone can miss.",
      body:[
        "It is easy to assume that if you can see clearly, your eyes are healthy. In reality, many of the most common eye conditions — including glaucoma and early diabetic retinopathy — can develop with little to no noticeable symptoms in their early stages.",
        "A comprehensive eye examination looks well beyond your ability to read a chart. It typically includes a check of your internal eye pressure, an assessment of your retina and optic nerve, and a review of your overall eye health history. Many of these checks are the only reliable way to catch certain conditions before they affect your vision.",
        "General guidance suggests most healthy adults have a comprehensive eye exam every one to two years, with more frequent visits recommended for people with diabetes, a family history of eye disease, or existing vision correction. Children benefit from early screening too, since undetected vision problems can affect learning and development.",
        "If it has been more than a year since your last exam, or you've noticed any change in your vision, it's worth booking an appointment with one of our specialists for a full assessment."
      ]
    },
    {
      slug:'childrens-vision-what-parents-should-watch-for', title:"Children's Vision: What Parents Should Watch For",
      cat:'children', catLabel:"Children's Vision", date:'2026-08-18',
      excerpt:'Children rarely complain about blurry vision because they assume it is normal. Here are the everyday signs parents can look out for.',
      body:[
        "Young children often don't realise their vision is different from everyone else's, so they're unlikely to tell you something looks blurry. Instead, vision problems in children tend to show up as behaviour: sitting very close to the television, squinting to see the board at school, frequent eye rubbing, or struggling to concentrate on close-up tasks like reading.",
        "A wandering or misaligned eye, unusual head tilting while looking at something, or consistently poor performance on vision screenings at school are also worth a closer look. Left unaddressed, some childhood vision issues, such as lazy eye (amblyopia), can become harder to correct the older a child gets — which is why early screening matters.",
        "General paediatric guidance recommends a first eye check in infancy, another around preschool age, and regular screening through the school years. Our pediatric eye care service is designed to be gentle and unhurried, with equipment and a pace suited to younger patients.",
        "If you've noticed any of the signs above, or simply haven't had your child's eyes checked recently, a screening appointment is a straightforward way to put your mind at ease."
      ]
    },
    {
      slug:'managing-digital-eye-strain', title:'Managing Digital Eye Strain In A Screen-Heavy World',
      cat:'eye-strain', catLabel:'Eye Strain', date:'2026-07-30',
      excerpt:"Headaches, dryness and blurry vision after a long day at the screen aren't just tiredness — they may be digital eye strain.",
      body:[
        "Digital eye strain, sometimes called computer vision syndrome, is increasingly common as more of our work and leisure time moves onto screens. Typical symptoms include dry or irritated eyes, headaches, blurred vision, and neck or shoulder discomfort after extended screen use.",
        "A frequently recommended habit is the 20-20-20 rule: roughly every 20 minutes, look at something about 20 feet away for at least 20 seconds. This gives your eye muscles a brief break from sustained close-up focus. Adjusting screen brightness to match your surroundings, increasing text size rather than leaning in, and blinking consciously more often can also help reduce dryness.",
        "Screen glare and poor lighting can make symptoms worse. Positioning screens to avoid reflections, and considering a blue-light filtering lens coating if you spend long hours at a computer, are both worth discussing at your next visit.",
        "If digital eye strain is a persistent issue for you, it's worth having your prescription reviewed — uncorrected or outdated prescriptions are a common hidden contributor."
      ]
    },
    {
      slug:'contact-lens-care-dos-and-donts', title:"Contact Lens Care: Do's And Don'ts",
      cat:'contact-lens', catLabel:'Contact Lens Care', date:'2026-06-25',
      excerpt:'Good contact lens hygiene is one of the simplest ways to protect your eyes from irritation and infection.',
      body:[
        "Contact lenses are safe and convenient for most wearers, but they do sit directly on the surface of the eye, which makes hygiene especially important. Always wash and dry your hands thoroughly before handling your lenses, and use fresh solution each time you store them — never top up old solution in the case.",
        "Avoid sleeping in lenses that aren't specifically approved for overnight wear, and never rinse lenses with tap water, which can introduce organisms that lead to serious infection. Replace your lens case regularly, and follow the replacement schedule for your specific lens type, whether that's daily, bi-weekly or monthly.",
        "If you experience redness, pain, unusual discharge or a noticeable drop in vision while wearing contacts, remove them and contact your eye care provider promptly rather than waiting for symptoms to pass on their own.",
        "Our contact lens service includes fitting, supply and aftercare support — if you're new to lenses or it's been a while since your last check, we're happy to talk you through what suits your eyes and lifestyle."
      ]
    },
    {
      slug:'understanding-cataracts-and-glaucoma', title:'Understanding Cataracts &amp; Glaucoma: Early Signs To Know',
      cat:'eye-health', catLabel:'Eye Health', date:'2026-05-14',
      excerpt:'Two of the leading causes of vision loss worldwide are also two of the most treatable — when caught early.',
      body:[
        "Cataracts and glaucoma are both common, age-related eye conditions, but they affect the eye in very different ways. A cataract is a clouding of the eye's natural lens, which tends to develop gradually and can cause blurry, dim or washed-out vision. Glaucoma, on the other hand, usually involves raised pressure inside the eye that slowly damages the optic nerve — often without any noticeable symptoms until vision loss has already begun.",
        "Because glaucoma in particular can progress silently, regular eye pressure checks as part of a routine exam are one of the few reliable ways to catch it early. Cataracts are generally easier to notice as they affect day-to-day vision directly, but the rate of progression varies significantly from person to person.",
        "Both conditions are manageable when identified early. Cataracts are commonly addressed with a routine surgical procedure once they begin to affect quality of life, while glaucoma is typically managed with eye drops, and in some cases further treatment, to control eye pressure and protect the optic nerve.",
        "If you're over 40, have a family history of either condition, or simply haven't had a pressure check in a while, it's a good idea to mention this at your next appointment."
      ]
    }
  ];
  window.DK_ARTICLES = ARTICLES;
  window.DK_ART_MEDIA_REF = function(){ return ART_MEDIA; };

  var ART_MEDIA = {
    'eye-exams': "https://wwwn.cdc.gov/phil///PHIL_Images/13500/13500_lores.jpg",
    'children': "https://wwwn.cdc.gov/phil///PHIL_Images/17309/17309_lores.jpg",
    'eye-strain': "https://wwwn.cdc.gov/phil///PHIL_Images/14157/14157_lores.jpg",
    'contact-lens': "https://wwwn.cdc.gov/phil///PHIL_Images/13560/13560_lores.jpg",
    'eye-health': "https://wwwn.cdc.gov/phil///PHIL_Images/17308/17308_lores.jpg"
  };

  var ART_CATS = [
    {id:'all', label:'All Articles'},
    {id:'eye-health', label:'Eye Health'},
    {id:'eye-exams', label:'Eye Exams'},
    {id:'children', label:"Children's Vision"},
    {id:'eye-strain', label:'Eye Strain'},
    {id:'contact-lens', label:'Contact Lens Care'}
  ];

  function fmtDate(iso){
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'});
  }

  var artGrid = document.getElementById('articleGrid');
  var isBlogPage = !!artGrid;

  if(isBlogPage){
    var featuredWrap = document.getElementById('featuredArticle');
    var filterWrap = document.getElementById('blogFilters');
    var searchInput = document.getElementById('blogSearch');
    var listingWrap = document.getElementById('blogListing');
    var detailWrap = document.getElementById('articleDetail');
    var activeCat = 'all';
    var activeQuery = '';

    function buildFilters(){
      filterWrap.innerHTML = ART_CATS.map(function(c){
        return '<button type="button" class="chip' + (c.id==='all'?' active':'') + '" data-cat="' + c.id + '">' + c.label + '</button>';
      }).join('');
      filterWrap.querySelectorAll('.chip').forEach(function(btn){
        btn.addEventListener('click', function(){
          filterWrap.querySelectorAll('.chip').forEach(function(b){ b.classList.remove('active'); });
          btn.classList.add('active');
          activeCat = btn.getAttribute('data-cat');
          renderGrid();
        });
      });
    }

    function articleCard(a){
      return '' +
        '<div class="article-card">' +
          '<a href="blog.html?post=' + a.slug + '" class="ac-media" style="background-image:url(\'' + ART_MEDIA[a.cat] + '\')"><span class="demo-tag">Demo Article</span></a>' +
          '<div class="ac-body">' +
            '<span class="ac-cat">' + a.catLabel + '</span>' +
            '<h3><a href="blog.html?post=' + a.slug + '">' + a.title + '</a></h3>' +
            '<p class="ac-excerpt">' + a.excerpt + '</p>' +
            '<div class="ac-meta">' + fmtDate(a.date) + '</div>' +
            '<a href="blog.html?post=' + a.slug + '" class="card-link ac-link">Read more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
          '</div>' +
        '</div>';
    }

    function renderFeatured(){
      if(!featuredWrap) return;
      var a = ARTICLES[0];
      featuredWrap.innerHTML = '' +
        '<a href="blog.html?post=' + a.slug + '" class="fa-media" style="background-image:url(\'' + ART_MEDIA[a.cat] + '\')"><span class="demo-tag">Featured · Demo Article</span></a>' +
        '<div class="fa-body">' +
          '<span class="eyebrow cat">Featured Article</span>' +
          '<h2>' + a.title + '</h2>' +
          '<p>' + a.excerpt + '</p>' +
          '<div class="fa-meta"><span>' + fmtDate(a.date) + '</span><span>' + a.catLabel + '</span></div>' +
          '<a href="blog.html?post=' + a.slug + '" class="btn btn-primary btn-sm">Read Article</a>' +
        '</div>';
    }

    function renderGrid(){
      var list = ARTICLES.filter(function(a){
        var matchCat = activeCat === 'all' || a.cat === activeCat;
        var matchQuery = !activeQuery || a.title.toLowerCase().indexOf(activeQuery) > -1 || a.excerpt.toLowerCase().indexOf(activeQuery) > -1;
        return matchCat && matchQuery;
      });
      if(!list.length){
        artGrid.innerHTML = '<div class="empty-state">No articles match your search.</div>';
        return;
      }
      artGrid.innerHTML = list.map(articleCard).join('');
    }

    if(searchInput){
      searchInput.addEventListener('input', function(){
        activeQuery = searchInput.value.trim().toLowerCase();
        renderGrid();
      });
    }

    function renderDetail(slug){
      var a = ARTICLES.filter(function(x){ return x.slug === slug; })[0];
      if(!a || !detailWrap) return false;
      if(listingWrap) listingWrap.style.display = 'none';
      detailWrap.style.display = 'block';
      var related = ARTICLES.filter(function(x){ return x.slug !== a.slug; }).slice(0,3);
      detailWrap.innerHTML = '' +
        '<a href="blog.html" class="back-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg> Back to Blog</a>' +
        '<div class="article-detail reveal visible">' +
          '<div class="art-media" style="background-image:url(\'' + ART_MEDIA[a.cat] + '\')"><span class="demo-tag">Demo Article</span></div>' +
          '<span class="eyebrow">' + a.catLabel + '</span>' +
          '<h1>' + a.title + '</h1>' +
          '<div class="art-meta"><span>Published ' + fmtDate(a.date) + '</span><span>De Kings Eyes Clinic Team</span></div>' +
          '<div class="art-body">' + a.body.map(function(p){ return '<p>' + p + '</p>'; }).join('') + '</div>' +
          '<div class="art-disclaimer">This article is for general information only and is not a substitute for personalised medical advice, diagnosis or treatment. Please book a consultation with one of our specialists about your specific eye health.</div>' +
          '<div style="text-align:center;margin:30px 0;"><a href="appointment.html" class="btn btn-primary">Book An Appointment</a></div>' +
          '<div class="related-articles">' +
            '<div class="section-head"><span class="eyebrow">Keep Reading</span><h2 style="font-size:1.5rem;">Related Articles</h2></div>' +
            '<div class="article-grid">' + related.map(articleCard).join('') + '</div>' +
          '</div>' +
        '</div>';
      window.scrollTo(0,0);
      return true;
    }

    buildFilters();
    renderFeatured();
    renderGrid();

    var urlParams = new URLSearchParams(window.location.search);
    var postSlug = urlParams.get('post');
    if(postSlug){ renderDetail(postSlug); }
  }

})();

/* =====================================================================
   Homepage previews (4 products, 4 articles) + mobile menu CTA
===================================================================== */
(function(){
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="13" r="3.6"/><circle cx="18" cy="13" r="3.6"/><path d="M9.6 12h4.8M2 13l1-4M22 13l-1-4"/></svg>';
  function ngn(n){ return '₦' + n.toLocaleString('en-NG'); }
  var pw = document.getElementById('homeProducts');
  if(pw && window.DK_PRODUCTS){
    var ids = ['frames-01','sun-01','contacts-02','kit-03'];
    pw.innerHTML = ids.map(function(id){
      var p = window.DK_PRODUCTS.filter(function(x){ return x.id === id; })[0];
      return '<div class="product-card">' +
        '<a href="shop.html?product=' + p.id + '" class="product-thumb" aria-label="View ' + p.name + '"><span class="demo-tag">Demo</span>' + ICON + '</a>' +
        '<div class="product-body"><span class="product-cat">' + p.catLabel + '</span>' +
        '<h3><a href="shop.html?product=' + p.id + '">' + p.name + '</a></h3>' +
        '<div class="product-price">' + ngn(p.price) + '</div>' +
        '<div class="product-actions"><a href="shop.html?product=' + p.id + '" class="btn btn-outline btn-sm">View Product</a></div></div></div>';
    }).join('');
  }
  var aw = document.getElementById('homeArticles');
  if(aw && window.DK_ARTICLES){
    var media = window.DK_ART_MEDIA_REF();
    aw.innerHTML = window.DK_ARTICLES.slice(0,4).map(function(a){
      var d = new Date(a.date + 'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
      return '<div class="article-card">' +
        '<a href="blog.html?post=' + a.slug + '" class="ac-media" style="background-image:url(\'' + media[a.cat] + '\')"><span class="demo-tag">Demo Article</span></a>' +
        '<div class="ac-body"><span class="ac-cat">' + a.catLabel + '</span>' +
        '<h3><a href="blog.html?post=' + a.slug + '">' + a.title + '</a></h3>' +
        '<p class="ac-excerpt">' + a.excerpt + '</p><div class="ac-meta">' + d + '</div>' +
        '<a href="blog.html?post=' + a.slug + '" class="card-link ac-link">Read more →</a></div></div>';
    }).join('');
  }
  // On very small screens the nav button is hidden; give the menu its own booking button
  var nl = document.getElementById('navLinks');
  if(nl && !nl.querySelector('.nav-menu-cta')){
    var a = document.createElement('a');
    a.href = 'appointment.html'; a.className = 'btn btn-primary btn-sm nav-menu-cta'; a.textContent = 'Book Appointment';
    nl.appendChild(a);
  }
})();
