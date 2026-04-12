import { FaInstagram, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const FOOTER_SECTIONS = [
  {
    title: "Navigation",
    links: [
      { label: "Course Catalog", to: "/courses" },
      { label: "Online Library", to: "/courses" },
      { label: "Student Dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
      { label: "YouTube", href: "https://youtube.com", external: true },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "support@academia.edu", href: "mailto:support@academia.edu", external: true },
      { label: "Help Center", to: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/about" },
      { label: "Terms of Service", to: "/about" },
    ],
  },
];

export const FOOTER_SOCIAL_ICONS = [
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://twitter.com", label: "Twitter", icon: FaXTwitter },
  { href: "https://academia.edu", label: "Website", icon: FaGlobe },
];
