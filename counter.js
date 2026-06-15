const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navbar.classList.toggle("active");
});

function closeMenu() {
    hamburger.classList.remove("active");
    navbar.classList.remove("active");
}



const counters = document.querySelectorAll('.number');

counters.forEach(counter => {
  const updateCounter = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;

    const increment = target / 100;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }
  };

  updateCounter();
});


const serviceCards = document.querySelectorAll('.services-box > div');

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
},{threshold:0.2});

serviceCards.forEach(card=>{
  observer.observe(card);
});




const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const btn = document.getElementById('submitBtn');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.style.color = '#bdbdc7';
    status.textContent = 'Please wait...';

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });

        const result = await response.json();

        if (result.success) {
            status.style.color = '#00e676';
            status.textContent = '✅ Message sent successfully!';
            btn.textContent = 'Sent ✅';
            form.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = 'Send Message';
                status.textContent = '';
            }, 4000);

        } else {
            status.style.color = '#ff004d';
            status.textContent = '❌ Failed! Please try again.';
            btn.disabled = false;
            btn.textContent = 'Send Message';
        }

    } catch (error) {
        status.style.color = '#ff004d';
        status.textContent = '❌ Error! Please try again.';
        btn.disabled = false;
        btn.textContent = 'Send Message';
    }
});




// Custom Cursor JS
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.cursor');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
});

// Cursor hover effect on links & buttons
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.querySelector('.cursor').style.transform = 'translate(-50%, -50%) scale(2)';
        document.querySelector('.cursor').style.background = 'rgba(255,0,77,0.2)';
    });
    el.addEventListener('mouseleave', () => {
        document.querySelector('.cursor').style.transform = 'translate(-50%, -50%) scale(1)';
        document.querySelector('.cursor').style.background = 'transparent';
    });
});