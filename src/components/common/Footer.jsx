import { FOOTER_SECTIONS } from "@/data/footerData";
import FooterColumn from "@/components/common/FooterColumn";
import Logo from "@/components/common/Logo";
import { useUserQuery } from "@/queries/authQueries";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: user } = useUserQuery();

  const getHelpCenterLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin/tickets";
      case "teacher":
        return "/teacher/tickets";
      case "student":
        return "/tickets";
      default:
        return "/login";
    }
  };

  const dynamicFooterSections = FOOTER_SECTIONS.map((section) => ({
    ...section,
    links: section.links.map((link) => {
      if (link.label === "Help Center") {
        return { ...link, to: getHelpCenterLink() };
      }
      return link;
    }),
  }));

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-12 justify-between">
          {/* ── Brand Section ── */}
          <div className="lg:max-w-md space-y-5">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering learners and educators worldwide with accessible, high-quality online courses and interactive tools to build a brighter future.
            </p>
          </div>

          {/* ── Link Grid ── */}
          <div className="flex gap-16 sm:gap-24 lg:gap-32">
            {dynamicFooterSections.map((section) => (
              <FooterColumn
                key={section.title}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border" />

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Nexora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
