'use server'

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function addBook(title, author) {
  try {
    const filePath = path.join(__dirname, '..', '_data', 'all-books.json');
    
    // Read the current books
    const fileContent = await fs.readFile(filePath, 'utf-8');
    let books = [];
    
    try {
      books = JSON.parse(fileContent);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return { success: false, error: 'Failed to parse books data' };
    }
    
    // Ensure books is an array
    if (!Array.isArray(books)) {
      books = [];
    }
    
    // Find the next ID
    let maxId = 0;
    books.forEach(book => {
      if (book.id > maxId) {
        maxId = book.id;
      }
    });
    
    const newId = maxId + 1;
    
    // Create new book object
    const newBook = {
      id: newId,
      title: title.trim(),
      author: author.trim(),
      isLoaned: false
    };
    
    // Append to books array
    books.push(newBook);
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(books, null, 2));
    
    // Revalidate the Book page so other components get fresh data
    revalidatePath('/Book');
    
    return { success: true, id: newId };
  } catch (error) {
    console.error('Error adding book:', error);
    return { success: false, error: error.message };
  }
}
