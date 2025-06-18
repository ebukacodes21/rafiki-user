import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

type HeaderProps = {
    label: string;
};

export const Header: React.FC<HeaderProps> = ({ label }) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-start justify-center">
            <p className={cn("text-gray-900 font-bold text-3xl", font.className)}>{label}</p>
        </div>
    );
}