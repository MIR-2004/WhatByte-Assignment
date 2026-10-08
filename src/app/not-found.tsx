import Link from "next/link";
import { ArrowLeft, PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
        <PackageX className="w-8 h-8 stroke-[1.5]" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The page or product you are looking for might have been moved, renamed, or does not exist.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home Catalog</span>
      </Link>
    </div>
  );
}
