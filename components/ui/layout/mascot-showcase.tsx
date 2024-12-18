import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const mascots = [
  {
    name: "Sparky",
    role: "The Leader",
    description: "Energetic and determined, always ready to lead the charge for a good cause.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    name: "Trixie",
    role: "The Creative Genius",
    description: "Imaginative and resourceful, the brains behind creative problem-solving.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    name: "Bruno",
    role: "The Strong Protector",
    description: "Loyal and brave, always there to lend a helping hand or paw.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    name: "Dash",
    role: "The Speedster",
    description: "Fast and fearless, first to volunteer for any task.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    name: "Bella",
    role: "The Heart of the Team",
    description: "Compassionate and nurturing, the team's beloved caregiver.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    name: "Max",
    role: "The Tech Wizard",
    description: "Intelligent and tech-savvy, always one step ahead with technology.",
    image: "/placeholder.svg?height=300&width=300"
  }
]

const MascotCard = ({ mascot }: { mascot: typeof mascots[0] }) => (
  <Card className="overflow-hidden h-[400px] flex flex-col">
    <CardHeader className="p-4 pb-2">
      <CardTitle className="text-xl mb-1">{mascot.name}</CardTitle>
    </CardHeader>
    <div className="relative flex-grow">
      <Image
        src={mascot.image}
        alt={`${mascot.name} - ${mascot.role}`}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 hover:scale-105"
      />
    </div>
    <CardContent className="p-4">
      <CardDescription className="text-sm font-semibold mb-2">{mascot.role}</CardDescription>
      <p className="text-sm text-gray-600 dark:text-gray-300">{mascot.description}</p>
    </CardContent>
  </Card>
)

export default function MascotsShowcase() {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Meet the Underdogs Members Club Mascots
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mascots.map((mascot) => (
            <MascotCard key={mascot.name} mascot={mascot} />
          ))}
        </div>
      </div>
    </section>
  )
}

