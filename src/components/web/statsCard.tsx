import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Layers, Code2 } from "lucide-react";

export function StatsCard() {
  return (
    <Card className="bg-accent/70 backdrop-blur-md border-white/10 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="flex items-stretch justify-between gap-6 px-6 py-4">
        <StatItem icon={Briefcase} value="2+" label="Years Experience" />

        <div className="hidden md:block h-15 w-px bg-white/30 shrink-0" />

        <StatItem icon={Layers} value="20+" label="Projects Completed" />

        <div className="hidden md:block h-15 w-px bg-white/30 shrink-0" />
        <StatItem icon={Code2} value="10k+" label="Lines of Code" />
      </CardContent>
    </Card>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 text-center">
      <div className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-primary/70" />
        <h3 className="text-xl md:text-2xl font-bold">{value}</h3>
      </div>
      <p className="text-sm md:text-base text-muted-foreground">{label}</p>
    </div>
  );
}
