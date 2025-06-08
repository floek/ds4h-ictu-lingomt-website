import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      id: 'cammt',
      title: 'CamMT - Cameroon Machine Translation',
      description: 'A revolutionary translation system for Cameroonian low-resource languages using advanced AI and NLP.',
      features: [
        'Real-time image-to-text translation',
        'Support for 9+ African languages',
        'User-friendly camera interface',
        'Translation history and favorites'
      ],
      technologies: ['React', 'AI/ML', 'Computer Vision', 'NLP'],
      status: 'Active',
      link: '/cammt'
    },
    {
      id: 'corpus',
      title: 'African Language Corpus',
      description: 'Building comprehensive digital corpora for African low-resource languages to support NLP research.',
      features: [
        'Multi-language text datasets',
        'Annotated linguistic data',
        'Speech recognition datasets',
        'Open-source resources'
      ],
      technologies: ['Data Science', 'Linguistics', 'Python', 'XML'],
      status: 'In Development',
      link: '#'
    },
    {
      id: 'dictionary',
      title: 'Digital Dictionary Platform',
      description: 'Interactive digital dictionaries for African languages with pronunciation guides and cultural context.',
      features: [
        'Audio pronunciations',
        'Cultural context',
        'Etymology tracking',
        'Cross-language search'
      ],
      technologies: ['Web Technologies', 'Audio Processing', 'Database'],
      status: 'Planning',
      link: '#'
    }
  ];

  const supportedLanguages = [
    'Ghomala', 'Bafia', 'Bulu', 'Fulfulde DC', 'Fulfulde Adamoua', 
    'Kapsiki', 'Tupurri', 'Igbo', 'Swahili', 'Hausa'
  ];

  const team = [
    {
      name: 'Prof. Dr. Philippe Tamla',
      role: 'Project Director',
      expertise: 'Computational Linguistics, African Languages',
      image: '/img/team/placeholder.jpg'
    },
    {
      name: 'Stephane Donna',
      role: 'AI/NLP Researcher',
      expertise: 'Natural Language Processing, Machine Learning',
      image: '/img/team/placeholder.jpg'
    },
    // {
    //   name: 'Dr. Amadou Ba',
    //   role: 'Language Specialist',
    //   expertise: 'Fulfulde, Linguistic Annotation',
    //   image: '/img/team/placeholder.jpg'
    // },
    // {
    //   name: 'Marie Tchinda',
    //   role: 'Software Engineer',
    //   expertise: 'Full-stack Development, AI Integration',
    //   image: '/img/team/placeholder.jpg'
    // }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="nav-brand">
            <img src="/img/ds4h-logo.png" alt="DS4H ICTU" className="logo" />
            <span className="brand-text">DS4H ICTU</span>
          </div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#publications">Research</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/cammt" className="nav-cta">Try CamMT</Link></li>
          </ul>
          <div className="mobile-menu">
            <i className="fas fa-bars"></i>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Digital Solutions for African Low-Resource Languages</h1>
            <p className="hero-subtitle">
              Advancing Natural Language Processing and Machine Learning for African languages 
              through innovative research and technology at DS4H ICTU.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Languages Supported</span>
              </div>
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Active Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">50k+</span>
                <span className="stat-label">Data Points</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link to="/cammt" className="btn btn-primary">
                <i className="fas fa-language"></i>
                Try CamMT Translation
              </Link>
              <a href="#projects" className="btn btn-secondary">
                Explore Projects
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="language-cloud">
              {supportedLanguages.map((lang, index) => (
                <span 
                  key={index} 
                  className="language-tag"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    fontSize: `${Math.random() * 0.5 + 1}em`
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2>About DS4H ICTU</h2>
            <p>
              The Data Science for Health (DS4H) research group at ICTU is dedicated to 
              developing innovative solutions for African low-resource languages.
            </p>
          </div>
          <div className="about-grid">
            <div className="about-item">
              <div className="about-icon">
                <i className="fas fa-microscope"></i>
              </div>
              <h3>Research Excellence</h3>
              <p>
                Conducting cutting-edge research in NLP, machine learning, and computational 
                linguistics for African languages.
              </p>
            </div>
            <div className="about-item">
              <div className="about-icon">
                <i className="fas fa-globe-africa"></i>
              </div>
              <h3>Cultural Preservation</h3>
              <p>
                Preserving and digitizing African languages to ensure cultural heritage 
                is maintained for future generations.
              </p>
            </div>
            <div className="about-item">
              <div className="about-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community Impact</h3>
              <p>
                Building tools and resources that directly benefit African communities 
                and promote linguistic diversity.
              </p>
            </div>
            <div className="about-item">
              <div className="about-icon">
                <i className="fas fa-code"></i>
              </div>
              <h3>Open Innovation</h3>
              <p>
                Developing open-source solutions and sharing research to advance the 
                field of African language technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <div className="section-header">
            <h2>Our Projects</h2>
            <p>
              Innovative solutions addressing the scarcity of digital resources 
              for African low-resource languages.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className={`project-card ${activeProject === project.id ? 'active' : ''}`}
                onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
              >
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                
                <div className="project-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {project.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="project-tech">
                  <h4>Technologies:</h4>
                  <div className="tech-tags">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="project-actions">
                  {project.link !== '#' ? (
                    <Link to={project.link} className="btn btn-primary">
                      Launch Project
                    </Link>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="languages">
        <div className="container">
          <div className="section-header">
            <h2>Supported Languages</h2>
            <p>
              We work with a diverse range of African languages, focusing on those 
              with limited digital resources.
            </p>
          </div>
          <div className="languages-grid">
            {supportedLanguages.map((language, index) => (
              <div key={index} className="language-item">
                <span className="language-name">{language}</span>
                <div className="language-info">
                  <span className="language-status">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team">
        <div className="container">
          <div className="section-header">
            <h2>Our Team</h2>
            <p>
              Meet the researchers and engineers working to advance African language technology.
            </p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-photo">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-expertise">{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="publications">
        <div className="container">
          <div className="section-header">
            <h2>Recent Publications</h2>
            <p>Our latest research contributions to the field.</p>
          </div>
          <div className="publications-list">
            <div className="publication-item">
              <h4>LinguoMT: A Transformer-based Multi Translation System for
Low-Resource Languages - A Case of African Languages</h4>
              <p className="publication-authors">
Prof. Dr. Philippe Tamla, Stephane Donna, Nde Dilan & al</p>
              <p className="publication-venue">Journal of African Language Technology, 2024</p>
              <a href="#" className="publication-link">Read Paper</a>
            </div>
            <div className="publication-item">
              <h4>Building Digital Corpora for Cameroonian Languages</h4>
              <p className="publication-authors">Tchinda, M., Kamdem, S.</p>
              <p className="publication-venue">ACL Workshop on African NLP, 2024</p>
              <a href="#" className="publication-link">Read Paper</a>
            </div>
            <div className="publication-item">
              <h4>Image-to-Text Translation for African Languages</h4>
              <p className="publication-authors">Ba, A., Nkouatchet, J-M.</p>
              <p className="publication-venue">EMNLP 2023</p>
              <a href="#" className="publication-link">Read Paper</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Interested in collaborating or learning more about our work?</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Location</h4>
                  <p>ICTU Campus<br />Yaoundé, Cameroon</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>ds4h@ictuniversity.edu.cm</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>Phone</h4>
                  <p>+237 XXX XXX XXX</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>DS4H ICTU</h4>
              <p>
                Advancing African language technology through research and innovation.
              </p>
              <div className="social-links">
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
                <a href="#"><i className="fab fa-github"></i></a>
                <a href="#"><i className="fab fa-researchgate"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Projects</h4>
              <ul>
                <li><Link to="/cammt">CamMT Translation</Link></li>
                <li><a href="#">African Language Corpus</a></li>
                <li><a href="#">Digital Dictionary</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#publications">Publications</a></li>
                <li><a href="#">Datasets</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>ds4h@ictu.cm</li>
                <li>ICTU Campus, Douala</li>
                <li>Cameroon</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 DS4H ICTU. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;