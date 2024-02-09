import { Button } from "./ui/button";
import { FiPlusCircle } from "react-icons/fi";
import { HiMicrophone } from "react-icons/hi2";
import { BiText } from "react-icons/bi";
import { ChangeEvent, FormEvent, useState } from "react";
import { Textarea } from "./ui/textarea";
// import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface NewNoteCardProps {
	onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export default function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
	const [boardType, setBoardType] = useState("");
	const [content, setContent] = useState("");
	const [isRecording, setIsRecording] = useState(false);

	function handleEditorBoard(type: string) {
		switch (type) {
			case "audio":
				return setBoardType("audio");
			case "text":
				return setBoardType("text");
			default:
				return setBoardType("default");
		}
	}

	function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value);
		// if (event.target.value === "") setBoardType("default"); // Volta pras opcoes iniciais se o usuario apaga toda string
	}

	function handleSavedNote(event: FormEvent) {
		event.preventDefault;
		onNoteCreated(content);
		setContent("");
		setBoardType("default");
		toast.success("Nota criada com sucesso");
	}

	function handleStartRecording() {
		const isSpeechRecognitionAPIAvailable =
			"SpeechRecognition" in window || "webkitSpeechRecognition" in window;
		if (!isSpeechRecognitionAPIAvailable) {
			toast.error("Infelizmente seu navegador nao suporta a API de gravação");
			setIsRecording(false);
		}
		setIsRecording(!isRecording);

		// SpeechRecognitionAPI
		const SpeechRecognitionAPI =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		speechRecognition = new SpeechRecognitionAPI(); // iniciar o serviço de reconhecimento de fala
		speechRecognition.lang = "pt-BR"; // linguagem a ser reconhecida
		speechRecognition.continuous = true; // parar de gravar apenas quando solicitado manualmente e nao quando o microfone notar que parou de falar
		speechRecognition.maxAlternatives = 1; // seta o valor máximo de tentativas de aproximação de reconhecimento da palavra pra 1, trazendo a que ele acha mais certa reconhecida
		speechRecognition.interimResults = true; // trazer os resultados conforme for falando pra true e false para resultados apenas no final
		speechRecognition.onresult = (event) => {
			const transcription = Array.from(event.results).reduce((text, result) => {
				return text.concat(result[0].transcript);
			}, "");
			// Array.from converte todo tipo de iterator em Arr
			// se utiliza o reduce pra a cada informação do arr ele executar uma função, e no segundo parâmetro o valor inicial que queremos de retorno, no caso uma string que se inicia vazia
			setContent(transcription);
		}; // traz resultados aproximados toda vez que ouve algo
		speechRecognition.onerror = (event) => {
			console.error(event);
		};
		speechRecognition.start(); // inicia/ativa o reconhecimento de fala
	}

	function handleStopRecording() {
		setIsRecording(false);
		if (speechRecognition !== null) speechRecognition.stop();
	}

	return (
		<Dialog
			onOpenChange={() => {
				setTimeout(() => {
					setBoardType("default");
				}, 150);
				setContent("");
				setIsRecording(false);
			}}
		>
			<DialogTrigger className="bg-card-foreground flex flex-col gap-3 text-left rounded-lg p-5 overflow-hidden relative hover:ring-2 hover:ring-zinc-600 outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
				<FiPlusCircle
					className="absolute right-5 bottom-5 rounded-lg"
					size={40}
					color="#ffffff"
				/>
				<span className="text-base text-secondary font-medium">
					Adicionar nota
				</span>
				<p className="text-secondary-foreground text-sm">
					Grave uma nota em áudio que será convertida para texto
					automaticamente.
				</p>
				<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
			</DialogTrigger>
			<DialogContent className="w-full max-w-[640px] h-[90vh] md:h-[60vh] flex flex-col flex-1 bg-background outline-none rounded-2xl">
				<form className="flex-1 flex flex-col gap-4 h-full">
					<DialogHeader>
						<DialogTitle className="text-base">Adicionar nota</DialogTitle>
						<p className="text-base">
							Comece gravando uma nota em
							<strong className="text-blue-500"> áudio</strong> ou se preferir
							utilize apenas <strong className="text-blue-500">texto</strong>.
						</p>
					</DialogHeader>
					{boardType === "default" ? (
						<div className="flex flex-col h-full md:flex-row mx-auto gap-4 items-center justify-center">
							<Button
								type="button"
								className="group text-secondary dark:text-primary dark:bg-zinc-300"
								onClick={() => {
									handleEditorBoard("audio");
								}}
							>
								<HiMicrophone
									size={15}
									className="mr-2 group-hover:text-red-500 dark:bg-zinc-300"
								/>
								Audio
							</Button>
							<Button
								type="button"
								className="group text-secondary dark:text-primary dark:bg-zinc-300"
								onClick={() => {
									handleEditorBoard("text");
								}}
							>
								<BiText size={15} className="mr-2 group-hover:text-blue-500" />
								Texto
							</Button>
						</div>
					) : boardType === "text" ? (
						<>
							<Textarea
								autoFocus
								onChange={handleContentChanged}
								value={content}
								className="text-sm leading-6 bg-transparent resize-none flex-1 w-full md:h-full overflow-hidden border-0 focus-visible:ring-0 px-0"
							/>
							<DialogFooter className="">
								<Button
									type="submit"
									onClick={handleSavedNote}
									className="bg-blue-600 text-zinc-50 hover:bg-blue-800"
								>
									Salvar
								</Button>
							</DialogFooter>
						</>
					) : (
						<div className="flex flex-row h-full justify-center">
							<div className="flex flex-col w-full">
								<Textarea
									autoFocus
									onChange={handleContentChanged}
									value={content}
									className="text-base leading-6 bg-transparent resize-none flex-1 w-full md:h-full overflow-hidden border-0 focus-visible:ring-0 px-0 mt-3"
								/>
								<>
									<div className="flex justify-center my-3">
										{isRecording ? (
											<Button
												type="button"
												onClick={handleStopRecording}
												className="bg-blue-600 text-zinc-50 hover:bg-blue-800 flex items-center justify-center gap-2"
											>
												<HiMicrophone
													size={15}
													className="text-red-500 animate-pulse"
												/>
												Gravando! (Clique para interromper)
											</Button>
										) : (
											<Button
												type="button"
												onClick={handleStartRecording}
												className="group bg-blue-600 text-zinc-50 hover:bg-blue-800 flex items-center justify-center gap-2"
											>
												<HiMicrophone
													size={15}
													className="group-hover:text-red-500"
												/>
												Gravar
											</Button>
										)}
									</div>
								</>
								<DialogFooter className="">
									<Button
										type="submit"
										onClick={handleSavedNote}
										className="bg-blue-600 text-zinc-50 hover:bg-blue-800"
									>
										Salvar
									</Button>
								</DialogFooter>
							</div>
						</div>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
}
