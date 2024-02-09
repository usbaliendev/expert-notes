import { IoMdHeart } from "react-icons/io";

export const Footer = () => {
	return (
		<footer className="h-14 w-full flex items-center justify-center bg-black ">
			<span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-gray-300">
				Made with <IoMdHeart size={16} className="text-blue-500" /> by
				<a
					href="https://github.com/usbaliendev"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-blue-500"
				>
					<strong>usbaliendev</strong>
				</a>
			</span>
		</footer>
	);
};
