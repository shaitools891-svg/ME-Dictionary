import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { DictionaryEntry } from "@shared/schema";

interface TranslationResultsProps {
  entry: DictionaryEntry;
}

const MOCK_USER_ID = "user-1";

export default function TranslationResults({ entry }: TranslationResultsProps) {
  const [synonymsOpen, setSynonymsOpen] = useState(false);
  const [antonymsOpen, setAntonymsOpen] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const { toast } = useToast();

  const addToCustomMutation = useMutation({
    mutationFn: async () => {
      const customWordData = {
        userId: MOCK_USER_ID,
        englishWord: entry.language === 'en' ? entry.word : entry.translation,
        banglaTranslation: entry.language === 'bn' ? entry.word : entry.translation,
        definition: entry.definition || ""
      };
      
      const response = await apiRequest('POST', '/api/custom-words', customWordData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Added to custom words!" });
    },
    onError: () => {
      toast({ title: "Failed to add to custom words", variant: "destructive" });
    }
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Dictionary Translation',
          text: `${entry.word} - ${entry.translation}`,
        });
      } catch (error) {
        // User cancelled sharing or share failed
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${entry.word} - ${entry.translation}`);
        toast({ title: "Copied to clipboard!" });
      } catch (error) {
        toast({ title: "Failed to copy to clipboard", variant: "destructive" });
      }
    }
  };

  return (
    <section className="px-4 space-y-4">
      {/* Main Translation Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className={cn(
                "text-xl font-semibold text-gray-900 dark:text-gray-100",
                entry.language === 'bn' && "font-bengali"
              )} data-testid="text-search-word">
                {entry.word}
              </h2>
              {entry.partOfSpeech && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1" data-testid="text-part-of-speech">
                  {entry.partOfSpeech}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                data-testid="button-pronunciation"
              >
                <i className="fas fa-volume-up"></i>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                data-testid="button-favorite"
              >
                <i className="fas fa-heart"></i>
              </Button>
            </div>
          </div>
          
          <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-3 mb-4">
            <h3 className={cn(
              "text-lg font-medium text-gray-900 dark:text-gray-100",
              entry.language === 'en' ? "font-bengali" : ""
            )} data-testid="text-translation">
              {entry.translation}
            </h3>
            {entry.definition && (
              <p className="text-sm text-primary-700 dark:text-primary-300 mt-1" data-testid="text-definition">
                {entry.definition}
              </p>
            )}
          </div>
        </CardContent>

        {/* Expandable Sections */}
        <div className="border-t border-gray-100 dark:border-gray-700">
          {/* Synonyms */}
          {entry.synonyms && entry.synonyms.length > 0 && (
            <Collapsible open={synonymsOpen} onOpenChange={setSynonymsOpen}>
              <CollapsibleTrigger className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0" data-testid="button-toggle-synonyms">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-equals text-primary-600 dark:text-primary-400"></i>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Synonyms</span>
                </div>
                <i className={cn(
                  "fas fa-chevron-down text-gray-400 transition-transform",
                  synonymsOpen && "rotate-180"
                )}></i>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-2" data-testid="synonyms-container">
                  {entry.synonyms.map((synonym, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className={cn(
                        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1",
                        entry.language === 'bn' && "font-bengali"
                      )}
                      data-testid={`synonym-${index}`}
                    >
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Antonyms */}
          {entry.antonyms && entry.antonyms.length > 0 && (
            <Collapsible open={antonymsOpen} onOpenChange={setAntonymsOpen}>
              <CollapsibleTrigger className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0" data-testid="button-toggle-antonyms">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-not-equal text-red-600 dark:text-red-400"></i>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Antonyms</span>
                </div>
                <i className={cn(
                  "fas fa-chevron-down text-gray-400 transition-transform",
                  antonymsOpen && "rotate-180"
                )}></i>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-2" data-testid="antonyms-container">
                  {entry.antonyms.map((antonym, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className={cn(
                        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1",
                        entry.language === 'bn' && "font-bengali"
                      )}
                      data-testid={`antonym-${index}`}
                    >
                      {antonym}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Examples */}
          {entry.examples && entry.examples.length > 0 && (
            <Collapsible open={examplesOpen} onOpenChange={setExamplesOpen}>
              <CollapsibleTrigger className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between" data-testid="button-toggle-examples">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-quote-left text-green-600 dark:text-green-400"></i>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Examples</span>
                </div>
                <i className={cn(
                  "fas fa-chevron-down text-gray-400 transition-transform",
                  examplesOpen && "rotate-180"
                )}></i>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 space-y-3" data-testid="examples-container">
                {entry.examples.map((example, index) => (
                  <Card key={index} className="bg-gray-50 dark:bg-gray-700" data-testid={`example-${index}`}>
                    <CardContent className="p-3">
                      <p className="text-gray-800 dark:text-gray-200 italic">
                        "{example.english}"
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 font-bengali">
                        "{example.bangla}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </Card>

      {/* Quick Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={() => addToCustomMutation.mutate()}
          disabled={addToCustomMutation.isPending}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2"
          data-testid="button-add-custom"
        >
          <i className="fas fa-plus"></i>
          <span>Add Custom</span>
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2"
          data-testid="button-share"
        >
          <i className="fas fa-share"></i>
          <span>Share</span>
        </Button>
      </div>
    </section>
  );
}
