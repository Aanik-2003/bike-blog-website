import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
      <p className="text-gray-600 mb-8">
        Sorry, the blog post you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="text-primary hover:text-primary-dark">
        ← Back to Blog
      </Link>
    </div>
  );
}
