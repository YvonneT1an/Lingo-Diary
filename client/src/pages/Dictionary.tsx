import { useState } from "react";
import { Link } from "wouter";
import { Search, Plus, Clock, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePhrases, type Phrase } from "@/context/PhraseContext";
import PhraseModal from "@/components/PhraseModal";

export default function DictionaryPage() {
  const { phrases, isLoading } = usePhrases();
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);

  const filteredPhrases = searchQuery.trim()
    ? phrases.filter(p =>
        p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.chinese && p.chinese.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : phrases;

  const openPhraseDetail = (phrase: Phrase) => {
    setSelectedPhrase(phrase);
    setIsModalOpen(true);
  };

  const formatDate = (dateValue: string | Date) => {
    const date = new Date(dateValue);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-[calc(100vh-4rem)] md:h-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">My Dictionary</h1>
          <p className="text-muted-foreground" data-testid="text-phrase-count">You have {phrases.length} saved phrase{phrases.length !== 1 ? 's' : ''}.</p>
        </div>

        {phrases.length > 0 && (
          <Link href="/review">
            <Button className="rounded-xl shadow-sm shadow-primary/20 gap-2 shrink-0" data-testid="button-review-phrases">
              <BookOpen className="w-4 h-4" />
              Review Phrases
            </Button>
          </Link>
        )}
      </div>

      <div className="relative mb-6 shrink-0 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="search"
          placeholder="Search by English or Chinese..."
          className="pl-11 rounded-xl bg-secondary/50 border-transparent focus-visible:bg-background h-12 text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : phrases.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6 border border-border border-dashed">
              <BookOpen className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No saved phrases yet</h3>
            <p className="mb-6 max-w-[250px]">Your personal dictionary is empty. Start writing a diary to discover and save new phrases.</p>
            <Link href="/">
              <Button className="rounded-xl gap-2 shadow-sm shadow-primary/20" data-testid="button-write-diary">
                <Plus className="w-4 h-4" />
                Write a diary
              </Button>
            </Link>
          </div>
        ) : filteredPhrases.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No phrases found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                onClick={() => openPhraseDetail(phrase)}
                className="group p-4 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer flex items-center justify-between"
                data-testid={`card-phrase-${phrase.id}`}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground truncate">{phrase.english}</h3>
                    {phrase.chinese ? (
                      <span className="text-sm text-muted-foreground truncate">{phrase.chinese}</span>
                    ) : (
                      <span className="text-xs text-primary/70 font-medium px-2 py-0.5 rounded-md bg-primary/10">Add meaning</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock className="w-3 h-3" />
                    Added {formatDate(phrase.dateAdded)}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PhraseModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={selectedPhrase || undefined}
        isEdit={true}
      />
    </div>
  );
}
