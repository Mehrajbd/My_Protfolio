document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect
    const typedTextElement = document.querySelector('.typed-text');
    const roles = ['Developer', 'QA Engineer', 'Innovator'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
        const currentRole = roles[roleIndex];
        const typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex <= currentRole.length) {
            typedTextElement.textContent = currentRole.slice(0, charIndex);
            charIndex++;
        }

        if (isDeleting && charIndex > 0) {
            typedTextElement.textContent = currentRole.slice(0, charIndex);
            charIndex--;
        }

        if (!isDeleting && charIndex > currentRole.length) {
            isDeleting = true;
            setTimeout(typeRole, 2000);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        setTimeout(typeRole, typingSpeed);
    }

    typeRole();

    // Dark Mode Toggle
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
            document.body.classList.add('dark-theme');
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }    
    }

    toggleSwitch.addEventListener('change', switchTheme, false);

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Contact Form Handling
    (function() {
        // Replace with your actual EmailJS User ID
        emailjs.init("caN-1AKaCpkddohG2");

        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Form Elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitButton = contactForm.querySelector('button');

            // Validation
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Enhanced Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let isValid = true;

            // Reset previous error states
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('error');
            });

            // More lenient validation
            if (name.length < 1) {
                nameInput.classList.add('error');
                isValid = false;
            }

            if (email.length < 1 || !emailRegex.test(email)) {
                emailInput.classList.add('error');
                isValid = false;
            }

            if (message.length < 1) {
                messageInput.classList.add('error');
                isValid = false;
            }

            if (!isValid) {
                alert('Please fill all fields correctly');
                return;
            }

            // Disable submit button during sending
            submitButton.disabled = true;
            submitButton.classList.add('sending');

            // Prepare email parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'mr.mehraj1010@gmail.com'
            };

            // Send Email
            emailjs.send('service_zyss55q', 'template_5jo8r19', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Success Handling
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('form-success-message');
                    successMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                    contactForm.appendChild(successMessage);

                    // Reset form
                    contactForm.reset();

                    // Remove success message after 3 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('Failed to send message. Please try again.');
                })
                .finally(() => {
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.classList.remove('sending');
                });
        });
    })();

    // Intersection Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Skill Circle Animation
    function animateSkillCircles() {
        const skillCircles = document.querySelectorAll('.skill-circle');
        
        skillCircles.forEach(circle => {
            const svg = circle.querySelector('.skill-circle-svg');
            const path = circle.querySelector('.skill-circle-path');
            const percent = path.getAttribute('data-percent');
            
            // Calculate circumference
            const radius = path.getTotalLength() / (2 * Math.PI);
            const circumference = radius * 2 * Math.PI;
            
            // Set the dasharray and offset
            path.style.strokeDasharray = `${circumference} ${circumference}`;
            path.style.strokeDashoffset = circumference;
            
            // Trigger reflow
            path.getBoundingClientRect();
            
            // Animate the circle
            path.style.strokeDashoffset = circumference - (percent / 100) * circumference;
        });
    }

    // Intersection Observer for Skill Circles
    const skillObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillCircles();
                skillObserver.unobserve(entry.target);
            }
        });
    }, skillObserverOptions);

    // Observe skills section
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    // Project Filtering
    function setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        // Trigger reflow for animation
                        card.offsetWidth;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        
                        // Use setTimeout to completely hide the card after animation
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Call project filtering setup
    setupProjectFiltering();

    // Contact Method Copy Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const contactMethods = document.querySelectorAll('.contact-method');

        contactMethods.forEach(method => {
            const copyButtons = method.querySelectorAll('.copy-btn');
            
            copyButtons.forEach((button, index) => {
                button.addEventListener('click', function() {
                    const contactType = method.dataset.contactType;
                    let textToCopy = '';

                    if (contactType === 'email') {
                        textToCopy = method.querySelector('.contact-value').textContent;
                    } else if (contactType === 'phone') {
                        const phoneNumbers = method.querySelectorAll('.contact-value');
                        textToCopy = phoneNumbers[index].textContent;
                    }

                    // Copy to clipboard
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        button.dataset.copied = 'true';
                        setTimeout(() => {
                            button.dataset.copied = 'false';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                });
            });
        });
    });

    // Contact Card Copy Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const contactCards = document.querySelectorAll('.contact-card');

        contactCards.forEach(card => {
            const copyButtons = card.querySelectorAll('.copy-btn');
            
            copyButtons.forEach(button => {
                button.addEventListener('click', function(event) {
                    event.stopPropagation(); // Prevent card flip
                    const textToCopy = button.getAttribute('data-copy');

                    navigator.clipboard.writeText(textToCopy).then(() => {
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.classList.remove('copied');
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                });
            });
        });
    });
});
