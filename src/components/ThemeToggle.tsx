
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Apply the theme when component mounts and when theme changes
    applyTheme(isDark);
  }, [isDark]);

  const applyTheme = (dark: boolean) => {
    // Apply theme to document
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5 text-muted-foreground" />
      <Switch 
        id="theme-toggle" 
        checked={isDark}
        onCheckedChange={setIsDark}
      />
      <Label htmlFor="theme-toggle" className="cursor-pointer">
        {isDark ? 'Dark' : 'Light'} Mode
      </Label>
      <Moon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

export default ThemeToggle;
