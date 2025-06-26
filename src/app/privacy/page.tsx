import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { BrandName } from '@/components/BrandName';
import { FeedbackButton } from '@/components/FeedbackButton';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-300 mb-8">
            Last updated: June 26, 2025
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Privacy-First Design</h2>
              <p className="text-gray-300 leading-relaxed">
                <BrandName variant="dark" /> is built with privacy as a core principle. We believe that your planning sessions should remain private and temporary. This Privacy Policy explains how we handle information when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. No Data Storage Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>We do not store any of your data permanently.</strong> This includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>User stories or estimation details</li>
                <li>Estimation votes or results</li>
                <li>Chat messages or discussions</li>
                <li>Participant names or identities</li>
                <li>Room names or session content</li>
                <li>Historical estimation data</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                All session data exists only in memory during active sessions and is automatically deleted when rooms expire after 30 minutes of inactivity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Temporary Session Data</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                During active sessions, we temporarily process the following information to provide the Service:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Room Information:</strong> Room codes, names, and participant lists</li>
                <li><strong>Estimation Data:</strong> Current story details and voting status</li>
                <li><strong>Real-time Communication:</strong> Messages and updates between participants</li>
                <li><strong>AI Processing:</strong> Story text for analysis and estimation suggestions</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                This data is processed in real-time and never written to persistent storage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. AI Features and Data Processing</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you use AI-powered features for story analysis and estimation suggestions:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Story text is processed by our AI service in real-time</li>
                <li>Analysis is performed without storing the content</li>
                <li>AI responses are generated and delivered immediately</li>
                <li>No training or learning occurs from your session data</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                AI processing is designed to be stateless and privacy-preserving.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Technical Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may collect minimal technical information for service operation:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Connection Data:</strong> Basic connection logs for debugging and performance</li>
                <li><strong>Error Information:</strong> Technical errors to improve service reliability</li>
                <li><strong>Usage Analytics:</strong> Anonymous metrics about feature usage (no personal data)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                This technical data does not include any session content or participant information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Cookies and Local Storage</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <BrandName variant="dark" /> uses minimal browser storage:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Session Storage:</strong> Temporary room connection state (cleared when browser tab closes)</li>
                <li><strong>Local Storage:</strong> User preferences like name (stored locally in your browser only)</li>
                <li><strong>No Tracking Cookies:</strong> We do not use cookies for tracking or analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <BrandName variant="dark" /> integrates with the following services:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Pusher:</strong> For real-time communication (data is not stored)</li>
                <li><strong>AI Services:</strong> For story analysis (requests are processed without storage)</li>
                <li><strong>Hosting Platform:</strong> For application delivery (no user data stored)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                These services are configured to align with our no-storage policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                While we don&rsquo;t store data permanently, we protect information during sessions:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>All communications use encrypted HTTPS connections</li>
                <li>WebSocket connections are secured with TLS</li>
                <li>Room codes provide access control to sessions</li>
                <li>Sessions automatically expire for security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. International Users</h2>
              <p className="text-gray-300 leading-relaxed">
                <BrandName variant="dark" /> can be used from anywhere in the world. Since we don&rsquo;t store personal data, international data transfer regulations are minimally applicable. All session data remains in memory during your session only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Children&rsquo;s Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                <BrandName variant="dark" /> is intended for professional use by development teams. We do not knowingly collect information from children under 13. If you become aware that a child has used our Service, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Your Rights and Control</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Since we don&rsquo;t store your data, you have complete control over your information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>All session data is automatically deleted when sessions expire</li>
                <li>You can leave any session at any time</li>
                <li>Browser storage can be cleared manually if desired</li>
                <li>No account deletion is necessary as no accounts exist</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Changes to Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically to stay informed about how we protect your privacy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">13. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us through our feedback system. We&rsquo;re committed to addressing any privacy concerns you may have.
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
