import { DirectoryHeader } from "./DirectoryHeader";
import { DivisionList } from "./DivisionList";
import { RetainerModels } from "./RetainerModels";

export function ServicesDirectory() {
  return (
    <section
      id="services-directory"
      aria-label="Services directory"
      className="border-t border-[#292E35]/80 bg-[#0B0D0F] py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-14">
        <DirectoryHeader />
        <DivisionList />
        <RetainerModels />
      </div>
    </section>
  );
}

