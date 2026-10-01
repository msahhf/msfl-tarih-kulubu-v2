import { SocialLinks } from "./SocialLinks";

/** Eski sitedeki (main branch) navbar altı sosyal medya şeridinin
 *  sadeleştirilmiş, responsive karşılığı. */
export function SocialBar() {
  return (
    <div className="border-b border-border bg-surface/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <SocialLinks variant="bar" />
      </div>
    </div>
  );
}
