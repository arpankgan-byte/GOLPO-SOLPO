import { EyeTracker } from "@/components/ui/interactive-eye-tracker";

export default function InteractiveEyeTrackerDemo() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center">
      <EyeTracker shape="Cube" size={120} />
    </div>
  );
}
