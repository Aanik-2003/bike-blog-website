"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Tag, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllBlogPosts } from "@/lib/blog";

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const posts = getAllBlogPosts;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(
    ({ post }) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-red-600 text-white text-sm font-bold">
            BIKE BLOG
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Ride Fast, Ride Bold</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            The latest trends, news, and insights from the world of motorcycles and bikes.
          </p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-700 bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-700 h-56 rounded-2xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map(({ slug, post }, index) => (
                <motion.div key={slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Link href={`/${slug}`} className="group block bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-56 perspective-1000">
                      <div className="flip-container">
                        <Image src={post.image[0]} alt={post.title} fill className="flip-front object-cover" />
                        {post.image[1] && (
                          <Image src={post.image[1]} alt={post.title} fill className="flip-back object-cover" />
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-red-400 transition-colors text-white">{post.title}</h2>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-10 space-x-4 items-center">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50">
                Previous
              </button>
              <span className="text-white">Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50">
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
