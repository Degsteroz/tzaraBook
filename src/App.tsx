import { Navigate, Route, Routes } from 'react-router-dom'
import { BookmarksProvider } from './context/BookmarksProvider'
import { getDefaultChapterSlug } from './chapters/registry'
import { AppLayout } from './layout/AppLayout'
import { AboutBookPage } from './pages/AboutBookPage'
import { AboutPage } from './pages/AboutPage'
import { BookPage } from './pages/BookPage'

const defaultChapterSlug = getDefaultChapterSlug()

export default function App() {
  return (
    <BookmarksProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Navigate to={`/read/${defaultChapterSlug}`} replace />
            }
          />
          <Route path="read/:slug" element={<BookPage />} />
          <Route path="about-book" element={<AboutBookPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BookmarksProvider>
  )
}
