export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm text-slate-600">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo_200X200.png" alt="Al Toque" className="h-4 w-4 rounded" />
            <span className="font-semibold text-slate-900">Al Toque</span>
          </div>
          <p>Spanish for Junior & Leaving Cert. Native teachers. Online classes.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-2">Contact</p>
          <p>info@altoque.ie</p>
          <p>Dublin, Ireland</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-2">Legal</p>
          <p>Terms · Privacy</p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 py-4">© {new Date().getFullYear()} Al Toque</div>
    </footer>
  );
}
