import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <section className="relative z-10 flex flex-col items-center gap-6 py-24 text-center">
        <Image
          src="/kunduAgro.png"
          alt="Kundu Agro and Fisheries logo"
          width={200}
          height={200}
          priority
          className="rounded-2xl"
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Kundu Agro and Fisheries
        </h1>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
          Fresh from our fields and waters — sustainable farming and quality fish,
          grown with care for your family.
        </p>
      </section>
    </main>
  );
}
