import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { CustomWord, InsertCustomWord } from "@shared/schema";

const MOCK_USER_ID = "user-1"; // In a real app, get from auth context

export default function CustomWords() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    englishWord: "",
    banglaTranslation: "",
    definition: ""
  });
  const { toast } = useToast();

  const { data: customWords, isLoading } = useQuery({
    queryKey: ['/api/custom-words', MOCK_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/custom-words/${MOCK_USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch custom words');
      return response.json() as CustomWord[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCustomWord) => {
      const response = await apiRequest('POST', '/api/custom-words', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/custom-words', MOCK_USER_ID] });
      setFormData({ englishWord: "", banglaTranslation: "", definition: "" });
      setIsAdding(false);
      toast({ title: "Custom word added successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to add custom word", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomWord> }) => {
      const response = await apiRequest('PUT', `/api/custom-words/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/custom-words', MOCK_USER_ID] });
      setEditingId(null);
      setFormData({ englishWord: "", banglaTranslation: "", definition: "" });
      toast({ title: "Custom word updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update custom word", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/custom-words/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/custom-words', MOCK_USER_ID] });
      toast({ title: "Custom word deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete custom word", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.englishWord.trim() || !formData.banglaTranslation.trim()) {
      toast({ title: "Please fill in both English word and Bangla translation", variant: "destructive" });
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate({ 
        ...formData, 
        userId: MOCK_USER_ID 
      });
    }
  };

  const startEdit = (word: CustomWord) => {
    setEditingId(word.id);
    setFormData({
      englishWord: word.englishWord,
      banglaTranslation: word.banglaTranslation,
      definition: word.definition || ""
    });
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ englishWord: "", banglaTranslation: "", definition: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-md mx-auto pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Custom Words</h2>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-primary-600 hover:bg-primary-700 text-white"
              data-testid="button-add-word"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Word
            </Button>
          </div>

          {(isAdding || editingId) && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? "Edit Word" : "Add New Word"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="englishWord">English Word</Label>
                    <Input
                      id="englishWord"
                      value={formData.englishWord}
                      onChange={(e) => setFormData(prev => ({ ...prev, englishWord: e.target.value }))}
                      placeholder="Enter English word"
                      data-testid="input-english-word"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="banglaTranslation">Bangla Translation</Label>
                    <Input
                      id="banglaTranslation"
                      value={formData.banglaTranslation}
                      onChange={(e) => setFormData(prev => ({ ...prev, banglaTranslation: e.target.value }))}
                      placeholder="বাংলা অনুবাদ লিখুন"
                      className="font-bengali"
                      data-testid="input-bangla-translation"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="definition">Definition (Optional)</Label>
                    <Textarea
                      id="definition"
                      value={formData.definition}
                      onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
                      placeholder="Add definition..."
                      rows={2}
                      data-testid="textarea-definition"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1 bg-primary-600 hover:bg-primary-700"
                      data-testid="button-save-word"
                    >
                      {editingId ? "Update Word" : "Add Word"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {isLoading && (
              <div className="text-center py-8">
                <div className="text-primary-600 text-2xl">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading custom words...</p>
              </div>
            )}

            {customWords && customWords.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-300 text-4xl mb-3">
                  <i className="fas fa-book-open"></i>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No custom words added yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Add your first custom word above</p>
              </div>
            )}

            {customWords?.map((word) => (
              <Card key={word.id} className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100" data-testid={`text-word-${word.id}`}>
                        {word.englishWord}
                      </h5>
                      <p className="text-primary-600 font-bengali mt-1" data-testid={`text-translation-${word.id}`}>
                        {word.banglaTranslation}
                      </p>
                      {word.definition && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2" data-testid={`text-definition-${word.id}`}>
                          {word.definition}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(word)}
                        className="p-2 text-gray-400 hover:text-primary-600"
                        data-testid={`button-edit-${word.id}`}
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(word.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-500"
                        data-testid={`button-delete-${word.id}`}
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
