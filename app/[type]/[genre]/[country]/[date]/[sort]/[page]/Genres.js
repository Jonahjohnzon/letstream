export const tvGenre = [
  { "id": 10759, "name": "Action & Adventure" },
  { "id": 35, "name": "Comedy" },
  { "id": 80, "name": "Crime" },
  { "id": 99, "name": "Documentary" },
  { "id": 18, "name": "Drama" },
  { "id": 10751, "name": "Family" },
  { "id": 10762, "name": "Kids" },
  { "id": 9648, "name": "Mystery" },
  { "id": 10763, "name": "News" },
  { "id": 10764, "name": "Reality" },
  { "id": 10765, "name": "Sci-Fi & Fantasy" },
  { "id": 10766, "name": "Soap" },
  { "id": 10767, "name": "Talk" },
  { "id": 10768, "name": "War & Politics" },
  { "id": 37, "name": "Western" },
]

export const movieGenre = [
  { "id": 28, "name": "Action" },
  { "id": 12, "name": "Adventure" },
  { "id": 16, "name": "Animation" },
  { "id": 35, "name": "Comedy" },
  { "id": 80, "name": "Crime" },
  { "id": 99, "name": "Documentary" },
  { "id": 18, "name": "Drama" },
  { "id": 10751, "name": "Family" },
  { "id": 14, "name": "Fantasy" },
  { "id": 36, "name": "History" },
  { "id": 27, "name": "Horror" },
  { "id": 10402, "name": "Music" },
  { "id": 9648, "name": "Mystery" },
  { "id": 10749, "name": "Romance" },
  { "id": 878, "name": "Science Fiction" },
  { "id": 10770, "name": "TV Movie" },
  { "id": 53, "name": "Thriller" },
  { "id": 10752, "name": "War" },
  { "id": 37, "name": "Western" },
]

// A curated shortlist rather than TMDB's full ~250-country list — keeps the
// dropdown scannable. Add more as you need them.
export const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'ES', name: 'Spain' },
  { code: 'DE', name: 'Germany' },
  { code: 'BR', name: 'Brazil' },
]

// Single source of truth for the three sort modes. `field` differs by
// type (movie vs tv), which is why it's a function — Category.jsx resolves
// it at fetch time instead of duplicating the mapping.
export const sortOptions = [
  {
    id: '1',
    label: 'Most Popular',
    field: () => 'popularity.desc',
  },
  {
    id: '2',
    label: 'Highest Rated',
    field: () => 'vote_average.desc',
    // Sorting purely by vote_average surfaces obscure titles with a
    // single 10/10 vote. Pairing it with a minimum vote count is TMDB's
    // own recommended pattern for a meaningful "highest rated" list.
    minVoteCount: 50,
  },
  {
    id: '3',
    label: 'Most Recent',
    // Latest release within the selected year first.
    field: (type) => `${type === 'movie' ? 'primary_release_date' : 'first_air_date'}.desc`,
  },
]

export const ratingOptions = [
  { value: '', label: 'Any Rating' },
  { value: '9', label: '9+ Rating' },
  { value: '8', label: '8+ Rating' },
  { value: '7', label: '7+ Rating' },
  { value: '6', label: '6+ Rating' },
]