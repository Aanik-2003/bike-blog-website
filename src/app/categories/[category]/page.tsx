"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getAllBlogPosts } from "@/lib/blog";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

type Props = {
  params: Promise<{
    category?: string;
  }>;
};

const CategoryPage = ({ params }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const resolvedParams = use(params);
  const category = resolvedParams?.category;

  if (!category) {
    notFound();
  }

  const formattedCategory = category.replace(/-/g, " ").toLowerCase();
  const filteredPosts = getAllBlogPosts.filter(({ post }) =>
    post.tags.some((tag) => tag.toLowerCase() === formattedCategory)
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-justify pt-14">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="h-10 w-40 bg-gray-700 rounded mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="relative h-56 bg-gray-700 rounded-2xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-justify pt-14">
        <div className="max-w-4xl mx-auto px-4 py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            No posts found for {formattedCategory}.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-justify pt-14">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
          {formattedCategory.charAt(0).toUpperCase() +
            formattedCategory.slice(1)}{" "}
          Bikes
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map(({ slug, post }, index) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/${slug}`}
                className="group block bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image[0]}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors text-white">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
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
      </div>
    </div>
  );
};

export default CategoryPage;
