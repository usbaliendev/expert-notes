import logo from "./assets/logo-nlw-expert.svg";
import usbaliendevlogo from "./assets/usbaliendev.svg";
import NoteCard from "./components/note-card";
import NewNoteCard from "./components/new-note-card";
import { Separator } from "./components/ui/separator";
import { Input } from "./components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ThemeProvider } from "@/utils/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Footer } from "./components/footer";

interface Note {
	id: string;
	date: Date;
	content: string;
}

export function App() {
	const [notes, setNotes] = useState<Note[]>(() => {
		const storedNotes: Note[] = JSON.parse(
			localStorage.getItem("notes") || "[]",
			(key, value) => {
				// Check if the value is a string representing a date
				if (key === "date" && typeof value === "string") {
					// Convert the string back to a Date object
					return new Date(value);
				}
				// Otherwise, return the value as is
				return value;
			}
		);

		// Update the state with sorted notes
		return storedNotes;
	});
	const [search, setSearch] = useState("");

	let deletedNote: Note;

	function updateSortNotes() {
		const sortedNotes = notes.sort((a, b) => {
			const dateA = a.date.getTime();
			const dateB = b.date.getTime();
			return dateB - dateA;
		});

		// Update the state with sorted notes
		return sortedNotes;
	}

	useEffect(() => {
		setNotes(updateSortNotes);
	}, []);

	function onNoteCreated(content: string) {
		const newNote = {
			id: crypto.randomUUID(),
			date: new Date(),
			content,
		};
		const notesArr = [newNote, ...notes];
		setNotes(notesArr);
		localStorage.setItem("notes", JSON.stringify(notesArr));
	}

	function onNoteUpdate(editedNote: Note, content: string) {
		const index = notes.findIndex((note) => note.id === editedNote.id);
		// Create a copy of the array to avoid mutating state directly
		const updatedNotes = [...notes];
		updatedNotes[index] = {
			...updatedNotes[index],
			date: new Date(),
			content: content,
		};
		localStorage.setItem("notes", JSON.stringify(updatedNotes));
		// setNotes(notesArr);
	}

	function onNoteDelete(id: string) {
		const noteIndex = notes.findIndex((note) => note.id === id);
		deletedNote = notes.splice(noteIndex, 1)[0];
		const notesArr = notes.filter((note) => {
			return note.id !== id;
		});
		localStorage.setItem("notes", JSON.stringify(notesArr));
		setNotes(notesArr);
		toast.error("Nota excluída", {
			cancel: {
				label: "Restaurar",
				onClick: () => {
					if (deletedNote) {
						const updatedNotes = [deletedNote, ...notes];
						localStorage.setItem("notes", JSON.stringify(updatedNotes));
						setNotes(updatedNotes);
						toast.success("Nota restaurada com sucesso");
					}
				},
			},
			duration: 7000,
		});
	}

	function handleSearch(event: ChangeEvent<HTMLInputElement>) {
		const query = event.target.value;
		setSearch(query);
	}

	const filteredNotes =
		search !== ""
			? notes.filter((note) =>
					note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
			  )
			: notes;

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="mx-auto h-[90vh] max-w-6xl my-12 space-y-6 bg-zinc-85 px-5 md:px-5 lg:px-0">
				<div className="flex flex-row justify-between">
					<a
						href="https://github.com/usbaliendev"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={usbaliendevlogo} alt="usbaliendev" className="h-8" />
					</a>
					<img src={logo} alt="NLW Expert" className="h-8" />
					{/* <ThemeButton /> */}
					<ModeToggle />
				</div>
				<form action="" className="mx-auto md:w-1/2 lg:w-1/3">
					<div className="flex flex-row items-center">
						<MagnifyingGlassIcon className="mr-2 text-zinc-950 dark:text-zinc-50" />
						<Input
							type="text"
							id="search"
							placeholder="Busque em suas notas..."
							onChange={handleSearch}
							className="text-base font-semibold tracking-tight shadow-lg dark:shadow shadow-zinc-400"
						/>
					</div>
				</form>
				<Separator />
				<div className="grid h-[80%] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
					<NewNoteCard onNoteCreated={onNoteCreated} />
					{filteredNotes.map((note, i) => (
						<NoteCard
							key={`${note.id}-${i}`}
							note={note}
							onNoteDelete={onNoteDelete}
							onNoteUpdate={onNoteUpdate}
						/>
					))}
				</div>
				<Footer />
			</div>
		</ThemeProvider>
	);
}
