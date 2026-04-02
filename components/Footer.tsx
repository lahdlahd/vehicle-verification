export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-auto py-5 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-center">
        <p className="text-sm text-zinc-500 tracking-wide">
          Built by{" "}
          <a href="https://x.com/_joelad" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200 underline underline-offset-4">
            Lahd
          </a>
        </p>
      </div>
    </footer>
  );
}
