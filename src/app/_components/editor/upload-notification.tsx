import { cn } from "@/lib/utils";

type NotificationProps = {
  message: string;
};

export function Notification({ message }: NotificationProps) {
  const isSuccess = message.includes("Амжилттай"); // Or pass a 'type' prop

  return (
    <div
      className={cn(
        "p-2 text-sm rounded-md text-center animate-in fade-in zoom-in duration-300",
        isSuccess
          ? "bg-green-500/10 text-green-500"
          : "bg-destructive/10 text-destructive",
      )}
    >
      {message}
    </div>
  );
}
