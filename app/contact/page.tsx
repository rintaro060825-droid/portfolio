export default function Contact() {
  return (
    // Centred on the whole screen rather than the space under the header
    <div className="pointer-events-none fixed inset-0 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
      <div className="pointer-events-auto mt-6 flex flex-col items-center gap-4 text-lg text-white/75">
        <a
          href="https://instagram.com/med_dropsss"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          Instagram — @med_dropsss
        </a>
        <a
          href="mailto:rintaro060825@gmail.com"
          className="hover:text-foreground"
        >
          Email — rintaro060825@gmail.com
        </a>
      </div>
    </div>
  );
}
