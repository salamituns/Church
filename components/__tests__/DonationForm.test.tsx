import React from 'react'
import { render, screen } from '@testing-library/react'
import { DonationForm } from '../forms/DonationForm'
import { ToastProvider } from '../ui/toast'

const renderWithToasts = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('DonationForm', () => {
  it('shows the setup message when no Stripe key is provided', () => {
    renderWithToasts(<DonationForm />)

    expect(screen.getByText('Payment System Setup Required')).toBeInTheDocument()
  })

  it('renders the donation form when a Stripe key is provided', () => {
    renderWithToasts(<DonationForm stripePublishableKey="pk_test_123" />)

    expect(screen.queryByText('Payment System Setup Required')).not.toBeInTheDocument()
    expect(screen.getByText('Support Our Church')).toBeInTheDocument()
  })
})
