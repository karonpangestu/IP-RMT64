import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import EpisodeCard from '../EpisodeCard'

// Mock episode data
const mockEpisode = {
  id: '123',
  title: 'Test Episode Title',
  description: 'This is a test episode description that should be displayed in the card.',
  thumbnail: 'https://example.com/thumbnail.jpg',
  sourceUrl: 'https://youtube.com/watch?v=test',
  sourceType: 'youtube',
  formattedDuration: '15:30',
  excerpt: 'This is a test episode excerpt...',
  transcriptSummary: 'This episode covers important business topics.',
  businessIdeasCount: 3,
  frameworksCount: 2,
  insightsCount: 5,
  storiesCount: 1,
  tags: ['Business', 'Strategy', 'Startup'],
  category: 'Business Strategy',
  viewCount: 150,
  publishedAt: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00Z'
}

// Wrapper component to provide router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('EpisodeCard', () => {
  test('renders episode title', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('Test Episode Title')).toBeInTheDocument()
  })

  test('renders episode description excerpt', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('This is a test episode excerpt...')).toBeInTheDocument()
  })

  test('renders transcript summary', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('This episode covers important business topics.')).toBeInTheDocument()
  })

  test('renders business ideas count', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('3 ideas')).toBeInTheDocument()
  })

  test('renders frameworks count', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('2 frameworks')).toBeInTheDocument()
  })

  test('renders insights count', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('5 insights')).toBeInTheDocument()
  })

  test('renders stories count', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('1 stories')).toBeInTheDocument()
  })

  test('renders tags', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('Business')).toBeInTheDocument()
    expect(screen.getByText('Strategy')).toBeInTheDocument()
    expect(screen.getByText('Startup')).toBeInTheDocument()
  })

  test('renders category', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('Business Strategy')).toBeInTheDocument()
  })

  test('renders view count', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  test('renders formatted date', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  test('renders duration', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('15:30')).toBeInTheDocument()
  })

  test('renders source type badge', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('YouTube')).toBeInTheDocument()
  })

  test('renders view episode button', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('View Episode')).toBeInTheDocument()
  })

  test('renders thumbnail when available', () => {
    renderWithRouter(<EpisodeCard episode={mockEpisode} />)
    const thumbnail = screen.getByAltText('Test Episode Title')
    expect(thumbnail).toBeInTheDocument()
    expect(thumbnail.src).toBe('https://example.com/thumbnail.jpg')
  })

  test('renders placeholder when no thumbnail', () => {
    const episodeWithoutThumbnail = { ...mockEpisode, thumbnail: null }
    renderWithRouter(<EpisodeCard episode={episodeWithoutThumbnail} />)
    expect(screen.getByText('Test Episode Title')).toBeInTheDocument()
  })

  test('handles missing optional fields gracefully', () => {
    const minimalEpisode = {
      id: '123',
      title: 'Minimal Episode',
      sourceUrl: 'https://youtube.com/watch?v=test',
      sourceType: 'youtube'
    }
    
    renderWithRouter(<EpisodeCard episode={minimalEpisode} />)
    expect(screen.getByText('Minimal Episode')).toBeInTheDocument()
    expect(screen.getByText('View Episode')).toBeInTheDocument()
  })
})
