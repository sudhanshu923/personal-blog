import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { slug } from 'github-slugger';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Create a slug from the title
    const postSlug = slug(data.title);
    
    // Create markdown content
    const markdown = `---
title: ${data.title}
description: ${data.description}
pubDate: ${data.pubDate}
heroImage: ${data.heroImage}
---

${data.content}
`;

    // Save the file
    const filePath = join(process.cwd(), 'src', 'content', 'blog', `${postSlug}.md`);
    await writeFile(filePath, markdown, 'utf-8');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}