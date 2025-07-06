export type NavLink = {
  label: string;
} & ({ link: string; links?: never } | { link?: never; links: NavLink[] });
