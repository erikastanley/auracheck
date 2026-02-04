import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ImageUploader } from '@/components/ImageUploader';
import { CanvasColorPicker } from '@/components/CanvasColorPicker';
import { ColorPaletteDisplay } from '@/components/ColorPaletteDisplay';
import { ContrastResultsMatrix, ContrastResult } from '@/components/ContrastResultsMatrix';
import { AccessibleCombinationsList } from '@/components/AccessibleCombinationsList'; // Import the new component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import CardDescription
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { APP_COPY, WCAG_LEVELS, WCAG_CONTRAST_RATIOS } from '@/lib/constants';
import { ColorData, getContrastRatio, checkWcagCompliance, generateUniqueId, deserializeState, determineIsLargeText } from '@/lib/colorUtils';
import { cn } from '@/lib/utils';
import { ExportOptions } from '@/components/ExportOptions';
import { useAuraCheckStore } from '@/stores/auraCheckStore';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme'; // Correctly import the useTheme hook
import { Button } from '@/components/ui/button'; // Import Button for Admin link
import { Link } from 'react-router-dom'; // For navigation
import { isAdmin } from '@/lib/auth'; // Import isAdmin for conditional rendering
export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const uploadedImage = useAuraCheckStore((state) => state.uploadedImage);
  const pickedColors = useAuraCheckStore((state) => state.pickedColors);
  const wcagLevel = useAuraCheckStore((state) => state.wcagLevel);
  const setImage = useAuraCheckStore((state) => state.setImage);
  const addColor = useAuraCheckStore((state) => state.addColor);
  const removeColor = useAuraCheckStore((state) => state.removeColor);
  const setWcagLevel = useAuraCheckStore((state) => state.setWcagLevel);
  const setPickedColors = useAuraCheckStore((state) => state.setPickedColors);
  const exportAreaRef = useRef<HTMLDivElement>(null);
  // State for admin authentication check
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  useEffect(() => {
    // Check admin status on mount
    setAdminAuthenticated(isAdmin());
    if (isInitialLoad) {
      const stateParam = searchParams.get('state');
      if (stateParam) {
        const restoredState = deserializeState(stateParam);
        if (restoredState) {
          console.log("Restoring state from URL parameters:", restoredState);
          setImage(restoredState.imageUrl);
          const colorsWithIds = restoredState.colors.map((color: Omit<ColorData, 'id'>) => ({
            ...color,
            id: generateUniqueId()
          }));
          setPickedColors(colorsWithIds);
          setWcagLevel(restoredState.wcagLevel as typeof WCAG_LEVELS.AA | typeof WCAG_LEVELS.AAA);
        } else {
          console.error("Failed to deserialize state from URL.");
        }
      }
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, searchParams, setImage, setPickedColors, setWcagLevel]);
  const handleImageUpload = useCallback((imageUrl: string | null) => {
    setImage(imageUrl);
    if (!imageUrl) {
      setPickedColors([]);
    }
  }, [setImage, setPickedColors]);
  const handleColorPick = useCallback((color: ColorData) => {
    addColor(color);
  }, [addColor]);
  const handleWcagLevelToggle = useCallback(() => {
    setWcagLevel(wcagLevel === WCAG_LEVELS.AA ? WCAG_LEVELS.AAA : WCAG_LEVELS.AA);
  }, [wcagLevel, setWcagLevel]);
  const contrastResults: ContrastResult[] = useMemo(() => {
    if (pickedColors.length < 2) {
      return [];
    }
    const results: ContrastResult[] = [];
    for (let i = 0; i < pickedColors.length; i++) {
      for (let j = 0; j < pickedColors.length; j++) {
        if (i === j) continue;
        const fgColor = pickedColors[i];
        const bgColor = pickedColors[j];
        const contrastRatio = getContrastRatio(fgColor.rgb, bgColor.rgb);
        const isLargeText = determineIsLargeText(); // Use the utility function
        results.push({
          fgColor,
          bgColor,
          contrastRatio,
          wcagAA: checkWcagCompliance(contrastRatio, isLargeText, WCAG_LEVELS.AA),
          wcagAAA: checkWcagCompliance(contrastRatio, isLargeText, WCAG_LEVELS.AAA)
        });
      }
    }
    return results;
  }, [pickedColors]);
  const { isDark } = useTheme(); // Correctly access isDark from the imported hook
  // Determine header background class based on theme and blueprint colors
  const headerBgClass = isDark ? 'bg-gradient-primary' : 'bg-gradient-aura'; // Using custom gradients
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <ThemeToggle className="absolute top-6 right-6 z-50" />
      <header className={`flex-shrink-0 py-8 md:py-12 shadow-lg ${headerBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-display ${isDark ? 'text-white' : 'text-foreground'} mb-4`}>
            AuraCheck
          </h1>
          <p className={`text-body ${isDark ? 'text-white/90' : 'text-foreground/90'} max-w-2xl mx-auto`}>
            {APP_COPY.WELCOME_MESSAGE}
          </p>
          {adminAuthenticated && (
            <Button asChild variant="outline" className="mt-6 btn-outline-primary">
              <Link to="/admin">Go to Admin Dashboard</Link>
            </Button>
          )}
        </div>
      </header>
      <main className="flex-1 overflow-auto section-spacing-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 content-spacing-y">
          {!uploadedImage &&
          <section className="element-spacing-y">
              <h2 className="text-subheading text-center">1. Upload Your Palette</h2>
              <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
            </section>
          }
          {uploadedImage &&
          <>
              <section className="element-spacing-y">
                <h2 className="text-subheading text-center">2. Pick Your Colors</h2>
                <CanvasColorPicker
                imageUrl={uploadedImage}
                onColorPick={handleColorPick}
                pickedColors={pickedColors} />
                <ColorPaletteDisplay colors={pickedColors} onRemoveColor={removeColor} />
              </section>
              <Separator className="my-16 md:my-24" />
              <section className="element-spacing-y" ref={exportAreaRef}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-subheading text-center sm:text-left">3. See the Results</h2>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Label htmlFor="wcag-level-toggle" className="text-muted-foreground">WCAG AA</Label>
                    <Switch
                    id="wcag-level-toggle"
                    checked={wcagLevel === WCAG_LEVELS.AAA}
                    onCheckedChange={handleWcagLevelToggle}
                    aria-label="Toggle WCAG level between AA and AAA" />
                    <Label htmlFor="wcag-level-toggle" className="text-muted-foreground">WCAG AAA</Label>
                  </div>
                </div>
                <ContrastResultsMatrix results={contrastResults} colors={pickedColors} wcagLevel={wcagLevel} />
                {/* Render the new AccessibleCombinationsList */}
                <AccessibleCombinationsList
                  results={contrastResults}
                  colors={pickedColors}
                  wcagLevel={wcagLevel}
                />
              </section>
            </>
          }
        </div>
      </main>
      <footer className="flex-shrink-0 py-8 text-center text-muted-foreground/80 border-t border-gray-200 dark:border-gray-800">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      {contrastResults.length > 0 &&
      <div className="fixed bottom-6 right-6 z-50">
          <ExportOptions
          results={contrastResults}
          colors={pickedColors}
          wcagLevel={wcagLevel}
          exportAreaRef={exportAreaRef} />
        </div>
      }
    </div>
  );
}
