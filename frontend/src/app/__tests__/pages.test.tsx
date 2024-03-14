import LandingPage from '../login/page'
import LoginPage from '../login/page'
import SignUpPage from '../sign-up/page'
import UserPage from '../user/page'

import {render} from '@testing-library/react'

// Place all page's Snapshot tests here

jest.mock('next/navigation', () => {
  return {
    __esModule: true,
    useRouter: () => ({
      replace: jest.fn(),
      prefetch: jest.fn()
    }),
    useSearchParams: () => ({
      get: () => {}
    })
  }
})

describe('Page Snapshot tests', () => {
    it('Landing Page Snapshot test', () => {
      const { container } = render(<LandingPage />)
      expect(container).toMatchSnapshot()
    })

    it('Login Snapshot test', () => {
      const { container } = render(<LoginPage />)
      expect(container).toMatchSnapshot()
    })

    it('Sign-up Snapshot test', () => {
      const { container } = render(<SignUpPage />)
      expect(container).toMatchSnapshot()
    })

    it('User Page Snapshot test', async () => {
      const Page = await UserPage()
      const { container } = render(Page)
      expect(container).toMatchSnapshot()
    })
})