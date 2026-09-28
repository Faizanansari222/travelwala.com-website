import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoaderCircle, MessageCircle, Send } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { services } from '../../data/services'
import Select from '../ui/Select'
import FloatingField from './FloatingField'
import PaperPlaneSuccess from './PaperPlaneSuccess'

const SERVICE_OPTIONS = [
  ...services.map((s) => ({ value: s.title, label: s.title, icon: s.icon })),
  { value: 'Something else', label: 'Something else', icon: MessageCircle },
]

const DEFAULT_VALUES = { name: '', email: '', phone: '', service: '', message: '' }

// Simulated network request — replace with a real API call / email service later.
const fakeSend = () => new Promise((resolve) => setTimeout(resolve, 1200))

export default function ContactForm() {
  const [sentTo, setSentTo] = useState(null)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched', defaultValues: DEFAULT_VALUES })

  const onSubmit = async (data) => {
    await fakeSend(data)
    setSentTo(data.name.trim().split(' ')[0])
    reset()
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PaperPlaneSuccess name={sentTo} onReset={() => setSentTo(null)} />
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            aria-labelledby="contact-form-title"
          >
            <h2 id="contact-form-title" className="text-2xl font-extrabold text-ink md:text-3xl">
              Send us a message
            </h2>
            <p className="mt-2 text-ink/65">Fill in the form and a travel expert will reply within a few hours.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <FloatingField
                id="contact-name"
                label="Full name"
                autoComplete="name"
                error={errors.name}
                {...register('name', {
                  required: 'Please tell us your name.',
                  minLength: { value: 2, message: 'Name should be at least 2 characters.' },
                })}
              />
              <FloatingField
                id="contact-email"
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email}
                {...register('email', {
                  required: 'We need your email to reply.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address.' },
                })}
              />
              <FloatingField
                id="contact-phone"
                label="Phone / WhatsApp"
                type="tel"
                autoComplete="tel"
                error={errors.phone}
                {...register('phone', {
                  required: 'A phone number helps us reach you faster.',
                  pattern: { value: /^\+?[\d\s-]{10,16}$/, message: 'Enter a valid number, e.g. +92 300 0000000.' },
                })}
              />
              <Controller
                name="service"
                control={control}
                rules={{ required: 'Please choose a service.' }}
                render={({ field, fieldState }) => (
                  <Select
                    id="contact-service"
                    label="Service"
                    variant="form"
                    placeholder="Choose a service"
                    options={SERVICE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={fieldState.error}
                  />
                )}
              />
              <FloatingField
                id="contact-message"
                label="Your message"
                as="textarea"
                className="sm:col-span-2"
                error={errors.message}
                {...register('message', {
                  required: 'Please write a short message.',
                  minLength: { value: 10, message: 'Tell us a little more (at least 10 characters).' },
                })}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={isSubmitting ? undefined : { scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-white shadow-lg shadow-accent/30 transition-colors hover:bg-[#e67e17] disabled:cursor-wait disabled:opacity-80 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                <>
                  Send Message <Send size={18} aria-hidden="true" />
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
