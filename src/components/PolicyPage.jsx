import Footer from './Footer.jsx'
import { usePage } from '../context/RouterContext.jsx'

/* Plain-language store pages. Draft wording for the owner to review. */
const WA = 'https://wa.me/917838026415'

const PAGES = {
  shipping: {
    eyebrow: 'Delivery',
    title: 'Shipping & delivery',
    sections: [
      ['Free delivery', 'Delivery is free on every order, anywhere in India.'],
      ['Dispatch and delivery time', 'Orders are dispatched within 24 hours. Delivery usually takes 2 to 5 days, depending on your pincode.'],
      ['Cash on Delivery', 'Cash on Delivery is available at no extra charge. Pay online by UPI, card or netbanking and save ₹200 on your order. Some offers, such as the Hydra Muscle Double Pack, are online payment only. This is shown on the product page.'],
      ['Tracking', 'Once your order ships, we send your tracking details by email and message.'],
      ['Check your pincode', 'Enter your pincode at checkout to confirm we deliver to you.'],
    ],
  },
  privacy: {
    eyebrow: 'Your data',
    title: 'Privacy policy',
    sections: [
      ['What we collect', 'Your name, phone number, email, delivery address and order details when you check out. If you start checkout but do not finish, we may save your name, phone number, email and cart so we can help you complete your order.'],
      ['How we use it', 'To deliver your order, send order updates, answer your questions and, if you agree, tell you about new products.'],
      ['Payments', 'Online payments are processed by Razorpay. We never see or store your card details.'],
      ['Analytics and ads', 'We use tools such as the Meta Pixel to measure how our ads and website perform. These tools may use cookies.'],
      ['Your choices', 'Message us on WhatsApp or email us to see, correct or delete your information, or to stop messages.'],
      ['Sharing', 'We share your details only with the courier, payment and messaging services needed to serve you. We do not sell your information.'],
    ],
  },
  terms: {
    eyebrow: 'The fine print',
    title: 'Terms of use',
    sections: [
      ['Our products', 'Primal Nutrition products are Ayurvedic Proprietary Medicines, to be used as directed. They are not intended to diagnose, treat, cure or prevent any disease. Consult a physician before use if you take medication or have a medical condition. Not for persons under 18.'],
      ['Prices and orders', 'Prices are in Indian rupees and include applicable taxes. We may cancel an order if a product is unavailable or a pricing error occurs, and will refund any payment received.'],
      ['Results', 'Individual results vary. Customer reviews reflect personal experiences.'],
      ['Governing law', 'These terms are governed by the laws of India.'],
    ],
  },
  contact: {
    eyebrow: 'We are here',
    title: 'Contact us',
    sections: [
      ['WhatsApp', 'Message us on WhatsApp at +91 78380 26415 for orders, delivery, returns, refunds and product questions. A person replies.', WA, 'Open WhatsApp'],
      ['Email', 'salesmanager@primalnutrition.in'],
      ['Marketed by', 'Primal Nutrition (a unit of Jiyo Ayurveda Pvt. Ltd.), No. 5, FF, Sec-8 Market, Rama Krishna Puram, New Delhi 110022.'],
      ['Licences', 'Mfg. Lic. No. AL946M · FSSAI Lic. No. 13326998000382'],
    ],
  },
  about: {
    eyebrow: 'Our story',
    title: 'About Primal Nutrition',
    sections: [
      ['Why we exist', 'Primal Nutrition makes Ayurvedic strength and vitality supplements for Indian men. We were started by a professional powerlifter from a family with more than 60 years in Ayurvedic manufacturing.'],
      ['How we make it', 'Rare herbs, sourced at origin and made the traditional way, in a clean, GMP-certified facility in Siliguri, West Bengal. Every batch is tested by an independent laboratory before it ships.'],
      ['What we refuse', 'Chemical shortcuts, performance-enhancing drugs, proprietary blends and fake heritage.'],
    ],
  },
}

export default function PolicyPage({ which }) {
  const { navigate } = usePage()
  const p = PAGES[which] || PAGES.contact
  return (
    <>
      <section className="pt-28 pb-24">
        <div className="container-x max-w-3xl">
          <nav className="mb-8 text-xs uppercase tracking-widest text-bone/45 flex items-center gap-2 font-brand">
            <button onClick={() => navigate('home')} className="hover:text-amber transition">Home</button>
            <span>/</span>
            <span className="text-bone/80">{p.title}</span>
          </nav>
          <div className="eyebrow mb-5">{p.eyebrow}</div>
          <h1 className="font-display text-5xl lg:text-7xl font-bold tracking-tight leading-[1] mb-12">{p.title}</h1>
          <div className="space-y-9">
            {p.sections.map(([h, body, href, cta]) => (
              <div key={h} className="border-t border-bone/10 pt-6">
                <h2 className="font-display text-2xl mb-2">{h}</h2>
                <p className="text-bone/70 leading-relaxed text-[17px]">{body}</p>
                {href && <a href={href} target="_blank" rel="noreferrer" className="btn-ghost text-sm mt-4 inline-block">{cta} →</a>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
