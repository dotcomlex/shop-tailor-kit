export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper/80">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-bold text-paper">
              VitalWalk<span className="text-brand">®</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/70">
              Adjustable comfort shoes designed for swollen, aching feet.
              Trusted by 10,297+ seniors across the US.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-paper">Help</p>
            <ul className="space-y-2 text-sm text-paper/70">
              <li>Contact Us</li>
              <li>Order Tracking</li>
              <li>Size Guide</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-paper">Policies</p>
            <ul className="space-y-2 text-sm text-paper/70">
              <li>Shipping</li>
              <li>Returns &amp; Refunds</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-paper">Promise</p>
            <ul className="space-y-2 text-sm text-paper/70">
              <li>60-Day Guarantee</li>
              <li>Free US Shipping</li>
              <li>Secure Checkout</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-6 text-xs text-paper/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} VitalWalk. All rights reserved.</p>
          <div className="flex gap-2">
            {["VISA", "MC", "AMEX", "PAYPAL", "AFFIRM"].map((p) => (
              <span key={p} className="rounded border border-paper/20 px-2 py-1 text-[10px] font-bold tracking-wider">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
