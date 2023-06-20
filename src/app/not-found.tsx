import Link from 'next/link'

// issue : https://github.com/vercel/next.js/issues/51132
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/">Home</Link>
      </p>
    </div>
  )
}