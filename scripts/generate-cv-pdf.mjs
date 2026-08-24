import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 48;
const MARGIN_TOP = 52;
const MARGIN_BOTTOM = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const cv = {
  name: 'Francisco Vieira',
  title: 'Frontend Developer / Team Lead',
  contactLine: 'Portugal (Remote)  |  +351 932 141 109  |  franciscovieirawork@gmail.com',
  linksLine: 'f-vdev.vercel.app  |  linkedin.com/in/franciscovieiradev  |  github.com/franciscovieirawork-hub',
  summary:
    'Full-stack software developer with a strong frontend focus, specializing in TypeScript and React. Experienced in building scalable web applications, leading teams, and delivering production software in banking, automotive, and education. Comfortable across architecture, clean code, and AI-assisted engineering workflows.',
  skills:
    'TypeScript, React, JavaScript, C#, Next.js, Astro, Redux, Zustand, Node.js, Software Architecture, OOP, Jest, Azure DevOps, CI/CD, Scrum',
  experience: [
    {
      role: 'Frontend Developer | Team Lead',
      company: 'ITSector (Banking - Leading Portuguese Bank)',
      dates: 'April 2023 - Present  |  Portugal (Remote)',
      bullets: [
        'Lead a frontend team with mentoring, code reviews, and day-to-day technical support.',
        'Design and ship scalable banking web applications from requirements to production.',
        'Define frontend architecture, development standards, and CI/CD quality practices.',
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'NTT DATA (BMW Group project)',
      dates: 'January 2023 - March 2023  |  Portugal (Remote)',
      bullets: [
        'Built and maintained customer-facing apps for BMW Group, including the German-market vehicle configurator.',
        'Delivered features with a focus on performance, scalability, and Agile collaboration.',
        'Supported CI/CD pipelines, troubleshooting, and frontend architecture improvements.',
      ],
    },
    {
      role: 'Frontend Developer / Team Leader',
      company: 'Bryte Technologies GmbH i.G.',
      dates: 'May 2021 - January 2023  |  Remote',
      bullets: [
        'Built the Bryte platform from scratch with a scalable React and TypeScript architecture.',
        'Turned product and design requirements into responsive, high-performance UI.',
        'Owned core features, reusable components, and ongoing technical planning.',
      ],
    },
    {
      role: 'Frontend Developer / Team Leader',
      company: 'Tempos Brilhantes',
      dates: 'May 2020 - April 2021  |  Portugal',
      bullets: [
        'Developed web and mobile interfaces for an online education platform.',
        'Led a team of six frontend developers, covering features, architecture, testing, and delivery.',
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'Ibox Web Solutions / Leilao 24',
      dates: 'January 2018 - April 2019  |  Portugal',
      bullets: [
        'Built and maintained client web applications, including an automotive auction platform.',
        'Worked across the full development lifecycle, from requirements to support.',
      ],
    },
  ],
  projects: [
    {
      name: 'DevDrawer - dev-drawer.vercel.app',
      description: 'Full-stack app to visually plan, structure, and organize software projects.',
    },
    {
      name: 'YourCalculator - atuacalculadora.vercel.app',
      description: 'Fiscal and financial calculators tailored for Portugal.',
    },
    {
      name: 'useCall & useCallGraphQL',
      description: 'Typed React hooks for REST and GraphQL, with caching and error handling.',
    },
  ],
};

const escapePdf = (value) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const wrapText = (text, fontSize, maxWidth) => {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  const charWidth = fontSize * 0.5;

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length * charWidth > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
};

const buildPages = () => {
  const pages = [];
  let commands = [];
  let y = PAGE_HEIGHT - MARGIN_TOP;

  const flushPage = () => {
    pages.push(commands);
    commands = [];
    y = PAGE_HEIGHT - MARGIN_TOP;
  };

  const ensureSpace = (needed) => {
    if (y - needed < MARGIN_BOTTOM) flushPage();
  };

  const addText = (text, size, { bold = false, color = '0 0 0' } = {}) => {
    const font = bold ? 'F2' : 'F1';
    commands.push(
      `BT /${font} ${size} Tf ${color} rg ${MARGIN_X.toFixed(2)} ${y.toFixed(2)} Td (${escapePdf(text)}) Tj ET`
    );
  };

  const addLines = (lines, size, options = {}) => {
    const gap = options.gap ?? size + 3;
    for (const line of lines) {
      ensureSpace(gap);
      addText(line, size, options);
      y -= gap;
    }
  };

  addText(cv.name.toUpperCase(), 18, { bold: true });
  y -= 22;
  addText(cv.title, 11);
  y -= 16;
  addText(cv.contactLine, 9, { color: '0.25 0.25 0.25' });
  y -= 13;
  addText(cv.linksLine, 9, { color: '0.25 0.25 0.25' });
  y -= 18;

  const section = (title) => {
    ensureSpace(28);
    addText(title.toUpperCase(), 10, { bold: true });
    y -= 8;
    commands.push(
      `0.85 0.85 0 RG 1.2 w ${MARGIN_X} ${y.toFixed(2)} m ${(PAGE_WIDTH - MARGIN_X).toFixed(2)} ${y.toFixed(2)} l S`
    );
    y -= 14;
  };

  section('Summary');
  addLines(wrapText(cv.summary, 10, CONTENT_WIDTH), 10, { gap: 13 });
  y -= 8;

  section('Skills');
  addLines(wrapText(cv.skills, 10, CONTENT_WIDTH), 10, { gap: 13 });
  y -= 8;

  section('Experience');
  for (const job of cv.experience) {
    ensureSpace(70);
    addText(job.role, 11, { bold: true });
    y -= 14;
    addText(job.company, 10);
    y -= 13;
    addText(job.dates, 9, { color: '0.3 0.3 0.3' });
    y -= 13;
    for (const bullet of job.bullets) {
      const wrapped = wrapText(bullet, 10, CONTENT_WIDTH - 14);
      wrapped.forEach((line, index) => {
        ensureSpace(13);
        addText(index === 0 ? `-  ${line}` : `   ${line}`, 10);
        y -= 13;
      });
    }
    y -= 8;
  }

  section('Selected projects');
  for (const project of cv.projects) {
    ensureSpace(36);
    addText(project.name, 10, { bold: true });
    y -= 13;
    addLines(wrapText(project.description, 10, CONTENT_WIDTH), 10, { gap: 13 });
    y -= 6;
  }

  pages.push(commands);
  return pages;
};

const pageCommands = buildPages();
const objects = [];
const addObject = (content) => {
  objects.push(content);
  return objects.length;
};

const fontRegular = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
const fontBold = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

const contentIds = pageCommands.map((commands) => {
  const stream = commands.join('\n');
  return addObject(`<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`);
});

const pageIds = contentIds.map((contentId) =>
  addObject(
    `<< /Type /Page /Parent PLACEHOLDER /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentId} 0 R >>`
  )
);

const pagesId = addObject(
  `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`
);

pageIds.forEach((id) => {
  objects[id - 1] = objects[id - 1].replace('PLACEHOLDER', `${pagesId} 0 R`);
});

const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
const infoId = addObject(
  `<< /Title (${escapePdf('Francisco Vieira - CV')}) /Author (${escapePdf('Francisco Vieira')}) /Creator (${escapePdf('FVDev')}) >>`
);

let pdf = '%PDF-1.4\n';
const offsets = [0];

objects.forEach((content, index) => {
  offsets.push(Buffer.byteLength(pdf, 'utf8'));
  pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf, 'utf8');
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += '0000000000 65535 f \n';
offsets.slice(1).forEach((offset) => {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
});
pdf += `trailer << /Size ${objects.length + 1} /Root ${catalogId} 0 R /Info ${infoId} 0 R >>\n`;
pdf += `startxref\n${xrefOffset}\n%%EOF`;

const outputPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'francisco-vieira-cv.pdf');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, pdf);
console.log(`Wrote ${outputPath}`);
