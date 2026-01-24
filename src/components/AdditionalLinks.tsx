import styles from "./AdditionalLinks.module.css";

interface Link {
  label: string;
  href: string;
}

interface AdditionalLinksProps {
  links: Link[];
}

export default function AdditionalLinks({ links }: AdditionalLinksProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Additional Links</h2>
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
