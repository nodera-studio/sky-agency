# Webflow to Next.js Conversion - Agentia Sky

## Project Overview

Convert a Webflow exported website for "Agentia Sky" (a Romanian trademark registration agency) into a modern Next.js 14+ application with App Router, shadcn/ui components, and Framer Motion animations.

**Reference Document:** `/Users/development/Developer/Agentia Sky/docs/research.md` - Contains competitive analysis, SEO strategy, and content requirements for this project. Consult this for context on the business purpose and SEO priorities.

---

## Source Files

**Webflow Export Location:** everything in this folder

The export contains:
- HTML files (multiple pages)
- CSS files (Webflow's generated styles)
- JavaScript files (including webflow.js)
- Images and assets
- Fonts (if any custom fonts)

---

## Target Tech Stack

```
Framework:       Next.js 14+ (App Router)
Language:        TypeScript (strict mode)
Styling:         Tailwind CSS + CSS Modules for Webflow styles
Components:      shadcn/ui
Animations:      Framer Motion
Forms:           React Hook Form + Zod validation
Icons:           Lucide React (already included with shadcn)
Fonts:           next/font (convert any Webflow fonts)
```

---

## Task 1: Project Initialization

Create a new Next.js project with the following configuration:

```bash
npx create-next-app@latest site-sky --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

After initialization, install required dependencies:

```bash
# shadcn/ui setup
npx shadcn@latest init

# Additional dependencies
npm install framer-motion react-hook-form @hookform/resolvers zod

# shadcn components we'll need (install as we use them)
npx shadcn@latest add button card form input textarea label accordion tabs navigation-menu sheet dialog
```

### Project Structure

Create this folder structure:

```
/site-sky
├── /public
│   ├── /images          # All Webflow exported images
│   ├── /fonts           # Custom fonts if any
│   └── /icons           # Favicons, social icons
│
├── /src
│   ├── /app
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Homepage
│   │   ├── globals.css             # Global styles + Webflow CSS
│   │   ├── /servicii
│   │   │   ├── page.tsx            # Services overview
│   │   │   └── /[slug]
│   │   │       └── page.tsx        # Individual service pages
│   │   ├── /preturi
│   │   │   └── page.tsx            # Pricing page
│   │   ├── /despre
│   │   │   └── page.tsx            # About page
│   │   ├── /contact
│   │   │   └── page.tsx            # Contact page
│   │   ├── /faq
│   │   │   └── page.tsx            # FAQ page
│   │   ├── /blog
│   │   │   ├── page.tsx            # Blog listing
│   │   │   └── /[slug]
│   │   │       └── page.tsx        # Blog post page
│   │   ├── sitemap.ts              # Auto-generated sitemap
│   │   └── robots.ts               # Robots.txt config
│   │
│   ├── /components
│   │   ├── /layout
│   │   │   ├── Header.tsx          # Main navigation
│   │   │   ├── Footer.tsx          # Footer
│   │   │   ├── MobileMenu.tsx      # Mobile navigation (Sheet)
│   │   │   └── Logo.tsx            # Logo component
│   │   │
│   │   ├── /sections               # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Process.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── CTA.tsx
│   │   │   ├── Stats.tsx
│   │   │   └── TrustSignals.tsx
│   │   │
│   │   ├── /forms
│   │   │   ├── ContactForm.tsx
│   │   │   └── QuoteForm.tsx
│   │   │
│   │   └── /ui                     # shadcn components (auto-generated)
│   │
│   ├── /lib
│   │   ├── utils.ts                # shadcn utils (cn function)
│   │   └── validations.ts          # Zod schemas for forms
│   │
│   ├── /styles
│   │   └── webflow-legacy.css      # Any Webflow CSS we need to keep temporarily
│   │
│   ├── /hooks
│   │   └── useMediaQuery.ts        # For responsive logic
│   │
│   └── /data
│       ├── services.ts             # Hardcoded services data
│       ├── testimonials.ts         # Hardcoded testimonials
│       ├── faq.ts                  # Hardcoded FAQ items
│       └── navigation.ts           # Navigation structure
│
├── /prisma                         # For future v2
│   └── schema.prisma
│
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## Task 2: HTML to JSX Conversion Rules

Apply these transformations systematically to ALL HTML files:

### 2.1 Attribute Changes

```html
<!-- BEFORE (Webflow HTML) -->
<div class="hero-section" data-w-id="abc123">
<img src="/images/logo.png" class="nav-logo" alt="">
<a href="/services" class="nav-link w-nav-link">Services</a>
<input type="email" class="form-input w-input" maxlength="256" placeholder="Email">
<label for="email" class="form-label">Email</label>
<textarea class="form-textarea w-input"></textarea>
<button type="submit" class="submit-button w-button">Submit</button>

<!-- AFTER (Next.js JSX) -->
<div className="hero-section">
<Image src="/images/logo.png" className="nav-logo" alt="Agentia Sky Logo" width={150} height={40} />
<Link href="/servicii" className="nav-link">Servicii</Link>
{/* Form inputs will use shadcn - see Task 5 */}
```

### 2.2 Complete Transformation Checklist

| Webflow | Next.js | Notes |
|---------|---------|-------|
| `class=""` | `className=""` | All instances |
| `for=""` | `htmlFor=""` | Label elements |
| `<img>` | `<Image>` | Import from next/image, add width/height |
| `<a href="">` (internal) | `<Link href="">` | Import from next/link |
| `<a href="">` (external) | `<a target="_blank" rel="noopener noreferrer">` | Keep as anchor |
| `style="color: red"` | `style={{ color: 'red' }}` | Object syntax |
| `tabindex=""` | `tabIndex=""` | camelCase |
| `colspan=""` | `colSpan=""` | camelCase |
| `rowspan=""` | `rowSpan=""` | camelCase |
| `maxlength=""` | `maxLength=""` | camelCase |
| `autocomplete=""` | `autoComplete=""` | camelCase |
| `onclick=""` | `onClick={}` | Event handlers |
| `<!-- comment -->` | `{/* comment */}` | JSX comments |
| Self-closing tags | Must self-close | `<br />`, `<hr />`, `<img />`, `<input />` |

### 2.3 Remove ALL Webflow-Specific Attributes

Delete these from every element:

```
data-w-id="..."
data-wf-page="..."
data-wf-site="..."
data-animation="..."
data-animation-type="..."
data-duration="..."
data-easing="..."
w-*="" (any attribute starting with w-)
```

### 2.4 Remove ALL Webflow-Specific Classes

Remove these class prefixes/patterns (but keep the custom class names):

```
w-nav
w-nav-brand
w-nav-link
w-nav-menu
w-nav-button
w-nav-overlay
w-dropdown
w-dropdown-btn
w-dropdown-toggle
w-dropdown-list
w-dropdown-link
w-icon-dropdown-toggle
w-tab-menu
w-tab-link
w-tab-content
w-tab-pane
w-slider
w-slider-arrow-left
w-slider-arrow-right
w-slider-nav
w-slide
w-icon-slider-left
w-icon-slider-right
w-form
w-input
w-select
w-checkbox
w-checkbox-input
w-radio
w-radio-input
w-button
w-form-done
w-form-fail
w-embed
w-richtext
w-lightbox
w-lightbox-backdrop
w-lightbox-container
w-lightbox-content
w-video
w-background-video
w-commerce-* (ALL commerce classes)
w-condition-* (ALL conditional visibility classes)
w-dyn-* (ALL dynamic/CMS classes)
```

Keep all custom classes that don't start with `w-`.

---

## Task 3: Delete E-Commerce Elements

**IMPORTANT:** This site does not need e-commerce. Remove ALL of the following:

### 3.1 Delete These HTML Elements Entirely

- Any element with class containing `w-commerce`
- Cart button/icon in navigation
- Cart modal/drawer
- Product grids
- Add to cart buttons
- Checkout pages/sections
- Price elements tied to products
- Quantity selectors
- Buy now buttons

### 3.2 Delete These Files (if present in export)

```
cart.html
checkout.html
order-confirmation.html
products.html
product-template.html
Any file with "commerce" or "cart" or "checkout" in the name
```

### 3.3 Delete E-Commerce JavaScript

In any remaining JS files, remove:
- Cart functionality
- Stripe/payment integrations
- Product quantity handlers
- Checkout form handlers

---

## Task 4: CSS Migration Strategy

### 4.1 Tailwind Configuration

Update `tailwind.config.ts` with Agentia Sky brand colors and fonts:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extract these from Webflow CSS - look for brand colors
        brand: {
          primary: "#...",    // Main brand color
          secondary: "#...",  // Secondary color
          accent: "#...",     // Accent/CTA color
          dark: "#...",       // Dark text/backgrounds
          light: "#...",      // Light backgrounds
        },
        // Keep shadcn defaults for components
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        // Extract from Webflow CSS
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 4.2 CSS Migration Approach

1. **Copy Webflow's normalized/base styles** to `globals.css` (reset, typography basics)
2. **Extract component-specific styles** into CSS Modules or convert to Tailwind
3. **Keep a `webflow-legacy.css`** for any complex styles that are hard to convert immediately
4. **Gradually migrate** complex styles to Tailwind as you work on each component

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* shadcn CSS variables */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

/* Import Webflow legacy styles that haven't been converted yet */
@import "./webflow-legacy.css";

/* Custom utility classes from Webflow that we want to keep */
@layer utilities {
  /* Add any Webflow utilities worth keeping */
}
```

---

## Task 5: Replace Webflow Components with shadcn/ui

### 5.1 Navigation → shadcn NavigationMenu + Sheet

**Webflow navigation:**
```html
<nav class="navbar w-nav">
  <a href="/" class="brand w-nav-brand">Logo</a>
  <nav class="nav-menu w-nav-menu">
    <a href="/services" class="nav-link w-nav-link">Services</a>
    ...
  </nav>
  <div class="menu-button w-nav-button">
    <div class="menu-icon w-icon-nav-menu"></div>
  </div>
</nav>
```

**Convert to:**
```tsx
// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Acasă", href: "/" },
  {
    name: "Servicii",
    href: "/servicii",
    children: [
      { name: "Înregistrare Marcă OSIM", href: "/servicii/inregistrare-marca-osim" },
      { name: "Marcă Europeană EUIPO", href: "/servicii/marca-europeana-euipo" },
      { name: "Marcă Internațională WIPO", href: "/servicii/marca-internationala-wipo" },
    ],
  },
  { name: "Prețuri", href: "/preturi" },
  { name: "Despre Noi", href: "/despre" },
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="Agentia Sky"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigation.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              {child.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button */}
        <Button asChild className="hidden md:inline-flex">
          <Link href="/contact">Contact</Link>
        </Button>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Deschide meniul</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-2 flex flex-col space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button asChild className="mt-4">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

### 5.2 Tabs → shadcn Tabs

**Webflow tabs:**
```html
<div class="tabs w-tabs">
  <div class="tabs-menu w-tab-menu">
    <a class="tab-link w-tab-link w--current">Tab 1</a>
    <a class="tab-link w-tab-link">Tab 2</a>
  </div>
  <div class="tabs-content w-tab-content">
    <div class="tab-pane w-tab-pane w--tab-active">Content 1</div>
    <div class="tab-pane w-tab-pane">Content 2</div>
  </div>
</div>
```

**Convert to:**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="tab1" className="w-full">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### 5.3 Accordion/FAQ → shadcn Accordion

**Webflow dropdown/accordion:**
```html
<div class="faq-item">
  <div class="faq-question">Question?</div>
  <div class="faq-answer">Answer...</div>
</div>
```

**Convert to:**
```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { question: "Cât durează înregistrarea?", answer: "Procesul durează 8-11 luni..." },
  { question: "Ce documente am nevoie?", answer: "Aveți nevoie de..." },
];

<Accordion type="single" collapsible className="w-full">
  {faqs.map((faq, index) => (
    <AccordionItem key={index} value={`item-${index}`}>
      <AccordionTrigger>{faq.question}</AccordionTrigger>
      <AccordionContent>{faq.answer}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

### 5.4 Forms → shadcn Form + React Hook Form + Zod

**Webflow form:**
```html
<form class="contact-form w-form">
  <input type="text" class="w-input" name="name" placeholder="Nume">
  <input type="email" class="w-input" name="email" placeholder="Email">
  <textarea class="w-input" name="message" placeholder="Mesaj"></textarea>
  <button type="submit" class="submit-btn w-button">Trimite</button>
  <div class="w-form-done">Success message</div>
  <div class="w-form-fail">Error message</div>
</form>
```

**Convert to:**
```tsx
// src/lib/validations.ts
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Adresa de email nu este validă"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Mesajul trebuie să aibă cel puțin 10 caractere"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

```tsx
// src/components/forms/ContactForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setSubmitStatus("loading");
    
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");
      
      setSubmitStatus("success");
      form.reset();
    } catch (error) {
      setSubmitStatus("error");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nume *</FormLabel>
                <FormControl>
                  <Input placeholder="Ion Popescu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ion@exemplu.ro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+40 7XX XXX XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Companie</FormLabel>
                <FormControl>
                  <Input placeholder="Numele companiei" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesaj *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrieți pe scurt ce doriți să protejați..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full sm:w-auto" disabled={submitStatus === "loading"}>
          {submitStatus === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Trimite Mesajul
        </Button>

        {/* Success/Error Messages */}
        <AnimatePresence mode="wait">
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Mesajul a fost trimis cu succes! Vă vom contacta în curând.</span>
            </motion.div>
          )}
          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg"
            >
              <AlertCircle className="h-5 w-5" />
              <span>A apărut o eroare. Vă rugăm încercați din nou.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
}
```

### 5.5 Sliders/Carousels → Framer Motion or embla-carousel

For testimonials carousel, use embla-carousel with shadcn's carousel:

```bash
npx shadcn@latest add carousel
```

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  { name: "Maria Ionescu", company: "TechStart SRL", quote: "..." },
  // ...more
];

