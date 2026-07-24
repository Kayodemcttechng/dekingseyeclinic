(function(){
  // ---------- Loader ----------
  var loader = document.getElementById('loader');
  if(loader){
    window.addEventListener('load', function(){
      setTimeout(function(){
        loader.classList.add('done');
        document.body.classList.remove('lock');
      }, 350);
      setTimeout(function(){ loader.style.display='none'; }, 1100);
    });
    setTimeout(function(){ document.body.classList.remove('lock'); }, 2000);
  }

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