import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TbTrashXFilled } from "react-icons/tb";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";

interface NoteCardProps {
	note: { id: string; date: Date; content: string };
	onNoteDelete: (id: string) => void;
	onNoteUpdate: (
		note: { id: string; date: Date; content: string },
		content: string
	) => void;
}

export default function NoteCard({
	note,
	onNoteDelete,
	onNoteUpdate,
}: NoteCardProps) {
	const [content, setContent] = useState(note.content);

	function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value);
	}

	function handleUpdateNote(event: FormEvent) {
		event.preventDefault;
		onNoteUpdate(note, content);
	}

	return (
		<Dialog>
			<DialogTrigger className="bg-secondary-foreground dark:bg-primary-foreground flex flex-col gap-3 text-left rounded-lg p-5 overflow-hidden relative hover:ring-2 hover:ring-zinc-600 outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
				<span className="text-base font-medium text-primary dark:text-secondary">
					{formatDistanceToNow(note.date, {
						locale: ptBR,
						addSuffix: true,
					})}
				</span>
				<p className="text-primary-foreground dark:text-secondary-foreground text-sm">{note.content}</p>
				<div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-black/0 pointer-events-none" />
			</DialogTrigger>
			<DialogContent className="w-full max-w-[640px] h-[90vh] md:h-[60vh] flex flex-col flex-1 outline-none rounded-2xl">
				<form className="flex-1 flex flex-col gap-4 h-full">
					<DialogHeader>
						<DialogTitle className="text-base">
							{formatDistanceToNow(note.date, {
								locale: ptBR,
								addSuffix: true,
							})}
						</DialogTitle>
					</DialogHeader>
					<Textarea
						autoFocus
						onChange={handleContentChanged}
						value={content}
						className="text-base leading-6 bg-transparent resize-none flex-1 w-full md:h-full border-0 focus-visible:ring-0 px-0"
					/>
					<DialogFooter className="content-end flex flex-row gap-4">
						<Button
							size="icon"
							variant={"destructive"}
							onClick={() => onNoteDelete(note.id)}
						>
							<TbTrashXFilled size={22} />
						</Button>
						<Button
							type="submit"
							onClick={handleUpdateNote}
							className="w-full bg-blue-600 text-zinc-50 hover:bg-blue-800"
						>
							Salvar
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