<Carousel className="w-full max-w-4xl mx-auto">
  <CarouselContent>
    {testimonials.map((testimonial, index) => (
      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
        <Card>
          <CardContent className="p-6">
            <blockquote className="text-muted-foreground">
              "{testimonial.quote}"
            </blockquote>
            <footer className="mt-4">
              <strong>{testimonial.name}</strong>
              <span className="text-sm text-muted-foreground block">
                {testimonial.company}
              </span>
            </footer>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

---

## Task 6: Framer Motion Animations

Replace ALL Webflow interactions with Framer Motion.

### 6.1 Fade In on Scroll (Most Common)

```tsx
"use client";

import { motion } from "framer-motion";

// Reusable animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Usage in components
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={staggerContainer}
  className="py-20"
>
  <motion.h2 variants={fadeInUp}>Section Title</motion.h2>
  <motion.p variants={fadeInUp}>Description text...</motion.p>
</motion.section>
```

### 6.2 Create Animation Utilities

```tsx
// src/lib/animations.ts
import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// For list items
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
```

### 6.3 Animated Section Wrapper Component

```tsx
// src/components/ui/animated-section.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export function AnimatedSection({
  children,
  className,
  variants = defaultVariants,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
}
```

---

## Task 7: SEO Implementation

### 7.1 Root Layout with Metadata

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://sitesky.ro"),
  title: {
    default: "Agentia Sky | Înregistrare Marcă OSIM, EUIPO, WIPO",
    template: "%s | Agentia Sky",
  },
  description:
    "Agenție de înregistrare mărci comerciale. Protejează-ți brandul la OSIM, EUIPO sau internațional. Prețuri transparente, proces 100% online.",
  keywords: [
    "înregistrare marcă",
    "înregistrare marcă OSIM",
    "marcă comercială",
    "protecție brand",
    "EUIPO",
    "WIPO",
    "proprietate intelectuală",
  ],
  authors: [{ name: "Agentia Sky" }],
  creator: "Agentia Sky",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://sitesky.ro",
    siteName: "Agentia Sky",
    title: "Agentia Sky | Înregistrare Marcă OSIM, EUIPO, WIPO",
    description:
      "Agenție de înregistrare mărci comerciale. Protejează-ți brandul la OSIM, EUIPO sau internațional.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Agentia Sky - Înregistrare Mărci",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentia Sky | Înregistrare Marcă OSIM, EUIPO, WIPO",
    description: "Agenție de înregistrare mărci comerciale.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these after setting up Search Console
    // google: "your-google-verification-code",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Agentia Sky",
  description: "Agenție de înregistrare mărci comerciale",
  url: "https://sitesky.ro",
  logo: "https://sitesky.ro/images/logo.png",
  areaServed: [
    { "@type": "Country", name: "Romania" },
    { "@type": "AdministrativeArea", name: "European Union" },
  ],
  serviceType: [
    "Trademark Registration",
    "OSIM Trademark Filing",
    "EUIPO Trademark Filing",
    "WIPO Trademark Filing",
    "IP Consulting",
  ],
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "București",
    addressCountry: "RO",
  },
  // Add after getting real data
  // aggregateRating: {
  //   "@type": "AggregateRating",
  //   ratingValue: "4.9",
  //   reviewCount: "47"
  // }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### 7.2 Page-Level Metadata Example

```tsx
// src/app/servicii/inregistrare-marca-osim/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Înregistrare Marcă OSIM",
  description:
    "Înregistrare marcă la OSIM de la 1,500 lei. Proces complet, fără bătăi de cap. Consultație gratuită, prețuri transparente.",
  alternates: {
    canonical: "https://sitesky.ro/servicii/inregistrare-marca-osim",
  },
  openGraph: {
    title: "Înregistrare Marcă OSIM | Agentia Sky",
    description: "Înregistrare marcă la OSIM de la 1,500 lei. Proces complet, fără bătăi de cap.",
    url: "https://sitesky.ro/servicii/inregistrare-marca-osim",
  },
};

export default function OSIMServicePage() {
  return (
    // Page content
  );
}
```

### 7.3 Sitemap

```tsx
// src/app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sitesky.ro";

  // Static pages
  const staticPages = [
    "",
    "/servicii",
    "/servicii/inregistrare-marca-osim",
    "/servicii/marca-europeana-euipo",
    "/servicii/marca-internationala-wipo",
    "/preturi",
    "/despre",
    "/contact",
    "/faq",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly" as const,
    priority: route === "" ? 1 : route.includes("servicii") ? 0.9 : 0.7,
  }));

  // TODO: Add dynamic blog posts when CMS is added
  // const blogPosts = await getBlogPosts();
  // const blogUrls = blogPosts.map(post => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }));

  return [...staticPages];
}
```

### 7.4 Robots.txt

```tsx
// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://sitesky.ro/sitemap.xml",
  };
}
```

---

## Task 8: Hardcoded Data Files (v1)

Create these data files for the initial hardcoded version:

```tsx
// src/data/services.ts
export const services = [
  {
    slug: "inregistrare-marca-osim",
    title: "Înregistrare Marcă OSIM",
    shortTitle: "Marcă Națională",
    description: "Protecție pe teritoriul României pentru 10 ani",
    icon: "shield", // Lucide icon name
    price: "de la 1,500 lei",
    timeline: "8-11 luni",
    features: [
      "Verificare disponibilitate marcă",
      "Pregătire documentație completă",
      "Depunere cerere la OSIM",
      "Monitorizare proces",
      "Certificat de înregistrare",
    ],
  },
  {
    slug: "marca-europeana-euipo",
    title: "Marcă Europeană EUIPO",
    shortTitle: "Marcă UE",
    description: "Protecție în toate cele 27 state membre UE",
    icon: "globe-2",
    price: "de la 1,150 EUR",
    timeline: "5-7 luni",
    features: [
      "O singură cerere pentru 27 de țări",
      "Protecție uniformă în toată UE",
      "Verificare baze de date europene",
      "Asistență opoziții",
      "Certificat EUIPO",
    ],
  },
  {
    slug: "marca-internationala-wipo",
    title: "Marcă Internațională WIPO",
    shortTitle: "Marcă Internațională",
    description: "Protecție în peste 130 de țări prin Sistemul Madrid",
    icon: "globe",
    price: "de la 2,500 EUR",
    timeline: "12-18 luni",
    features: [
      "Acoperire globală",
      "Gestionare centralizată",
      "Costuri optimizate pentru mai multe țări",
      "Extindere flexibilă",
      "Monitorizare internațională",
    ],
  },
];

export type Service = (typeof services)[number];
```

```tsx
// src/data/testimonials.ts
export const testimonials = [
  {
    id: 1,
    name: "Maria Ionescu",
    company: "TechStart SRL",
    role: "Fondator",
    quote:
      "Proces rapid și transparent. În 6 luni aveam marca înregistrată la OSIM. Recomand!",
    image: "/images/testimonials/maria.jpg", // Optional
  },
  {
    id: 2,
    name: "Alexandru Popa",
    company: "BrandX Agency",
    role: "Director",
    quote:
      "Am lucrat cu ei pentru 5 mărci europene. Profesionalism impecabil și comunicare excelentă.",
    image: "/images/testimonials/alex.jpg",
  },
  {
    id: 3,
    name: "Elena Dumitrescu",
    company: "Artisan Coffee",
    role: "Proprietar",
    quote:
      "Ca antreprenor, nu aveam timp să mă ocup de birocrație. Ei au gestionat totul.",
    image: "/images/testimonials/elena.jpg",
  },
];

export type Testimonial = (typeof testimonials)[number];
```

```tsx
// src/data/faq.ts
export const faqs = [
  {
    category: "General",
    items: [
      {
        question: "Ce este o marcă comercială?",
        answer:
          "O marcă comercială este un semn distinctiv (cuvânt, logo, combinație) care identifică produsele sau serviciile unei companii și le diferențiază de cele ale concurenței.",
      },
      {
        question: "De ce ar trebui să îmi înregistrez marca?",
        answer:
          "Înregistrarea îți oferă protecție legală exclusivă, dreptul de a interzice altora utilizarea mărcii tale, și posibilitatea de a acționa în justiție împotriva contrafacerilor.",
      },
    ],
  },
  {
    category: "Proces și Durată",
    items: [
      {
        question: "Cât durează înregistrarea unei mărci la OSIM?",
        answer:
          "Procesul complet durează în medie 8-11 luni, incluzând examinarea formală (1-2 luni), publicarea (2 luni pentru opoziții), și eliberarea certificatului.",
      },
      {
        question: "Ce documente am nevoie pentru înregistrare?",
        answer:
          "Aveți nevoie de: datele de identificare ale solicitantului (persoană fizică sau juridică), reprezentarea grafică a mărcii, lista produselor/serviciilor dorite.",
      },
    ],
  },
  {
    category: "Costuri",
    items: [
      {
        question: "Cât costă înregistrarea unei mărci?",
        answer:
          "Costurile variază în funcție de tipul înregistrării: OSIM (național) de la 1,500 lei, EUIPO (european) de la 1,150 EUR, WIPO (internațional) de la 2,500 EUR. Prețurile includ taxele oficiale și serviciile noastre.",
      },
      {
        question: "Pot beneficia de fonduri europene pentru înregistrare?",
        answer:
          "Da! Prin SME Fund, IMM-urile pot recupera până la 75% din costurile de înregistrare a mărcilor. Vă ajutăm cu aplicația.",
      },
    ],
  },
];

export type FAQCategory = (typeof faqs)[number];
export type FAQItem = FAQCategory["items"][number];
```

```tsx
// src/data/process.ts
export const processSteps = [
  {
    step: 1,
    title: "Consultație Gratuită",
    description:
      "Discutăm despre marca ta și stabilim cea mai bună strategie de protecție.",
    icon: "message-circle",
  },
  {
    step: 2,
    title: "Verificare Disponibilitate",
    description:
      "Căutăm în bazele de date pentru a ne asigura că marca ta poate fi înregistrată.",
    icon: "search",
  },
  {
    step: 3,
    title: "Pregătire Documentație",
    description:
      "Pregătim toate documentele necesare și cererea de înregistrare.",
    icon: "file-text",
  },
  {
    step: 4,
    title: "Depunere & Monitorizare",
    description:
      "Depunem cererea și monitorizăm întreg procesul până la finalizare.",
    icon: "send",
  },
  {
    step: 5,
    title: "Certificat de Înregistrare",
    description:
      "Primești certificatul oficial și marca ta este acum protejată legal.",
    icon: "award",
  },
];

export type ProcessStep = (typeof processSteps)[number];
```

---

## Task 9: Delete Webflow JavaScript

**Delete these files entirely:**
- `webflow.js` (or `webflow.*.js`)
- Any Webflow runtime scripts
- jQuery (if included only for Webflow)

**Do NOT delete:**
- Custom scripts you've written
- Third-party integrations you want to keep (analytics, etc.)

All interactivity is now handled by:
- React state (`useState`)
- shadcn/ui components
- Framer Motion

---

## Task 10: Image Optimization

### 10.1 Move Images

```
/webflow-export/images/* → /site-sky/public/images/*
```

### 10.2 Convert All `<img>` to `<Image>`

```tsx
// BEFORE
<img src="/images/hero.jpg" alt="Hero" class="hero-image">

// AFTER
import Image from "next/image";

<Image
  src="/images/hero.jpg"
  alt="Agentia Sky - Înregistrare mărci comerciale"
  width={1200}
  height={600}
  priority // Only for above-the-fold images
  className="hero-image"
/>
```

### 10.3 Responsive Images

```tsx
// For hero/full-width images
<Image
  src="/images/hero.jpg"
  alt="Description"
  fill
  sizes="100vw"
  className="object-cover"
  priority
/>

// For content images
<Image
  src="/images/service-icon.png"
  alt="Service"
  width={64}
  height={64}
  className="h-16 w-16"
/>
```

---

## Task 11: Final Checklist

After conversion, verify:

### Functionality
- [ ] All pages render without errors
- [ ] Navigation works (desktop and mobile)
- [ ] All links point to correct routes
- [ ] Forms submit correctly (test with console.log first)
- [ ] Animations play smoothly
- [ ] No console errors or warnings

### SEO
- [ ] Every page has unique title and description
- [ ] All images have meaningful alt text
- [ ] Structured data validates (test at schema.org validator)
- [ ] Sitemap generates correctly at /sitemap.xml
- [ ] Robots.txt accessible at /robots.txt
- [ ] Canonical URLs set correctly

### Performance
- [ ] Lighthouse score > 90 for Performance
- [ ] No layout shift (CLS < 0.1)
- [ ] Images use next/image optimization
- [ ] No unused CSS/JS

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast sufficient
- [ ] Form labels associated correctly

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Components properly typed
- [ ] No hardcoded strings that should be in data files

---

## Execution Order

1. **Initialize project** (Task 1)
2. **Copy assets** (images, fonts) to `/public`
3. **Set up Tailwind config** with brand colors (Task 4)
4. **Convert Homepage** first as reference (Tasks 2-6)
5. **Extract shared components** (Header, Footer) (Task 5)
6. **Convert remaining pages** one by one
7. **Implement forms** with validation (Task 5.4)
8. **Add animations** systematically (Task 6)
9. **Implement SEO** (Task 7)
10. **Create data files** (Task 8)
11. **Delete Webflow JS** (Task 9)
12. **Optimize images** (Task 10)
13. **Final testing** (Task 11)

---

## Notes for Claude Code

- **Preserve visual design exactly** - The CSS and layout should produce identical visual output
- **Ask for clarification** if Webflow export structure is unclear
- **Create components incrementally** - Don't try to abstract too early
- **Test each page** before moving to the next
- **Reference research.md** for business context and SEO priorities
- **Use Romanian language** for all user-facing text
- **Commit frequently** with descriptive messages
