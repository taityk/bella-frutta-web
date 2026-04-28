import { render, screen } from '@testing-library/react'
import { SectionTitle } from '@/components/ui/SectionTitle'

describe('SectionTitle', () => {
  it('renders label and title', () => {
    render(<SectionTitle label="CONCEPT" title="旬の果物を五感で体験する" />)
    expect(screen.getByText('CONCEPT')).toBeInTheDocument()
    expect(screen.getByText('旬の果物を五感で体験する')).toBeInTheDocument()
  })

  it('applies text-center class when center prop is true', () => {
    const { container } = render(
      <SectionTitle label="TEST" title="テスト" center />
    )
    expect(container.firstChild).toHaveClass('text-center')
  })

  it('does not apply text-center class by default', () => {
    const { container } = render(
      <SectionTitle label="TEST" title="テスト" />
    )
    expect(container.firstChild).not.toHaveClass('text-center')
  })
})
