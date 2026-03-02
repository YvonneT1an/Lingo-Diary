import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePhrases, Phrase } from "@/context/PhraseContext";
import { useToast } from "@/hooks/use-toast";

interface PhraseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Phrase>;
  isEdit?: boolean;
}

export default function PhraseModal({ isOpen, onOpenChange, initialData, isEdit }: PhraseModalProps) {
  const { addPhrase, updatePhrase, deletePhrase } = usePhrases();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      english: initialData?.english || "",
      chinese: initialData?.chinese || "",
      explanation: initialData?.explanation || "",
      context: initialData?.context || "",
      examples: initialData?.examples || "",
    }
  });

  // Update form when initialData changes
  useState(() => {
    if (isOpen && initialData) {
      reset(initialData);
    }
  });

  const onSubmit = (data: any) => {
    if (isEdit && initialData?.id) {
      updatePhrase(initialData.id, data);
      toast({
        title: "Phrase updated",
        description: "Your changes have been saved.",
      });
    } else {
      addPhrase(data);
      toast({
        title: "Saved to dictionary",
        description: `"${data.english}" has been added to your dictionary.`,
      });
    }
    onOpenChange(false);
    reset();
  };

  const handleDelete = () => {
    if (initialData?.id) {
      deletePhrase(initialData.id);
      toast({
        title: "Phrase deleted",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl sm:rounded-[24px]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Edit phrase" : "Save phrase"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(100dvh-200px)]">
          {isDeleting ? (
            <div className="py-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete this phrase?</h3>
              <p className="text-muted-foreground text-sm mb-6">
                This action cannot be undone. It will be removed from your dictionary and flashcards.
              </p>
              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDeleting(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1 rounded-xl" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <form id="phrase-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="english" className="text-sm font-medium">English phrase <span className="text-destructive">*</span></Label>
                <Input
                  id="english"
                  placeholder="e.g. piece of cake"
                  className={`rounded-xl bg-secondary/50 border-transparent focus-visible:bg-background ${errors.english ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  {...register("english", { required: "English phrase is required" })}
                />
                {errors.english && (
                  <p className="text-[13px] text-destructive font-medium">{errors.english.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chinese" className="text-sm font-medium">Chinese meaning <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Input
                  id="chinese"
                  placeholder="e.g. 小菜一碟"
                  className="rounded-xl bg-secondary/50 border-transparent focus-visible:bg-background"
                  {...register("chinese")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation" className="text-sm font-medium">Explanation / notes <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Textarea
                  id="explanation"
                  placeholder="Short explanation of usage, tone, nuance..."
                  className="min-h-[80px] rounded-xl bg-secondary/50 border-transparent focus-visible:bg-background resize-none"
                  {...register("explanation")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context" className="text-sm font-medium">Source context <span className="text-muted-foreground font-normal">(Read-only)</span></Label>
                <div className="p-3 bg-secondary/50 rounded-xl text-sm text-muted-foreground border border-border/40">
                  {initialData?.context || "No context provided"}
                </div>
                <input type="hidden" {...register("context")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examples" className="text-sm font-medium">Example sentences <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Textarea
                  id="examples"
                  placeholder="Add examples of how to use it..."
                  className="min-h-[80px] rounded-xl bg-secondary/50 border-transparent focus-visible:bg-background resize-none"
                  {...register("examples")}
                />
              </div>
            </form>
          )}
        </div>

        {!isDeleting && (
          <DialogFooter className="px-6 py-4 border-t border-border/50 bg-secondary/20 flex sm:justify-between items-center gap-3">
            {isEdit ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl px-4"
                onClick={() => setIsDeleting(true)}
              >
                Delete
              </Button>
            ) : (
              <DialogClose asChild>
                <Button variant="ghost" className="rounded-xl">Cancel</Button>
              </DialogClose>
            )}
            <Button type="submit" form="phrase-form" className="rounded-xl shadow-md shadow-primary/20 w-full sm:w-auto">
              {isEdit ? "Save changes" : "Save to dictionary"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
