document.addEventListener("DOMContentLoaded", function() {
    let menuIcon = document.querySelector('#menu-id');
    let navbar = document.querySelector('.navbar');
    let sections = document.querySelectorAll('.section');
    let navLinks = document.querySelectorAll('header nav a');

    window.onscroll = () => {
        let top = window.scrollY; 

        sections.forEach(sec => {
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active'); 
                    document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
                });
            }
        });
    };

   
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x'); 
        navbar.classList.toggle('active'); 
    };

    const skillBoxes = document.querySelectorAll('.skills-box');

    skillBoxes.forEach(box => {
        const percentage = parseInt(box.querySelector('.percentage').textContent);
        const circle = box.querySelector('.progress-ring__circle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        setTimeout(() => {
            const offset = circumference - (percentage / 100 * circumference);
            circle.style.strokeDashoffset = offset;
        }, 100);
    });
});

 