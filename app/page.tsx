"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useMotionValue, animate, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MountainIcon, MenuIcon } from "lucide-react"
// Import Dialog components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Define a type for Feature data
interface Feature {
  image: string
  alt: string
  title: string
  description: string
  longDescription: string // Added for detailed view
}

// Helper component for animated counter display
interface AnimatedCounterProps {
  value: number
  decimals?: number
  suffix?: string
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, decimals = 0, suffix = "" }) => {
  const count = useMotionValue(0)
  const ref = useRef<HTMLSpanElement>(null) // Ref for this specific counter's DOM element
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 1.5, ease: "easeOut" })
    }
  }, [count, value, isInView])

  // Create a new MotionValue that formats the number and adds the suffix
  const formattedCount = useTransform(count, (latest) => `${latest.toFixed(decimals)}${suffix}`)

  return (
    // Render the formatted MotionValue directly as the child of motion.span
    <motion.span ref={ref}>{formattedCount}</motion.span>
  )
}

export default function Component() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null) // Ref for the entire stats section
  const faqRef = useRef<HTMLDivElement>(null) // Ref for FAQ section
  const ctaRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null) // New ref for the About section

  // State for feature dialog
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const featuresData: Feature[] = [
    {
      image: "/images/blazing-fast-performance.png", // Updated image source
      alt: "Speedometer showing fast performance", // Updated alt text
      title: "Blazing Fast Performance",
      description: "Optimized for speed, ensuring your applications run smoothly and efficiently.",
      longDescription:
        "Our platform is engineered for unparalleled speed and responsiveness. Leveraging cutting-edge technologies and optimized algorithms, we ensure that your applications load instantly and perform seamlessly, even under heavy loads. Experience a fluid user interface and rapid data processing that keeps you ahead.",
    },
    {
      image: "/images/real-time-collaboration.png", // Updated image source
      alt: "Laptop with puzzle pieces and app icons representing collaboration", // Updated alt text
      title: "Real-time Collaboration",
      description: "Work together seamlessly with live updates and shared workspaces.",
      longDescription:
        "Foster creativity and productivity with our real-time collaboration tools. Teams can work on projects simultaneously, see live updates, and communicate instantly within shared workspaces. This feature eliminates delays and ensures everyone is always on the same page, no matter where they are.",
    },
    {
      image: "/images/robust-security.png", // Updated image source
      alt: "Hand holding a glowing shield icon representing data security", // Updated alt text
      title: "Robust Security",
      description: "Your data is protected with industry-leading encryption and security protocols.",
      longDescription:
        "Security is our top priority. We employ multi-layered security measures, including end-to-end encryption, regular security audits, and compliance with global data protection regulations. Rest assured that your sensitive data is safeguarded against unauthorized access and cyber threats.",
    },
    {
      image: "/images/intuitive-interface.png", // Updated image source
      alt: "Browser window with user interface wireframe and checkmarks", // Updated alt text
      title: "Intuitive Interface",
      description: "Designed for ease of use, making complex tasks simple and accessible.",
      longDescription:
        "Our user interface is crafted with simplicity and efficiency in mind. Navigate through features effortlessly with a clean, uncluttered design and intuitive controls. Whether you're a beginner or an expert, you'll find our platform easy to learn and powerful to use.",
    },
    {
      image: "/images/scalable-infrastructure.png", // Updated image source
      alt: "Tablet displaying data graphs surrounded by abstract data and technology icons", // Updated alt text
      title: "Scalable Infrastructure",
      description: "Grow your operations without worrying about performance limitations.",
      longDescription:
        "Our infrastructure is built to scale with your needs. From small startups to large enterprises, our flexible architecture can handle increasing demands without compromising performance. Expand your operations confidently, knowing our platform will grow with you.",
    },
    {
      image: "/images/24-7-customer-support.png", // Updated image source
      alt: "Person with headset coming out of a phone with '24/7' and 'ONLINE SUPPORT' text", // Updated alt text
      title: "24/7 Customer Support",
      description: "Dedicated support team available around the clock to assist you.",
      longDescription:
        "We are committed to providing exceptional customer service. Our dedicated support team is available 24/7 to assist you with any questions, issues, or technical challenges you may encounter. Get timely and effective solutions whenever you need them.",
    },
  ]

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature)
    setIsFeatureDialogOpen(true)
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-50 bg-primary text-primary-foreground">
        <Link href="#" className="flex items-center justify-center">
          <MountainIcon className="size-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Button
            variant="ghost"
            onClick={() => scrollToSection(featuresRef)}
            className="text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors duration-200"
          >
            Features
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection(statsRef)}
            className="text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors duration-200"
          >
            Stats
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection(faqRef)}
            className="text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors duration-200"
          >
            FAQ
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection(ctaRef)}
            className="text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors duration-200"
          >
            Contact
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection(aboutRef)} // New navigation link
            className="text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors duration-200"
          >
            About
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <MenuIcon className="size-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 py-6">
              <Button variant="ghost" onClick={() => scrollToSection(featuresRef)} className="text-lg font-medium">
                Features
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection(statsRef)} className="text-lg font-medium">
                Stats
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection(faqRef)} className="text-lg font-medium">
                FAQ
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection(ctaRef)} className="text-lg font-medium">
                Contact
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection(aboutRef)} className="text-lg font-medium">
                About
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1">
        {/* New wrapper div for background image */}
        <div
          className="relative w-full bg-background"
          style={{
            backgroundImage: 'url("/images/workspace-background.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Overlay for the background image */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-background/0 z-0" />

          {/* Hero Section */}
          <section ref={heroRef} className="relative z-10 w-full pt-12 md:pt-24 lg:pt-32 overflow-hidden">
            <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
              <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16 items-center relative z-10">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <motion.h1
                    className="lg:leading-tighter text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] text-foreground"
                    variants={itemVariants}
                  >
                    Unlock Your Potential with Our Innovative Platform
                  </motion.h1>
                  <motion.p
                    className="mx-auto max-w-[700px] text-foreground/90 md:text-xl mt-4"
                    variants={itemVariants}
                  >
                    Experience seamless collaboration, powerful tools, and unparalleled support to bring your ideas to
                    life.
                  </motion.p>
                  <motion.div className="space-x-4 mt-8" variants={itemVariants}>
                    <Button
                      onClick={() => scrollToSection(ctaRef)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => scrollToSection(featuresRef)}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section ref={featuresRef} className="relative z-10 w-full py-12 md:py-24 lg:py-32">
            <div className="container space-y-12 px-4 md:px-6">
              <motion.div
                className="flex flex-col items-center justify-center space-y-4 text-center"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, amount: 0.5 }}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                    Key Features
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                    Designed to empower your workflow.
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our platform provides a suite of tools to streamline your operations and boost productivity.
                  </p>
                </motion.div>
              </motion.div>
              <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                {featuresData.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group grid gap-1 bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] cursor-pointer border border-transparent hover:border-primary"
                    initial="hidden"
                    whileInView="visible"
                    variants={itemVariants}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleFeatureClick(feature)} // Add click handler
                  >
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      width="100"
                      height="100"
                      alt={feature.alt}
                      className="mb-4 rounded-lg object-cover"
                    />
                    <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section ref={statsRef} className="relative z-10 w-full py-12 md:py-24 lg:py-32">
            <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6">
              <motion.div
                className="space-y-3"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, amount: 0.5 }}
              >
                <motion.h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight" variants={itemVariants}>
                  Our Achievements
                </motion.h2>
                <motion.p
                  className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={itemVariants}
                >
                  Numbers speak louder than words. See our impact.
                </motion.p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <motion.div
                  className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-md"
                  initial="hidden"
                  whileInView="visible"
                  variants={itemVariants}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <span className="text-5xl font-bold text-primary">
                    <AnimatedCounter value={10000} suffix="+" />
                  </span>
                  <p className="text-lg text-muted-foreground mt-2">Happy Users</p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-md"
                  initial="hidden"
                  whileInView="visible"
                  variants={itemVariants}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-5xl font-bold text-primary">
                    <AnimatedCounter value={500} suffix="+" />
                  </span>
                  <p className="text-lg text-muted-foreground mt-2">Projects Launched</p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-md"
                  initial="hidden"
                  whileInView="visible"
                  variants={itemVariants}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-5xl font-bold text-primary">
                    <AnimatedCounter value={99.9} decimals={1} suffix="%" />
                  </span>
                  <p className="text-lg text-muted-foreground mt-2">Uptime Reliability</p>
                </motion.div>
              </div>
            </div>
          </section>
        </div>{" "}
        {/* End of new wrapper div */}
        {/* FAQ Section */}
        <section ref={faqRef} className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container space-y-12 px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                  FAQ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to the most common questions about our platform.
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              className="mx-auto max-w-3xl"
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Accordion type="single" collapsible className="w-full">
                <motion.div variants={itemVariants}>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                      What is Acme Inc.?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Acme Inc. is an innovative platform designed to streamline your workflow, enhance collaboration,
                      and boost productivity for individuals and teams.
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                      How does it work?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Our platform provides a suite of intuitive tools and features accessible through a user-friendly
                      dashboard. Simply sign up, create your projects, and invite your team members to get started.
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                      Is my data secure?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes, we prioritize your data security. Our platform uses industry-leading encryption and robust
                      security protocols to ensure your information is always protected.
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                      Do you offer customer support?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      We offer comprehensive customer support through various channels, including email, live chat, and
                      a dedicated knowledge base, to assist you with any questions or issues.
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              </Accordion>
            </motion.div>
          </div>
        </section>
        {/* Call to Action Section */}
        <section ref={ctaRef} className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6 md:grid-cols-2 md:gap-12">
            <motion.div
              className="flex items-center justify-center"
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="relative mx-auto aspect-[3/2] overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/cta-illustration.jpeg"
                  width="600"
                  height="400"
                  alt="Tablet with landing page wireframe, glasses, pen, and AirPods"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-xl" />
              </div>
            </motion.div>
            <motion.div
              className="space-y-3 text-center md:text-left"
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight" variants={itemVariants}>
                Ready to get started?
              </motion.h2>
              <motion.p
                className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                variants={itemVariants}
              >
                Join thousands of satisfied users and transform your workflow today.
              </motion.p>
              <motion.div
                className="mx-auto w-full max-w-sm space-y-2 md:mx-0"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, amount: 0.5 }}
              >
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="max-w-lg flex-1 bg-background text-foreground"
                  />
                  <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Sign Up
                  </Button>
                </form>
                <p className="text-xs text-primary-foreground/70">
                  Sign up to get notified when we launch.{" "}
                  <Link href="#" className="underline underline-offset-2 hover:text-primary-foreground">
                    Terms &amp; Conditions
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        {/* About Us Section (New Bottom Section) */}
        <section ref={aboutRef} className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container space-y-12 px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <div className="inline-block rounded-lg bg-white/10 px-3 py-1 text-sm text-white font-medium">
                  About Us
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Innovating for a better future.
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Acme Inc. is dedicated to creating cutting-edge solutions that empower individuals and businesses.
                  With a focus on user-centric design and robust technology, we strive to deliver products that not only
                  meet but exceed expectations. Our mission is to simplify complex tasks and foster a world where
                  technology enhances human potential.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Acme Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Privacy
          </Link>
        </nav>
      </footer>

      {/* Feature Detail Dialog */}
      <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            {selectedFeature && (
              <>
                <DialogTitle className="text-2xl font-bold text-foreground">{selectedFeature.title}</DialogTitle>
                <DialogDescription className="text-muted-foreground">{selectedFeature.description}</DialogDescription>
              </>
            )}
          </DialogHeader>
          {selectedFeature && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <Image
                  src={selectedFeature.image || "/placeholder.svg"}
                  width="200"
                  height="200"
                  alt={selectedFeature.alt}
                  className="rounded-lg object-cover"
                />
              </div>
              <p className="text-foreground leading-relaxed">{selectedFeature.longDescription}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
