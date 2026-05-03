export const FOOTER_SECTIONS = [
  {
    title: "Platform",
    links: [
      { label: "Home", to: "/" },
      { label: "Browse Courses", to: "/courses" },
      { label: "About Us", to: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "support@nexora.com", href: "mailto:support@nexora.com", external: true },
      { label: "Help Center", to: "/login" }, // Dynamically replaced in Footer.jsx
    ],
  },
];
