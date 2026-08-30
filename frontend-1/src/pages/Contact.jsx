import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

function Contact() {
  return (
    <section className="city-contact-page min-h-[calc(100vh-80px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="city-contact-label text-sm font-bold uppercase tracking-[0.2em]">
            Contact Us
          </p>

          <h1 className="city-contact-heading mt-3 text-4xl font-extrabold sm:text-5xl">
            Get in Touch
          </h1>

          <p className="city-contact-description mx-auto mt-4 max-w-2xl text-lg leading-8">
            Our team is available to help with platform-related questions,
            complaint tracking, and general feedback.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="city-contact-card rounded-3xl border p-8 shadow-lg">
            <h2 className="city-contact-subheading text-2xl font-extrabold">
              Contact Information
            </h2>

            <p className="city-contact-text mt-3 leading-7">
              Reach out to CityPulse AI for support, feedback, or complaint
              assistance.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="city-contact-icon city-contact-icon-blue">
                  <Mail size={22} />
                </div>

                <div>
                  <h3 className="city-contact-item-title font-bold">
                    Email
                  </h3>
                  <p className="city-contact-text mt-1">
                    support@citypulseai.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="city-contact-icon city-contact-icon-green">
                  <Phone size={22} />
                </div>

                <div>
                  <h3 className="city-contact-item-title font-bold">
                    Phone
                  </h3>
                  <p className="city-contact-text mt-1">
                    +91 1800 123 4567
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="city-contact-icon city-contact-icon-orange">
                  <MapPin size={22} />
                </div>

                <div>
                  <h3 className="city-contact-item-title font-bold">
                    Office
                  </h3>
                  <p className="city-contact-text mt-1">
                    Municipal Services Center
                  </p>
                  <p className="city-contact-text">
                    Prayagraj, Uttar Pradesh
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="city-contact-icon city-contact-icon-purple">
                  <Clock size={22} />
                </div>

                <div>
                  <h3 className="city-contact-item-title font-bold">
                    Support Hours
                  </h3>
                  <p className="city-contact-text mt-1">
                    Monday – Friday
                  </p>
                  <p className="city-contact-text">
                    9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="city-contact-card rounded-3xl border p-8 shadow-lg">
            <h2 className="city-contact-subheading text-2xl font-extrabold">
              Send a Message
            </h2>

            <p className="city-contact-text mt-3 leading-7">
              Share your query or feedback with our support team.
            </p>

            <form className="mt-8 space-y-5">
              <div>
                <label className="city-contact-label-text text-sm font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="city-contact-input mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="city-contact-label-text text-sm font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="city-contact-input mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="city-contact-label-text text-sm font-semibold">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className="city-contact-input mt-2 w-full resize-none rounded-xl border px-4 py-3 outline-none"
                />
              </div>

              <button
                type="button"
                className="city-contact-button flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition"
              >
                <Send size={19} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;