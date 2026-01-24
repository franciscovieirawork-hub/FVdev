import styles from "./SocialLinks.module.css";

interface SocialLink {
  label: string;
  href: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            [{link.label}]
          </a>
        ))}
      </nav>
    </div>
  );
}
