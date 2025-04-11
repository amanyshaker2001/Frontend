import React from 'react'

const Page = () => {
  return (
    <section>
      <div className='px-4 mx-auto max-w-screen-md'>
        <h2 className='heading text-center'>Kontaktujte nás</h2>
        <p className='mb-8 lg:mb-16 font-light text-center text_para'>
        Máte technický problém? Dajte nám vedieť.
        </p>
        <form action='#' className='space-y-8'>
          <div>
            <label htmlFor='email' className='form_label'>
              Váš email
            </label>
            <input
              type='email'
              id='email'
              placeholder='example@gmail.com'
              className='form_input mt-1'
              />
          </div>
          <div>
            <label htmlFor='Subject' className='form_label'>
              Predmet
            </label>
            <input
              type='text'
              id='subject'
              placeholder='Dajte nám vedieť, ako vám možeme pomôcť'
              className='form_input mt-1'
              />
          </div>
          <div className='sm:col-span-2'>
            <label htmlFor='message' className='form_label'>
              Vaša správa
            </label>
            <textarea
              rows='6'
              type='text'
              id='message'
              placeholder='Vyjadrite sa'
              className='form_input mt-1'
              />
          </div>
          <button type='submit' className='btn rounded sm:w-fit'>
            Odoslať</button>
        </form>
      </div>
    </section>
  )
}

export default Page