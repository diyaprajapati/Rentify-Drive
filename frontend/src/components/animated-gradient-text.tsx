import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
    children: React.ReactNode;
    className?: string;
}

export default function AnimatedGradientText({
    children,
    className,
}: AnimatedGradientTextProps) {
    return (
        <div
            className={cn(
                "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/10 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]",
                className,
            )}
        >
            {children}
        </div>
    );
}