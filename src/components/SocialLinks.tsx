import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';
import { useSound } from '../hooks/useSound';

const links = [
  {
    name: 'GitHub',
    url: 'https://github.com/juancv3d',
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
    url: 'mailto:juan.villarreal@snowflake.com',
    icon: FaEnvelope,
  },
];

function SocialLinks() {
  const { playHover, playClick } = useSound();

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
          onMouseEnter={playHover}
          onClick={playClick}
        >
          <link.icon />
        </a>
      ))}
    </nav>
  );
}

export default SocialLinks;
