import { Moon, Sun, Type, Trash2, CheckCircle2, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  showEndStudy?: boolean;
  onEndStudy?: () => void;
  onDeleteStudy?: () => void;
  textSize: number;
  onTextSizeChange: (size: number) => void;
}

export const Navbar = ({
  showEndStudy = false,
  onEndStudy,
  onDeleteStudy,
  textSize,
  onTextSizeChange,
}: NavbarProps) => {
  const { theme, setTheme } = useTheme();

  const textSizes = [
    { label: "XS", value: 0.875 },
    { label: "S", value: 1 },
    { label: "M", value: 1.125 },
    { label: "L", value: 1.25 },
    { label: "XL", value: 1.5 },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            StudyMaster
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {showEndStudy && (
            <Button
              variant="success"
              size="sm"
              onClick={onEndStudy}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              End Study
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteStudy}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Study
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Type className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {textSizes.map((size) => (
                <DropdownMenuItem
                  key={size.label}
                  onClick={() => onTextSizeChange(size.value)}
                  className={textSize === size.value ? "bg-muted" : ""}
                >
                  <span style={{ fontSize: `${size.value}rem` }}>{size.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="h-4 w-4" />
              Star
            </a>
          </Button>

          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
