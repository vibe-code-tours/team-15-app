import { NeuralCanvas } from '@/features/marketing/components/neural-canvas'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/features/marketing/components/hero'
import { Categories } from '@/features/marketing/components/categories'
import { HowItWorks } from '@/features/marketing/components/how-it-works'
import { ImpactStats } from '@/features/marketing/components/impact-stats'
import { CtaSection, SiteFooter } from '@/features/marketing/components/cta-footer'
import { ScrollProgress } from '@/features/marketing/components/scroll-progress'
import { PremiumShowcase } from '@/features/marketing/components/premium-showcase'
import { Testimonials } from '@/features/marketing/components/testimonials'
import { PremiumFeatures } from '@/features/marketing/components/premium-features'
import { Newsletter } from '@/features/marketing/components/newsletter'
import { ProcessTimeline } from '@/features/marketing/components/process-timeline'
import { PremiumStats } from '@/features/marketing/components/premium-stats'
import { PremiumGallery } from '@/features/marketing/components/premium-gallery'
import { getServerUser } from '@/lib/api/server-auth'

export default async function HomePage() {
  const user = await getServerUser()

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <NeuralCanvas className="fixed inset-0 z-0" />
      <ScrollProgress />
      <SiteHeader user={user} />
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
