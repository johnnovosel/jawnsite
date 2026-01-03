import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function GET() {
  try {
    const filePath = path.join(__dirname, '../..', 'Book', '_data', 'all-books.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const books = JSON.parse(fileContent);
    
    return Response.json(books);
  } catch (error) {
    console.error('Error reading books:', error);
    return Response.json(
      { error: 'Failed to read books' },
      { status: 500 }
    );
  }
}
