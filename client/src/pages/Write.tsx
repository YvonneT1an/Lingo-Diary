import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Check, Sparkles, X, Plus } from "lucide-react";
import PhraseModal from "@/components/PhraseModal";

export default function WritePage() {
  const [chineseInput, setChineseInput] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState("");
  
  // Selection state
  const [selectedText, setSelectedText] = useState("");
  const [showSaveAction, setShowSaveAction] = useState(false);
  const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTranslate = () => {
    if (!chineseInput.trim()) return;
    
    setIsTranslating(true);
    // Simulate translation delay
    setTimeout(() => {
      setTranslation("Today was pretty crazy. I got to the office around 9 and immediately had to jump into a meeting with the design team. We hit it off right away and brainstormed some cool ideas for the new feature. After lunch, I spent a few hours trying to get the hang of this new software tool we're using. It's tricky but I think I'm making progress. By 6 PM, I decided to call it a day and headed home. Grabbed some takeout on the way and just chilled for the rest of the evening.");
      setIsTranslating(false);
    }, 1500);
  };

  const handleClear = () => {
    setChineseInput("");
    setTranslation("");
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(text);
      
      // Calculate position relative to the viewport/container
      setActionPosition({
        top: rect.top - 50, // Above the selection
        left: rect.left + (rect.width / 2) - 60, // Center of selection
      });
      setShowSaveAction(true);
    } else {
      setShowSaveAction(false);
    }
  };

  const handleSaveClick = () => {
    setShowSaveAction(false);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Write & Translate</h1>
        <p className="text-muted-foreground">Turn your daily thoughts into natural American English.</p>
      </div>

      <div className="space-y-6">
        {/* Input Area */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl -z-10 blur-xl transition-all group-focus-within:opacity-100 opacity-0 duration-500" />
          
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-300 focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary/30">
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-b border-border/40">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Chinese Draft
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono">
                  {chineseInput.length} / 2000
                </span>
                {chineseInput.length > 0 && (
                  <button 
                    onClick={handleClear}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
                    title="Clear text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <Textarea 
              value={chineseInput}
              onChange={(e) => setChineseInput(e.target.value)}
              placeholder="用中文写下你今天发生了什么… (Write down what happened today in Chinese...)"
              className="min-h-[160px] border-0 focus-visible:ring-0 rounded-none bg-transparent resize-y text-base p-4 leading-relaxed"
              maxLength={2000}
            />
            
            <div className="p-3 bg-card border-t border-border/40 flex justify-end">
              <Button 
                onClick={handleTranslate}
                disabled={!chineseInput.trim() || isTranslating}
                className="rounded-xl shadow-sm shadow-primary/20 gap-2 font-medium"
              >
                {isTranslating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Translate to English
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        {translation ? (
          <div className="relative animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10 bg-primary/5">
                <span className="text-sm font-medium text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Casual American English
                </span>
                <span className="text-xs text-primary/70 bg-primary/10 px-2 py-1 rounded-md font-medium">
                  Select text to save
                </span>
              </div>
              
              <div 
                className="p-5 text-lg leading-relaxed text-foreground min-h-[120px] selection:bg-primary/30"
                onMouseUp={handleSelection}
                onTouchEnd={handleSelection}
              >
                {translation}
              </div>
            </div>

            {/* Floating Action Button for selection */}
            {showSaveAction && (
              <div 
                className="fixed z-50 animate-in zoom-in-95 duration-200"
                style={{ top: actionPosition.top, left: Math.max(10, actionPosition.left) }}
              >
                <Button 
                  size="sm" 
                  onClick={handleSaveClick}
                  className="rounded-full shadow-lg shadow-black/10 flex items-center gap-1.5 px-4 h-10 border border-primary/20 bg-background hover:bg-secondary text-foreground"
                >
                  <Plus className="w-4 h-4 text-primary" />
                  <span className="font-medium">Save phrase</span>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p>Your English translation will appear here.</p>
            <p className="text-sm mt-1 opacity-70">Highlight any phrase in the translation to save it.</p>
          </div>
        )}
      </div>

      <PhraseModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={{
          english: selectedText,
          context: translation // Full translation as context for MVP
        }}
      />
    </div>
  );
}
