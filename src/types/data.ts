interface Feature {
  title: string;
  description: string;
  icon: JSX.Element | any;
}

type NavbarItem = Feature & { link?: string };

export type { Feature, NavbarItem };
