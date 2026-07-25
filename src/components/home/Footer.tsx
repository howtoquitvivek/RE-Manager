import Link from "next/link";
import { Building2, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <Building2 className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                RE Manager <span className="text-muted-foreground">OS</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              The professional operating system for high-net-worth real estate 
              portfolios and luxury development projects. Built for the future of 
              asset management.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Product</h4>
            <ul className="mt-4 space-y-2">
              {["Features", "AI Intelligence", "Mapping", "Pricing", "Enterprise"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resources</h4>
            <ul className="mt-4 space-y-2">
              {["Documentation", "API Reference", "Guides", "Blog", "Community"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Company</h4>
            <ul className="mt-4 space-y-2">
              {["About", "Careers", "Legal", "Privacy", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/60">
            © 2024 RE Manager OS. All rights reserved. Built with precision for luxury markets.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
