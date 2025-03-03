import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

test('renders the home page', () => {
    render(<Home />);
    expect(screen.getByText(/get/i)).toBeInTheDocument();
});
