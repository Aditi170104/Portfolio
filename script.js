// Smooth horizontal scroll for project section
document.querySelectorAll('.row').forEach(row => {
    let isDown = false;
    let startX;
    let scrollLeft;

    row.addEventListener('mousedown', (e) => {
        isDown = true;
        row.classList.add('active');
        startX = e.pageX - row.offsetLeft;
        scrollLeft = row.scrollLeft;
    });

    row.addEventListener('mouseleave', () => {
        isDown = false;
        row.classList.remove('active');
    });

    row.addEventListener('mouseup', () => {
        isDown = false;
        row.classList.remove('active');
    });

    row.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - row.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        row.scrollLeft = scrollLeft - walk;
    });
});

// Card hover animation (scale up)
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
        card.style.transition = 'transform 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// -----------------------------
// Certificates grid + lightbox
// -----------------------------
(() => {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;

  // Configure your categories here. Each category maps to a subfolder inside `certificates/CategoryName/`.
  // Place your certificate images (jpg/png/jpeg) in those subfolders and list them here.
  // Example: certificates/Web Development/html_cert.jpg
  const CERTS_CONFIG = [
    { title: 'Core CS', folder: 'Core CS', images: [
      'automata.pdf',
      'C++ 1.pdf',
      'C++2.pdf',
      'Computer Networks1.pdf',
      'Computer Networks2.pdf',
      'DAA.pdf',
      'ims.pdf',
      'Operating Systems.pdf',
    ] },
    { title: 'AIML', folder: 'AIML', images: [
      'aiml.pdf',
      'Deep Learning 1.pdf',
      'Deep Learning 2.pdf',
      'Fundamentals of DL_NVIDIA.pdf',
      'soft computing.pdf',
    ] },
    { title: 'Data Science', folder: 'Data Science', images: [
      'bigdata.pdf',
      'Data Mining1.pdf',
      'Data Mining2.pdf',
      'Data Mining3.pdf',
      'data science 1.pdf',
      'data science 2.pdf',
      'data science 3.pdf',
      'data science 4.pdf',
      'data science 5.pdf',
      'data science 6.pdf',
      'data science 7.pdf',
      'data science 8.pdf',
      'data science 9.pdf',
      'E22CSEU0703_Time_series_Certificate.pdf',
      'Time Series Analysis.pdf',
    ] },
  ];

  // Utility to create a category card
  function createCategoryCard(category) {
    const first = category.cover || (category.images && category.images[0]);
    const isPdf = (name) => typeof name === 'string' && name.toLowerCase().endsWith('.pdf');
    const coverSrc = first && !isPdf(first)
      ? `certificates/${encodeURIComponent(category.folder)}/${encodeURIComponent(first)}`
      : '';

    const card = document.createElement('div');
    card.className = 'cert-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    const thumb = document.createElement('div');
    thumb.className = 'cert-thumb';
    if (coverSrc) {
      const img = document.createElement('img');
      img.src = coverSrc;
      img.alt = `${category.title} cover`;
      thumb.appendChild(img);
    } else {
      // Placeholder thumbnail for PDF-only categories
      const ph = document.createElement('div');
      ph.className = 'placeholder';
      ph.textContent = category.title;
      thumb.appendChild(ph);
    }

    const title = document.createElement('div');
    title.className = 'cert-title';
    title.textContent = category.title;

    card.appendChild(thumb);
    card.appendChild(title);

    card.addEventListener('click', () => openLightbox(category));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(category);
      }
    });

    return card;
  }

  // Populate grid
  CERTS_CONFIG.forEach(cat => {
    if (!cat.images || cat.images.length === 0) return;
    grid.appendChild(createCategoryCard(cat));
  });

  // Lightbox logic
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox ? lightbox.querySelector('.lightbox-image') : null;
  const lbPdf = lightbox ? lightbox.querySelector('.lightbox-pdf') : null;
  const lbCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lbOpen = lightbox ? lightbox.querySelector('.lightbox-open') : null;
  const btnClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const btnPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const btnNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;

  let currentCategory = null;
  let currentIndex = 0;

  function openLightbox(category) {
    currentCategory = category;
    currentIndex = 0;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function updateLightbox() {
    if (!currentCategory) return;
    const filename = currentCategory.images[currentIndex];
    const src = `certificates/${encodeURIComponent(currentCategory.folder)}/${encodeURIComponent(filename)}`;
    const isPdf = filename.toLowerCase().endsWith('.pdf');
    if (lbImg) {
      lbImg.style.display = isPdf ? 'none' : 'block';
      if (!isPdf) lbImg.src = src;
    }
    if (lbPdf) {
      lbPdf.style.display = isPdf ? 'block' : 'none';
      if (isPdf) lbPdf.src = src;
    }
    if (lbOpen) {
      lbOpen.style.display = 'none';
      lbOpen.href = src;
    }
    if (lbCaption) lbCaption.textContent = `${currentCategory.title} • ${filename}`;
  }

  function prevImage() {
    if (!currentCategory) return;
    currentIndex = (currentIndex - 1 + currentCategory.images.length) % currentCategory.images.length;
    updateLightbox();
  }

  function nextImage() {
    if (!currentCategory) return;
    currentIndex = (currentIndex + 1) % currentCategory.images.length;
    updateLightbox();
  }

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnPrev) btnPrev.addEventListener('click', prevImage);
  if (btnNext) btnNext.addEventListener('click', nextImage);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }
})();