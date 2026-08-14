export default function Contact() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
      <div className="mt-6 flex flex-col gap-3 text-zinc-600 dark:text-zinc-400">
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
