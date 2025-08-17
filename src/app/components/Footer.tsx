const Footer = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© <span>2025</span> Co zrobić, gdy Twoja druga połówka nie chce. Wszelkie prawa zastrzeżone.</p>
        <nav className="flex items-center gap-6">
          <a href="#regulamin" className="hover:text-white">Regulamin</a>
          <a href="#polityka" className="hover:text-white">Polityka prywatności</a>
          <a href="mailto:wsparcie@twojplan.pl" className="hover:text-white">Kontakt</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;