import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, CheckSquare, Layers } from "lucide-react";

const features = [
  {
    name: "Organization Management",
    description:
      "Create and manage multiple organizations. Keep your work separate and organized.",
    icon: Building2,
  },
  {
    name: "Project Tracking",
    description:
      "Track your projects from start to finish. Visualize progress and identify bottlenecks.",
    icon: Layers,
  },
  {
    name: "Task Assignment",
    description:
      "Assign tasks to team members, set due dates, and collaborate in real-time.",
    icon: CheckSquare,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Work Faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to manage your projects
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
             streamline your workflow with our powerful features designed for
            modern teams.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <Card key={feature.name} className="border-none shadow-none bg-accent/20">
                <CardHeader>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon
                      className="h-6 w-6 text-primary-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle>{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
