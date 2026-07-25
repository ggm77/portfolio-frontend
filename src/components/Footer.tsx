export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span suppressHydrationWarning>© {new Date().getFullYear()} 서하민</span>
      </div>
    </footer>
  );
}
