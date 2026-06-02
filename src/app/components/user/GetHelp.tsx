'use client';

import { 
  CustomAccordion, 
  CustomAccordionItem, 
  CustomAccordionTrigger, 
  CustomAccordionContent 
} from '@/components/custom/CustomAccordion';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function GetHelp() {
  const whatsappNumber = '923001234567'; // Replace with your actual WhatsApp number
  const email = 'support@alashrafholdings.com';

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl glass-panel relative overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-emerald pointer-events-none opacity-10" />

      <div>
        <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2.5">
          <HelpCircle className="h-6 w-6 text-primary text-glow-emerald" />
          <span>Get Help & Support</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1.5">Have questions or need assistance? Our support desk is available to assist you 24/7.</p>
      </div>

      {/* Contact Options */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleWhatsApp} 
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 border border-white/10 hover:bg-white/5 hover:border-primary/30 text-foreground hover:text-primary font-bold text-sm rounded-xl transition-all duration-300 w-full sm:w-auto shadow-md"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400 text-glow-emerald" />
          WhatsApp Support
        </button>
        <button 
          onClick={handleEmail} 
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 border border-white/10 hover:bg-white/5 hover:border-accent/30 text-foreground hover:text-accent font-bold text-sm rounded-xl transition-all duration-300 w-full sm:w-auto shadow-md"
        >
          <Mail className="w-5 h-5 text-accent text-glow-gold" />
          Email Us
        </button>
      </div>

      {/* FAQ Section */}
      <div className="pt-4 border-t border-white/5">
        <h3 className="text-lg font-extrabold text-foreground mb-4">Frequently Asked Questions</h3>
        <CustomAccordion>
          <CustomAccordionItem value="q1">
            <CustomAccordionTrigger value="q1">How long does it take to process a deposit?</CustomAccordionTrigger>
            <CustomAccordionContent value="q1">
              Deposit requests are typically reviewed and approved within 24 hours. Please ensure you upload a valid proof of payment to expedite the validation.
            </CustomAccordionContent>
          </CustomAccordionItem>
          
          <CustomAccordionItem value="q2">
            <CustomAccordionTrigger value="q2">How do I convert units to equity?</CustomAccordionTrigger>
            <CustomAccordionContent value="q2">
              You can navigate to the &quot;Equity Units Converter&quot; tab from your sidebar workspace, enter the quantity you wish to purchase ($10 per unit), and submit the request. It instantly updates your active package capital.
            </CustomAccordionContent>
          </CustomAccordionItem>

          <CustomAccordionItem value="q3">
            <CustomAccordionTrigger value="q3">What should I do if my withdrawal is delayed?</CustomAccordionTrigger>
            <CustomAccordionContent value="q3">
              Standard withdrawals are processed within 24-48 hours. If your transfer hasn&apos;t settled in the expected timeframe, please reach out to support on WhatsApp or email with your transaction reference.
            </CustomAccordionContent>
          </CustomAccordionItem>
        </CustomAccordion>
      </div>

      {/* Other Support Options */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <h3 className="text-lg font-extrabold text-foreground">Other Support Options</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2.5">
          <li>Visit our <a href="/faq" className="text-primary hover:text-primary-foreground font-semibold underline transition-colors">Help Center</a> for comprehensive visual guides.</li>
          <li>Join our official <a href="https://t.me/AlAshrafHoldings" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold transition-colors">Telegram support community</a>.</li>
          <li>Message us on our official social media channels for general announcements.</li>
        </ul>
      </div>
    </div>
  );
}

