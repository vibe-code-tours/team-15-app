import { NeuralCanvas } from '@/components/neural-canvas'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'
import { HowItWorks } from '@/components/how-it-works'
import { ImpactStats } from '@/components/impact-stats'
import { CtaSection, SiteFooter } from '@/components/cta-footer'
import { ScrollProgress } from '@/components/scroll-progress'
import { PremiumShowcase } from '@/components/premium-showcase'
import { Testimonials } from '@/components/testimonials'
import { PremiumFeatures } from '@/components/premium-features'
import { Newsletter } from '@/components/newsletter'
import { ProcessTimeline } from '@/components/process-timeline'
import { PremiumStats } from '@/components/premium-stats'
import { PremiumGallery } from '@/components/premium-gallery'

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <NeuralCanvas className="fixed inset-0 z-0" />
      <ScrollProgress />
      <SiteHeader />
      <Hero />
      <PremiumShowcase />
      <Categories />
      <PremiumFeatures />
      <HowItWorks />
      <ProcessTimeline />
      <ImpactStats />
      <PremiumStats />
      <PremiumGallery />
      <Testimonials />
      <Newsletter />
      <CtaSection />
      <SiteFooter />
    </main>
  )
}
