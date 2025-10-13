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

document.addEventListener("DOMContentLoaded", function() {
    const form = document.forms['submit-to-google-sheet'];
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxdLfazsMLHKY6yBaKvRyk0s7jQ4Kwn-_UioFjRnNXJK2C1SdIiaNbsxYMLlwapoFuw/exec'; 

    form.addEventListener('submit', e => {
        e.preventDefault();  
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                console.log('Success!', response);
                form.reset();  
            })
            .catch(error => console.error('Error!', error.message));
    });
});
 