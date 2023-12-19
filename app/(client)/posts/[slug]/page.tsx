import Header from "@/app/components/Header";
import { Post } from "@/app/utils/interface";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { VT323 } from "next/font/google";
import Link from "next/link";
import React from "react";

interface Params {
  params: {
    slug: string;
  };
}

const dateFont = VT323({ weight: "400", subsets: ["latin"] });

async function getPost(slug: string) {
  const query = `
  *[_type == "post" && slug.current == "${slug}"][0] {
    title,
    slug,
    publishedAt,
    excerpt,
    _id,
    body,
    tags[]-> {
      _id,
      slug,
      name
    }
  } `;

  const post = await client.fetch(query);
  return post;
}

const page = async ({ params }: Params) => {
  console.log(params, "params");
  const post: Post = await getPost(params?.slug);
  console.log(post, "post");
  return (
    <div>
      <Header title={post?.title} />
      <div className="text-center">
        <span className={`${dateFont.className} my-2 text-purple-800`}>
          {new Date(post?.publishedAt).toDateString()}
        </span>
        <div className="mt-5">
          {post?.tags?.map((tag) => (
            <Link key={tag?._id} href={`/tag/${tag.slug.current}`}>
              <span className="mr-2 p-1 rounded-sm text-sm lowercase dark:bg-gray-950 border dark:border-gray-900">
                #{tag.name}
              </span>
            </Link>
          ))}
        </div>
        <div className={richTextStyle}>
          <PortableText value={post.body} />
        </div>
      </div>
    </div>
  );
};

export default page;

const richTextStyle = `
mt-14
text-justify
max-w-2xl
m-auto
prose-heading:my-5
prose-heading:text-2xl
prose-p:mb-5
prose-p:leading-7
prose-li:list-disc
prose-li:leading-7
prose-li:ml-4
`;
