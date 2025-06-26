import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { BrandName } from '@/components/BrandName';
import { FeedbackButton } from '@/components/FeedbackButton';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <div className="flex items-center gap-4">
              <Logo size="md" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-gray-300 mb-8">
            Last updated: June 26, 2025
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using <BrandName variant="dark" /> (the &ldquo;Service&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, you should not use this Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <BrandName variant="dark" /> is a web-based planning poker application that enables teams to estimate user stories collaboratively. The Service includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Real-time collaborative estimation sessions</li>
                <li>AI-powered story analysis and estimation suggestions</li>
                <li>Temporary, session-based rooms with automatic expiration</li>
                <li>No persistent data storage or user accounts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. No Data Storage Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                <BrandName variant="dark" /> is designed with privacy in mind. We do not store any persistent user data, estimation results, or session content. All data is temporary and automatically deleted when sessions expire after 30 minutes of inactivity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. User Responsibilities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                When using <BrandName variant="dark" />, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Use the Service for legitimate business purposes only</li>
                <li>Not attempt to disrupt or interfere with the Service</li>
                <li>Not share room codes with unauthorized individuals</li>
                <li>Respect other participants in estimation sessions</li>
                <li>Not use the Service for any illegal or harmful activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. AI Features and Limitations</h2>
              <p className="text-gray-300 leading-relaxed">
                The AI-powered features in <BrandName variant="dark" /> are provided for assistance and suggestions only. Estimation suggestions and story analysis are not guaranteed to be accurate and should be used as guidance rather than definitive assessments. Final estimation decisions remain with your team.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Service Availability</h2>
              <p className="text-gray-300 leading-relaxed">
                We strive to maintain high availability of the Service, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or technical issues. Rooms automatically expire after 30 minutes of inactivity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                The <BrandName variant="dark" /> application, including its design, code, and branding, is protected by intellectual property rights. You may not copy, modify, or distribute any part of the Service without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-300 leading-relaxed">
                The Service is provided &ldquo;as is&rdquo; without any warranties, expressed or implied. We do not warrant that the Service will be error-free, secure, or continuously available. Use of the Service is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                In no event shall <BrandName variant="dark" /> be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us through our feedback system.
              </p>
              <div className="flex justify-center">
                <FeedbackButton variant="inline" />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 <BrandName variant="dark" />. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
