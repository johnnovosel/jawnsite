import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'Book', '_data', 'all-books.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const books = JSON.parse(fileContent);

    return Response.json(books);
  } catch (error) {
    console.error('Error reading books:', error);
    return Response.json({ error: 'Failed to read books' }, { status: 500 });
  }
}
