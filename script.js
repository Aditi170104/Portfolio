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
