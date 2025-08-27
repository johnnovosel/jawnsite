import "./globals.css";

export const metadata = {
    title: "Book App",
    description: "Do I have this book?",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
