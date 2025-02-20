"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getAllBlogPosts } from "@/lib/blog";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Props = {
  params: Promise<{
    slug?: string;
  }>;
};

const BlogPost = ({ params }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const resolvedParams = React.use(params);
  const searchParams = useSearchParams();
  const slugFromSearch = searchParams.get("slug");
  const slug = resolvedParams?.slug || slugFromSearch;

  if (!slug) {
    notFound();
  }

  const blogPostEntry = getAllBlogPosts.find((p) => p.slug === slug);
  if (!blogPostEntry) {
    notFound();
  }
  const { post } = blogPostEntry;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-justify pt-14 transition-all duration-500">
        <article className="max-w-4xl mx-auto px-4 py-24 animate-pulse bg-gray-900/70 rounded-lg shadow-xl">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-700 rounded"></div>
          </div>
          <div className="mb-6">
            <div className="h-10 w-full bg-gray-700 rounded"></div>
          </div>
          <div className="mb-8">
            <div className="h-56 bg-gray-700 rounded-2xl"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            <div className="h-4 bg-gray-700 rounded w-3/6"></div>
          </div>
        </article>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-justify pt-14 transition-all duration-500">
      <article className="max-w-4xl mx-auto px-4 py-24 bg-gray-900/70 rounded-lg shadow-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors mb-8 group font-semibold">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium uppercase tracking-wide">
                <Tag className="w-4 h-4" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
            {post.title}
          </h1>
          <p className="text-2xl text-red-500 font-bold mb-4">Price: {post.price}</p>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-red-600">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-white">{post.author.name}</p>
                <p className="text-sm text-gray-400">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
              </div>
            </div>
          </div>

          {post.image.length > 1 ? (
            <Slider {...sliderSettings} className="mb-12">
              {post.image.map((img, index) => (
                <div key={index} className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={img} alt={post.title} fill className="object-cover" priority />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              <Image src={post.image[0]} alt={post.title} fill className="object-cover" priority />
            </div>
          )}


          <div className="prose prose-lg max-w-none text-gray-300 prose-headings:text-white">
            {post.content.map((paragraph) => (
              <p key={paragraph} className="mb-4 leading-relaxed">{paragraph}</p>
            ))}
          </div>


          {post.specs && (
            <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-red-500 pb-2">Specifications</h2>
              <table className="w-full text-gray-300 border-collapse border border-gray-700">
                <tbody>
                  {Object.entries(post.specs).map(([key, value]) => (
                    <tr key={key} className="border border-gray-700">
                      <td className="p-2 font-semibold capitalize border-r border-gray-700">{key}</td>
                      <td className="p-2">{typeof value === "object" ? Object.values(value).map((subValue, index) => <div key={index}>{String(subValue)}</div>) : String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;
