import Link from "next/link";

const FIELDS = [
  {
    title: "Photography",
    text: "I look for quiet moments that most people walk past — light on a wall, a face between expressions, a street just before it wakes up.",
  },
  {
    title: "Retouching",
    text: "Editing is where a photo finds its voice. I shape color and tone until the image feels the way the moment did, not just how it looked.",
  },
  {
    title: "Video",
    text: "Movement adds time to a picture. I cut short films and clips that carry a mood from the first frame to the last.",
  },
  {
    title: "Web & Design",
    text: "This site is one of my works too. I enjoy building things people can touch — layouts, motion, and the small details that make a page feel alive.",
  },
];

export default function About() {
  return (
    <div className="flex flex-1 flex-col px-6 py-16 sm:px-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">About me</h1>

        <p className="mt-8 text-lg leading-relaxed">
          I&apos;m Rintaro Toda — a creator who doesn&apos;t like staying in one
          lane. I move between photography, editing, video and design, and I
          think each one makes me better at the others.
        </p>
        <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
          Whatever the medium, I&apos;m chasing the same thing: making people
          stop for a second and feel something.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <section key={field.title}>
              <h2 className="text-sm font-medium tracking-widest uppercase">
                {field.title}
              </h2>
              <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {field.text}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-16 leading-relaxed">
          Always curious, always learning something new. If you have an idea,
          a project, or just want to say hi —{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:opacity-70">
            let&apos;s talk
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
