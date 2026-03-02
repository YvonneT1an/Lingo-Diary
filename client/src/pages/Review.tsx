import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Sparkles, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhrases } from "@/context/PhraseContext";
import { cn } from "@/lib/utils";

type Difficulty = 'hard' | 'ok' | 'easy';

export default function ReviewPage() {
  const { phrases, isLoading } = usePhrases();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const reviewQueue = useMemo(() => {
    return [...phrases].sort(() => 0.5 - Math.random());
  }, [phrases]);

  const handleShowAnswer = () => {
    setIsFlipped(true);
  };

  const handleNext = (_difficulty: Difficulty) => {
    setIsFlipped(false);
    setReviewedCount(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex < reviewQueue.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setSessionComplete(true);
      }
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (phrases.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">No phrases to review</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Save some phrases from your diary translations first, then come back here to practice them.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-xl shadow-md shadow-primary/20 px-8" data-testid="button-write-diary">
            Write a diary
          </Button>
        </Link>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 animate-bounce">
          <Sparkles className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Great job!</h2>
        <p className="text-muted-foreground text-lg mb-8">
          You've reviewed <span className="font-bold text-foreground">{reviewedCount}</span> phrases today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Link href="/dictionary" className="w-full">
            <Button variant="outline" className="w-full rounded-xl h-12">
              Back to Dictionary
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button className="w-full rounded-xl h-12 shadow-sm shadow-primary/20">
              Write New Diary
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentPhrase = reviewQueue[currentIndex];

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="font-medium text-muted-foreground text-sm bg-secondary px-3 py-1 rounded-full" data-testid="text-card-progress">
          Card {currentIndex + 1} <span className="opacity-50">/</span> {reviewQueue.length}
        </div>
        <Link href="/dictionary">
          <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:text-foreground" data-testid="button-exit-review">
            Exit
          </Button>
        </Link>
      </div>

      <div className="flex-1 relative perspective-1000 mb-8 min-h-[300px]">
        <div className={cn(
          "w-full h-full absolute top-0 left-0 transition-all duration-500 transform-style-preserve-3d",
          isFlipped ? "rotate-y-180" : ""
        )}>

          {/* FRONT */}
          <div className="w-full h-full absolute top-0 left-0 backface-hidden bg-card border border-border shadow-md rounded-3xl p-8 flex flex-col">
            <div className="text-xs uppercase tracking-wider font-bold text-primary/70 mb-auto">Prompt</div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 my-8">
              {currentPhrase?.chinese ? (
                <>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Meaning</div>
                  <h3 className="text-3xl font-bold leading-tight">{currentPhrase.chinese}</h3>
                </>
              ) : currentPhrase?.context ? (
                <>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Context</div>
                  <p className="text-xl text-muted-foreground/80 italic line-clamp-4">
                    "...{currentPhrase.context.replace(currentPhrase.english, '________')}..."
                  </p>
                </>
              ) : (
                <h3 className="text-2xl font-medium text-muted-foreground">What's the phrase?</h3>
              )}
            </div>

            <div className="mt-auto pt-6 w-full flex justify-center">
              <Button
                onClick={handleShowAnswer}
                size="lg"
                className="w-full sm:w-2/3 rounded-xl shadow-md shadow-primary/20 h-14 text-base"
                data-testid="button-show-answer"
              >
                Show Answer
              </Button>
            </div>
          </div>

          {/* BACK */}
          <div className="w-full h-full absolute top-0 left-0 backface-hidden rotate-y-180 bg-card border border-border shadow-lg shadow-primary/5 rounded-3xl p-6 md:p-8 flex flex-col overflow-y-auto">
            <div className="text-xs uppercase tracking-wider font-bold text-primary/70 mb-6 shrink-0">Answer</div>

            <div className="flex flex-col items-center text-center mb-8 shrink-0">
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-3 leading-tight" data-testid="text-answer-english">{currentPhrase?.english}</h3>
              {currentPhrase?.chinese && (
                <p className="text-xl font-medium text-foreground/80">{currentPhrase.chinese}</p>
              )}
            </div>

            <div className="space-y-5 text-left mb-8 flex-1">
              {currentPhrase?.explanation && (
                <div className="bg-secondary/30 p-4 rounded-2xl">
                  <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Notes</div>
                  <p className="text-sm md:text-base">{currentPhrase.explanation}</p>
                </div>
              )}

              {currentPhrase?.examples && (
                <div className="bg-secondary/30 p-4 rounded-2xl">
                  <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Example</div>
                  <p className="text-sm md:text-base italic">{currentPhrase.examples}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "shrink-0 transition-all duration-300 transform",
        isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      )}>
        <p className="text-center text-sm font-medium text-muted-foreground mb-3">How was this?</p>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => handleNext('hard')}
            className="h-14 rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:border-orange-900 dark:text-orange-400 dark:hover:bg-orange-900/30"
            data-testid="button-difficulty-hard"
          >
            Hard
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNext('ok')}
            className="h-14 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/30"
            data-testid="button-difficulty-ok"
          >
            Good
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNext('easy')}
            className="h-14 rounded-xl border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-900/30"
            data-testid="button-difficulty-easy"
          >
            Easy
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}
