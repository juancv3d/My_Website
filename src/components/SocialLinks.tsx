import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';

const links = [
  {
    name: 'GitHub',
    url: 'https://github.com/juan-snowx',
    icon: FaGithub,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/juancv3d',
    icon: FaLinkedin,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/juancv3d/',
    icon: FaInstagram,
  },
  {
    name: 'Email',
    url: 'mailto:juancvilla96@gmail.com',
    icon: FaEnvelope,
  },
];

function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Social links">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          title={link.name}
        >
          <link.icon />
        </a>
      ))}
    </nav>
  );
}

export default SocialLinks;
