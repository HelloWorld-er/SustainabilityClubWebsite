import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const descDirectory = path.join(process.cwd(), 'public/post-description');
  const postsDirectory = path.join(process.cwd(), 'public/posts');
  
  try {
    const descEntries = await fs.readdir(descDirectory, { withFileTypes: true });
    
    // Only process .md files in post-description
    const descFiles = descEntries.filter(entry => entry.isFile() && entry.name.endsWith('.md'));
    
    const posts = await Promise.all(
      descFiles.map(async (file) => {
        const descFileName = file.name;
        const baseName = descFileName.replace(/\.md$/, '');
        const descPath = path.join(descDirectory, descFileName);
        
        // Find matching original file in public/posts
        const postEntries = await fs.readdir(postsDirectory);
        const originalFileName = postEntries.find(f => f.startsWith(baseName + '.'));
        
        if (!originalFileName) {
          return null;
        }

        const introContent = await fs.readFile(descPath, 'utf8');
        const isPdf = originalFileName.endsWith('.pdf');
        
        // Basic metadata from filename: YYYY-MM-DD-Author-Title
        const parts = baseName.split('-');
        
        let date = parts[0] && parts[1] && parts[2] ? `${parts[0]}-${parts[1]}-${parts[2]}` : new Date().toISOString().split('T')[0];
        let author = parts[3] || "Sustainability Club";
        let title = parts.slice(4).join(' ') || baseName.replace(/-/g, ' ');

        return {
          id: baseName,
          title,
          author,
          date,
          introContent,
          originalUrl: `/posts/${originalFileName}`,
          originalType: isPdf ? 'pdf' : 'markdown'
        };
      })
    );

    // Filter out nulls (posts without original files) and sort by date descending
    const filteredPosts = posts
      .filter(post => post !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return new Response(JSON.stringify(filteredPosts), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
