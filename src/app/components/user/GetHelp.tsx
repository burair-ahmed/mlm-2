'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto mt-10 space-y-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold">Get Help & Support</h2>

      {/* Contact Options */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleWhatsApp} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
          <MessageCircle className="w-5 h-5" />
          WhatsApp Support
        </Button>
        <Button onClick={handleEmail} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
          <Mail className="w-5 h-5" />
          Email Us
        </Button>
      </div>

      {/* FAQ Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>How long does it take to process a deposit?</AccordionTrigger>
            <AccordionContent>
              Deposit requests are typically reviewed and approved within 24 hours. Please ensure you upload a valid proof of payment.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>How do I update my account information?</AccordionTrigger>
            <AccordionContent>
              You can update your account info from the Profile section under Settings. Some fields may require admin approval.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>What should I do if my withdrawal is delayed?</AccordionTrigger>
            <AccordionContent>
              If your withdrawal hasn&apos;t been processed in the expected timeframe, please contact us via WhatsApp or email with your transaction ID.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Other Support Options */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Other Support Options</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Visit our <a href="/faq" className="text-blue-600 underline">Help Center</a> for more detailed guides.</li>
          <li>Join our <a href="https://t.me/YourTelegramGroup" target="_blank" className="text-blue-600 underline">Telegram support group</a>.</li>
          <li>Message us on social media: Facebook, Instagram, or Twitter.</li>
        </ul>
      </div>
    </div>
  );
}
