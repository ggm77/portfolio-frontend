export interface ContactLink {
  label: string;
  url: string;
  external?: boolean;
}

export const GITHUB_USER = 'ggm77';
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
export const EMAIL = 'shm040806@gmail.com';

export const contactLinks: ContactLink[] = [
  { label: 'GitHub', url: GITHUB_URL, external: true },
  { label: 'Email', url: `mailto:${EMAIL}` },
];

export interface NavItem {
  id: string;
  label: string;
}

export const navItems: NavItem[] = [
  { id: 'about', label: 'about' },
  { id: 'skills', label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'timeline', label: 'timeline' },
  { id: 'contact', label: 'contact' },
];

export const navSectionIds = navItems.map((item) => item.id);
