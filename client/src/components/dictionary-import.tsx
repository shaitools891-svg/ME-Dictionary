import { useState, useRef } from "react";
import { dictionaryManager, createDictionaryFromArrays, DictionaryManager } from "@/lib/dictionary-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, FileText, Globe, Trash2 } from "lucide-react";

interface DictionaryImportProps {
  onClose?: () => void;
}

export default function DictionaryImport({ onClose }: DictionaryImportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [wordCount, setWordCount] = useState(dictionaryManager.getWordCount());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const success = await dictionaryManager.loadFromFile(file);
      if (success) {
        setMessage({ type: 'success', text: 'Dictionary imported successfully!' });
        setWordCount(dictionaryManager.getWordCount());
      } else {
        setMessage({ type: 'error', text: 'Failed to import dictionary. Please check the file format.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error importing dictionary file.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleURLImport = async () => {
    const url = urlInputRef.current?.value;
    if (!url) {
      setMessage({ type: 'error', text: 'Please enter a valid URL.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const success = await dictionaryManager.loadFromURL(url);
      if (success) {
        setMessage({ type: 'success', text: 'Dictionary imported successfully from URL!' });
        setWordCount(dictionaryManager.getWordCount());
        if (urlInputRef.current) urlInputRef.current.value = '';
      } else {
        setMessage({ type: 'error', text: 'Failed to import dictionary from URL. Please check the URL and file format.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error importing dictionary from URL.' });
    } finally {
      setIsLoading(false);
    }
  };

  const exportDictionary = () => {
    const dictionary = dictionaryManager.exportDictionary();
    const dataStr = JSON.stringify(dictionary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dictionary-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearCustomDictionaries = () => {
    dictionaryManager.clearCustomDictionaries();
    setWordCount(dictionaryManager.getWordCount());
    setMessage({ type: 'success', text: 'Custom dictionaries cleared. Only main dictionary remains.' });
  };

  const createSampleDictionary = () => {
    const sampleEnglishWords = [
      { word: 'computer', translation: 'কম্পিউটার', synonyms: ['PC', 'machine'], antonyms: ['human'], examples: [{ english: 'I use a computer for work.', bangla: 'আমি কাজের জন্য কম্পিউটার ব্যবহার করি।' }] },
      { word: 'internet', translation: 'ইন্টারনেট', synonyms: ['web', 'net'], antonyms: [], examples: [{ english: 'The internet is very useful.', bangla: 'ইন্টারনেট খুবই উপকারী।' }] },
      { word: 'mobile', translation: 'মোবাইল', synonyms: ['phone', 'cellphone'], antonyms: [], examples: [{ english: 'My mobile is ringing.', bangla: 'আমার মোবাইল বাজছে।' }] }
    ];

    const sampleBanglaWords = [
      { word: 'কম্পিউটার', translation: 'computer', synonyms: ['পিসি', 'যন্ত্র'], antonyms: ['মানুষ'], examples: [{ english: 'I use a computer for work.', bangla: 'আমি কাজের জন্য কম্পিউটার ব্যবহার করি।' }] },
      { word: 'ইন্টারনেট', translation: 'internet', synonyms: ['ওয়েব', 'নেট'], antonyms: [], examples: [{ english: 'The internet is very useful.', bangla: 'ইন্টারনেট খুবই উপকারী।' }] },
      { word: 'মোবাইল', translation: 'mobile', synonyms: ['ফোন', 'সেলফোন'], antonyms: [], examples: [{ english: 'My mobile is ringing.', bangla: 'আমার মোবাইল বাজছে।' }] }
    ];

    const sampleDictionary = createDictionaryFromArrays(sampleEnglishWords, sampleBanglaWords);
    dictionaryManager.addDictionary(sampleDictionary);
    setWordCount(dictionaryManager.getWordCount());
    setMessage({ type: 'success', text: 'Sample dictionary with technology words added!' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dictionary Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Import, export, and manage your dictionary collections</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {wordCount.english} English • {wordCount.bangla} Bangla words
        </Badge>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* File Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import from File
            </CardTitle>
            <CardDescription>
              Upload a JSON file containing your dictionary data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Choose JSON File
            </Button>
            <p className="text-xs text-gray-500">
              File should contain English and Bangla dictionary objects
            </p>
          </CardContent>
        </Card>

        {/* URL Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Import from URL
            </CardTitle>
            <CardDescription>
              Load dictionary from a web URL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              ref={urlInputRef}
              placeholder="https://example.com/dictionary.json"
              type="url"
            />
            <Button
              onClick={handleURLImport}
              disabled={isLoading}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Import from URL
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common dictionary management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button onClick={createSampleDictionary} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm">Add Sample Words</span>
            </Button>

            <Button onClick={exportDictionary} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="h-5 w-5" />
              <span className="text-sm">Export Dictionary</span>
            </Button>

            <Button
              onClick={clearCustomDictionaries}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
              <span className="text-sm">Clear Custom</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Create Dictionary Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. JSON File Format</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`{
  "english": {
    "word": {
      "id": "en-1",
      "word": "word",
      "language": "en",
      "translation": "translation",
      "partOfSpeech": "noun",
      "definition": "definition text",
      "synonyms": ["synonym1", "synonym2"],
      "antonyms": ["antonym1"],
      "examples": [
        {
          "english": "Example sentence",
          "bangla": "উদাহরণ বাক্য"
        }
      ]
    }
  },
  "bangla": {
    // Same structure for Bangla words
  }
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Using AI to Generate Words</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You can use AI tools to generate dictionary entries. For example, ask an AI:
            </p>
            <blockquote className="border-l-4 border-blue-200 pl-4 py-2 my-2 bg-blue-50 dark:bg-blue-900/20 text-sm">
              "Create a JSON dictionary with 50 common English words and their Bangla translations, including synonyms, antonyms, and example sentences for each word."
            </blockquote>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. File Naming Convention</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Name your files descriptively: <code>medical-terms-dictionary.json</code>, <code>business-words-dictionary.json</code>, etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {onClose && (
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      )}
    </div>
  );
}