const { useState, useEffect } = React;

// TypewriterText Component
const TypewriterText = ({ texts, typeSpeed = 100, eraseSpeed = 50, delay = 1500 }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const currentText = texts[currentTextIndex];

        let timeout;
        if (isTyping) {
            if (charIndex < currentText.length) {
                timeout = setTimeout(() => {
                    setDisplayText((prev) => prev + currentText[charIndex]);
                    setCharIndex((prev) => prev + 1);
                }, typeSpeed);
            } else {
                timeout = setTimeout(() => {
                    setIsTyping(false);
                }, delay);
            }
        } else {
            if (charIndex > 0) {
                timeout = setTimeout(() => {
                    setDisplayText((prev) => prev.slice(0, -1));
                    setCharIndex((prev) => prev - 1);
                }, eraseSpeed);
            } else {
                timeout = setTimeout(() => {
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
                    setIsTyping(true);
                    setCharIndex(0);
                    setDisplayText('');
                }, 100);
            }
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isTyping, currentTextIndex, texts, typeSpeed, eraseSpeed, delay]);

    return (
        <p className="text-xl md:text-2xl mb-4 typewriter">
            {displayText}
            <span className="cursor">|</span>
        </p>
    );
};

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        "images/carousul1.jpg",
        "images/carousul2.jpg",
        "images/carousul3.jpg",
        "images/carousul4.jpg",
        "images/carousul5.jpg",
        "images/carousul6.jpg"
    ];

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.card').forEach(card => {
            gsap.from(card, {
                y: 100,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        gsap.utils.toArray('.timeline-item').forEach(item => {
            gsap.from(item, {
                x: -100,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('hero-canvas'), alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const particles = new THREE.BufferGeometry();
        const particleCount = 5000;
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 2000;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const material = new THREE.PointsMaterial({ size: 0.005, color: 0x00ffcc });
        const particleSystem = new THREE.Points(particles, material);
        scene.add(particleSystem);

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            particleSystem.rotation.y += 0.001;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                document.getElementById('contactResponse').innerHTML = '<div className="text-green-400">Message sent successfully!</div>';
                form.reset();
            })
            .catch(err => {
                document.getElementById('contactResponse').innerHTML = '<div className="text-red-400">Something went wrong!</div>';
            });
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <div>
            {/* Header */}
            <header className="fixed top-0 w-full bg-black bg-opacity-80 z-50">
                <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <a href="/he" className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-pink-500">Nibir Joydhar</a>
                    <div className="hidden md:flex space-x-6">
                        {['hero', 'about', 'skills', 'projects', 'achievements', 'online-judges', 'education', 'book-me', 'contact'].map(section => (
                            <a key={section} href={`#${section}`} className="nav-link text-sm">{section.charAt(0).toUpperCase() + section.slice(1)}</a>
                        ))}
                    </div>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                    </button>
                </nav>
                {isMenuOpen && (
                    <div className="md:hidden bg-black bg-opacity-90">
                        {['hero', 'about', 'skills', 'projects', 'achievements', 'online-judges', 'education', 'book-me', 'contact'].map(section => (
                            <a key={section} href={`#${section}`} className="block px-4 py-2 nav-link text-sm" onClick={() => setIsMenuOpen(false)}>
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </a>
                        ))}
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
                <canvas id="hero-canvas" className="absolute inset-0"></canvas>
                <div className="container mx-auto px-4 text-center z-10">
                    <img
                        src="images/nibir.png"
                        className="w-40 h-40 md:w-52 md:h-52 rounded-full mx-auto mb-6 border-4 border-green-400 shadow-lg animate-pulse"
                        alt="Nibir Joydhar"
                    />

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-pink-500">
                        Nibir Joydhar
                    </h1>

                    <div className="text-lg md:text-2xl font-medium mb-4">
                        <TypewriterText
                            texts={["Competitive Programmer", "Full Stack Developer", "Tech Enthusiast"]}
                            typeSpeed={100}
                            eraseSpeed={50}
                            delay={1500}
                        />
                    </div>

                    <p className="text-base md:text-lg mb-6 px-4 font-semibold">
                        Specialist on Codeforces | MERN & Laravel Developer | ICPC & IEEEXtreme Contestant
                    </p>

                    <div className="flex justify-center gap-4 md:gap-6 mb-6">
                        <a href="https://flowcv.com/resume/8hhssgqlk5" target="_blank" className="btn btn-primary text-base md:text-lg px-6 py-2">View CV</a>
                        <a href="#book-me" className="btn btn-secondary text-base md:text-lg px-6 py-2">Hire Me</a>
                    </div>

                    <div className="flex justify-center gap-4 md:gap-8">
                        {['linkedin', 'github', 'facebook', 'instagram', 'x', 'envelope', 'whatsapp'].map((platform) => {
                            const isEmail = platform === 'envelope';
                            const isWhatsApp = platform === 'whatsapp';
                            const href = isEmail
                                ? 'mailto:nibirjoydhar@gmail.com'
                                : isWhatsApp
                                    ? 'https://wa.me/8801521546883'
                                    : `https://${platform}.com/nibirjoydhar`;

                            const iconPrefix = isEmail ? 'fas' : 'fab';
                            const iconName = platform === 'x' ? 'twitter' : platform;

                            return (
                                <a key={platform} href={href} target="_blank" rel="noopener noreferrer">
                                    <i className={`${iconPrefix} fa-${iconName} fa-xl md:fa-2xl lg:fa-3xl hover:text-green-400 transition-transform duration-300 hover:scale-125`}></i>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 bg-black bg-opacity-90">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/2">
                            <div className="carousel">
                                <div className="carousel-inner" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                    {slides.map((slide, index) => (
                                        <img key={index} src={slide} className="carousel-item" alt={`Slide ${index + 1}`} />
                                    ))}
                                </div>
                                <button className="carousel-control-prev" onClick={prevSlide}><i className="fas fa-chevron-left"></i></button>
                                <button className="carousel-control-next" onClick={nextSlide}><i className="fas fa-chevron-right"></i></button>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 text-lg card">
                            <h2 className="section-title">About Me</h2>

                            <p>I'm a final year CSE student at Jagannath University, passionate about full-stack development and problem-solving.</p>
                            <p>With 3000+ problems solved across platforms like Codeforces, LeetCode, and AtCoder, I actively compete and represent my university in contests.</p>
                            <p>I love building clean, scalable applications and enjoy mentoring, learning, and exploring the latest in tech.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-16 bg-black bg-opacity-90">
                <div className="container mx-auto px-4">
                    <h2 className="section-title">Skills</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Languages', icon: 'code', items: ['C/C++', 'Java', 'Python', 'PHP', 'JavaScript', 'TypeScript'] },
                            { title: 'Frameworks & Libraries', icon: 'layer-group', items: ['Laravel', 'React', 'Express.js', 'Django', 'Bootstrap, Tailwind CSS', 'jQuery'] },
                            { title: 'Databases', icon: 'database', items: ['MySQL', 'MongoDB', 'Firebase', 'SQL'] },
                            { title: 'DevOps & Tools', icon: 'tools', items: ['Git, GitHub', 'Docker, Kubernetes', 'CI/CD pipelines'] },
                            { title: 'OS & IDEs', icon: 'laptop-code', items: ['Ubuntu, Lubuntu, Windows 7/10/11', 'VS Code, Sublime Text, CodeBlocks', 'NetBeans, PyCharm'] },
                            { title: 'Other Skills', icon: 'user-check', items: ['Problem Solving (2000+ problems solved)', 'Leadership, Teamwork, Communication', 'Photo & Video Editing, Graphics Design'] }
                        ].map(skill => (
                            <div key={skill.title} className="card">
                                <h3><i className={`fas fa-${skill.icon} mr-2`}></i>{skill.title}</h3>
                                <ul className="list-none">
                                    {skill.items.map(item => <li key={item} className="mb-2">{item}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-16 parallax" style={{ backgroundImage: "url('images/bg-projects.jpg')" }}>
                <div className="container mx-auto px-4">
                    <h2 className="section-title">Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Job Board Platform',
                                desc: 'Cloud-based job portal with role-based access, including registration, login, profiles, dashboards, and job posting/searching/applying features.',
                                tech: 'PHP, Bootstrap, MySQL, Docker',
                                repo: 'https://github.com/nibirjoydhar/job-board'
                            },
                            {
                                title: 'CodeJudge',
                                desc: 'Competitive coding platform allowing users to solve problems, view submissions, create contests, and code in multiple languages with an integrated editor.',
                                tech: 'Laravel, Tailwind CSS, MySQL',
                                repo: 'https://github.com/nibirjoydhar/CodeJudge'
                            },
                            {
                                title: 'ResumeAnalyzer',
                                desc: 'AI-powered resume analyzer with features for resume upload, text extraction, skill matching, data storage, and dashboard.',
                                tech: 'MERN Stack (MongoDB, Express.js, React, Node.js)',
                                repo: 'https://github.com/nibirjoydhar/ResumeAnalyzer'
                            },
                            {
                                title: 'Ride Me',
                                desc: 'Android ride-hailing app with features for booking rides, location search, surge pricing, ratings, safety, and profile updates.',
                                tech: 'Java, Firebase',
                                repo: 'https://github.com/nibirjoydhar/RideMe'
                            },
                            {
                                title: 'Organic Food',
                                desc: 'Web app for selling and delivering organic food, featuring shopping, order tracing, reviews, ratings, online payments, and profile updates.',
                                tech: 'PHP, CSS, MySQL',
                                repo: 'https://github.com/nibirjoydhar/OrganicFood'
                            },
                            {
                                title: 'Crop Recommendation',
                                desc: 'Dockerized ML project using Flask to recommend the best crop based on soil and weather conditions.',
                                tech: 'Python (Flask), Machine Learning, Docker',
                                repo: 'https://github.com/nibirjoydhar/Crop_Recommendation'
                            },
                            {
                                title: 'Todo List',
                                desc: 'Simple MERN-based todo list with features for marking and deleting tasks.',
                                tech: 'React, Node.js, MongoDB',
                                repo: 'https://github.com/nibirjoydhar/TodoList'
                            },
                            {
                                title: 'Smart Lock',
                                desc: 'Fingerprint and mobile-controlled smart lock system.',
                                tech: 'Arduino, Java, Solenoid Lock',
                            },
                            {
                                title: 'Line Following Robot',
                                desc: 'Autonomous bot that follows lines and avoids obstacles.',
                                tech: 'Arduino Uno, IR Sensors',
                            }
                        ].map(project => (
                            <div key={project.title} className="card">
                                <h3>{project.title}</h3>
                                <p>{project.desc}</p>
                                <p><strong>Tech:</strong> {project.tech}</p>
                                {project.repo && (
                                    <div className="flex gap-4">
                                        <a href={project.repo} target="_blank" className="text-green-400 hover:underline">Git Repo</a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section id="achievements" className="py-16 bg-black bg-opacity-90">
                <div className="container mx-auto px-4">
                    <h2 className="section-title">Achievements</h2>
                    <div className="max-w-3xl mx-auto">
                        {[
                            { title: '🥇 JnU Intra Programming Contest 2024', desc: 'Champion', link: 'https://toph.co/contests/training/pefv6lt/standings' },
                            { title: '🥇 CSE Sports Carnival 2023', desc: 'Champion', link: 'https://vjudge.net/contest/594718#rank' },
                            { title: '🥈 IEEEXtreme 17.0', desc: '2nd in Bangladesh (Global 556) – Team: JnUxTeam', link: 'https://ieeextreme.org/ieeextreme-17-0-ranking/' },
                            { title: '🏅 IEEEXtreme 18.0', desc: '4th in Bangladesh (Global 420) – Team: JnUxTeam', link: 'https://ieeextreme.org/ieeextreme-18-0-ranking/' },
                            { title: '🏅 IUT National ICT Fest 2024', desc: '27th – Team: JnuXTeam', link: 'https://toph.co/c/iut-11th-national-ict-fest-2024/standings' },
                            { title: '🏅 BUET Inter University Programming Contest 2023', desc: '49th – Team: JnU_ABC', link: 'https://toph.co/c/buet-inter-university-2023/standings' },
                            { title: '🏅 BUET Inter University Programming Contest 2024', desc: '54th – Team: JnU_Shomonnoyok', link: 'https://toph.co/c/inter-university-buet-cse-fest-2024/standings' },
                            { title: '🏅 ICPC Dhaka Regional 2023', desc: '99th – Team: JnU_TLE', link: 'https://bapsoj.org/contests/icpc-dhaka-regional-site-2023/standings' },
                            { title: '📐 National Math Olympiad 2023', desc: 'Participated' }
                        ].map(achievement => (
                            <div key={achievement.title} className="timeline-item">
                                <h3>{achievement.title}</h3>
                                <p>{achievement.desc}</p>
                                {achievement.link && <a href={achievement.link} target="_blank" className="btn btn-primary">View Standing</a>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Online Judges Section */}
            <section id="online-judges" className="py-16 parallax" style={{ backgroundImage: "url('images/bg-judges.jpg')" }}>
                <div className="container mx-auto px-4">
                    <h2 className="section-title">Online Judges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Codeforces', icon: 'code', desc: 'Max Rating: <strong>1580</strong> (Specialist)', link: 'https://codeforces.com/profile/nibirjoydhar', color: 'text-green-400' },
                            { title: 'LeetCode', icon: 'terminal', desc: '~800+ Problems Solved', link: 'https://leetcode.com/nibirjoydhar', color: 'text-yellow-400' },
                            { title: 'CodeChef', icon: 'laptop-code', desc: 'Max Rating: <strong>4★</strong>', link: 'https://www.codechef.com/users/nibirjoydhar', color: 'text-pink-400' },
                            { title: 'Coding Ninjas', icon: 'user-graduate', desc: 'Max Rating: <strong>2439</strong>', link: 'https://www.codingninjas.com/studio/profile/nibirjoydhar', color: 'text-blue-400' },
                            { title: 'Toph', icon: 'code', desc: '~300+ Problems Solved', link: 'https://toph.co/u/nibirjoydhar', color: 'text-cyan-400' },
                            { title: 'LightOJ', icon: 'laptop-code', desc: '~200+ Problems Solved', link: 'https://lightoj.com/user/nibirjoydhar', color: 'text-gray-400' }
                        ].map(judge => (
                            <div key={judge.title} className="card text-center">
                                <i className={`fas fa-${judge.icon} fa-3x ${judge.color} mb-4`}></i>
                                <h3>{judge.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: judge.desc }}></p>
                                <a href={judge.link} target="_blank" className="btn btn-primary">Visit</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Education & Organization Section */}
            <section id="education" className="py-16 bg-black bg-opacity-90">
                <div className="container mx-auto px-4">
                    <h2 className="section-title">Education & Organization</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'B.Sc. in Computer Science & Engineering', icon: 'university', desc: 'Jagannath University, Dhaka<br>CGPA: 3.53 (till 4-1)', color: 'text-green-400' },
                            { title: 'Member, Competitive Programming Club', icon: 'users', desc: 'Jagannath University<br>Since 2020', color: 'text-blue-400' },
                            { title: 'Member, IEEE Student Branch', icon: 'microchip', desc: 'Jagannath University<br>Since 2023', color: 'text-yellow-400' },
                            { title: 'Team Leader, JnU_TLE', icon: 'code', desc: 'ICPC Dhaka Regional 2023<br>Team: JnU_TLE', color: 'text-pink-400' }
                        ].map(edu => (
                            <div key={edu.title} className="card">
                                <i className={`fas fa-${edu.icon} fa-2x ${edu.color} mb-4`}></i>
                                <h3>{edu.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: edu.desc }}></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Research Work Section */}
            <section id="research" className="py-16 bg-black bg-opacity-90">
                <div className="container mx-auto px-8"> {/* Increased from px-4 to px-8 */}
                    <h2 className="section-title">Research Work</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            {
                                title: 'Vulnerability Detection in C/C++ Source Code Using VulBERTa',
                                icon: 'shield-alt',
                                desc: `
                        <strong>Objective:</strong> Developing an advanced machine learning model to detect vulnerabilities in C/C++ source code, enhancing software security and reliability.<br>
                        <strong>Methodology:</strong> Applied hybrid tokenization techniques on the Vuldeepecker and Draper datasets to preprocess and analyze source code. Fine-tuned RoBERTa-based models, including Multi-Layer Perceptron (MLP) and Convolutional Neural Network (CNN) architectures, to improve detection accuracy and efficiency.<br>
                        <strong>Technologies:</strong> Python, PyTorch, Transformers, TensorFlow, Clang, MLflow.<br>
                        <strong>Impact:</strong> Aims to contribute to secure software development by automating vulnerability detection, reducing manual auditing efforts, and improving the robustness of critical systems.<br>
                        <strong>Status:</strong> Ongoing research with preliminary results showing improved precision in identifying common vulnerabilities such as buffer overflows and memory leaks.
                    `,
                                color: 'text-purple-400'
                            }
                        ].map(research => (
                            <div key={research.title} className="card">
                                <i className={`fas fa-${research.icon} fa-2x ${research.color} mb-4`}></i>
                                <h3>{research.title}</h3>
                                <p className="text-justify" dangerouslySetInnerHTML={{ __html: research.desc }}></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Book Me Section */}
            <section id="book-me" className="py-16 bg-black bg-opacity-90">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="section-title">Book a Meeting</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">Interested in collaborating or discussing a project? Schedule a 30-minute consultation to explore how I can help with your development needs.</p>
                    <a href="https://calendly.com/nibirjoydhar/30min" target="_blank" className="btn btn-primary text-lg px-8 py-3">Schedule a Consultation</a>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-8 md:py-12 md:px-20 bg-gradient-to-r from-green-500 to-pink-500">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h2 className="section-title text-xl md:text-2xl mb-4">Get in Touch</h2>
                            <p><i className="fas fa-envelope mr-2"></i>
                                <a href="mailto:nibirjoydhar@gmail.com" className="text-white">nibirjoydhar@gmail.com</a>
                            </p>
                            <p><i className="fas fa-phone mr-2"></i>
                                <a href="tel:+8801521546883" className="text-white">+880 1521 546 883</a>
                            </p>
                            <p><i className="fab fa-whatsapp mr-2"></i>
                                <a href="https://wa.me/8801521546883" className="text-white" target="_blank">Chat on WhatsApp</a>
                            </p>
                            <p><i className="fab fa-discord mr-2"></i>
                                <a href="https://discord.com/users/nibirjoydhar" className="text-white" target="_blank">Join me on Discord</a>
                            </p>
                            <p><i className="fas fa-map-marker-alt mr-2"></i>
                                Jagannath University, Dhaka, Bangladesh
                            </p>
                            <p><i className="fas fa-clock mr-2"></i>
                                Available: 9 AM – 9 PM (GMT+6)
                            </p>
                            <p><i className="fas fa-user-tie mr-2"></i>
                                Open to freelance, remote, or collaborative opportunities
                            </p>
                        </div>

                        <form id="contactForm" onSubmit={handleSubmit} action="https://formspree.io/f/xnnddzow" method="POST">
                            <div className="mb-2">
                                <label htmlFor="name" className="block mb-1 text-sm">Your Name</label>
                                <input type="text" className="form-control" name="name" required />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="email" className="block mb-1 text-sm">Your Email</label>
                                <input type="email" className="form-control" name="email" required />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="message" className="block mb-1 text-sm">Message</label>
                                <textarea className="form-control" name="message" rows="3" required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary text-sm">Send Message</button>
                            <div id="contactResponse" className="mt-2"></div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-green-400">Quick Links</h3>
                            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                                {[
                                    'hero', 'about', 'skills', 'projects',
                                    'achievements', 'online-judges', 'book-me', 'contact'
                                ].map(section => (
                                    <li key={section}>
                                        <a href={`#${section}`} className="hover:text-green-400">
                                            {section.charAt(0).toUpperCase() + section.slice(1)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4 text-green-400">Contact Me</h3>
                            <ul className="space-y-2">
                                <li><i className="fas fa-map-marker-alt mr-2"></i>9-10, Chittaranjan Avenue, Dhaka 1100</li>
                                <li><i className="fas fa-phone mr-2"></i>+88 015-215 46883</li>
                                <li><i className="fas fa-envelope mr-2"></i>nibirjoydhar@gmail.com</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-green-400">Follow Me</h3>
                            <div className="flex gap-4">
                                {['linkedin', 'github', 'facebook', 'instagram', 'twitter', 'whatsapp'].map(platform => {
                                    const url =
                                        platform === 'whatsapp'
                                            ? 'https://wa.me/8801521546883'
                                            : `https://${platform}.com/nibirjoydhar`;

                                    return (
                                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                                            <i className={`fab fa-${platform} fa-2x hover:text-green-400`}></i>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <p>© 2025 myPortfolio. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));