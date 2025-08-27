export const metadata = {
  title: "Goldinvest",
  description: "Daytrade XAU/USD — Plans & Journal"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
