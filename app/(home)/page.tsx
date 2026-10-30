import ProfilePhoto from "@/components/common/photos/ProfilePhoto";
import HomeTabs from "@/components/layouts/HomeTabs";
import { TabsTriggerSkeleton } from "@/components/ui/tabs";
import profileDark from "@/public/images/home/Profile_Dark.jpg";
import profileLight from "@/public/images/home/Profile_Light.jpg";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6 sm:gap-8 flex-col-reverse sm:flex-row">
        <div className="flex flex-col gap-3 mb-2">
          <p>
            I&apos;m Ryan Qin, an ECE student at University of Waterloo. 
          </p>
          <p>
            I'm passionate about FPGA/ASIC circuit design, high speed I/O systems, and power electronics.
          </p>
        </div>
        {/* Static imports give replacement photos new URLs, avoiding stale image caches. */}
        <ProfilePhoto src={[profileLight.src, profileDark.src]} size={256} />
      </div>

      <p className="mt-2">Are you...</p>
      <Suspense
        fallback={
          <div className="flex h-fit flex-col xs:flex-row items-center justify-center rounded-md bg-transparent p-1 text-muted-foreground">
            <TabsTriggerSkeleton active>A recruiter</TabsTriggerSkeleton>
            <TabsTriggerSkeleton>An A/V enthusiast</TabsTriggerSkeleton>
            <TabsTriggerSkeleton>Just exploring</TabsTriggerSkeleton>
          </div>
        }
      >
        <HomeTabs />
      </Suspense>
    </div>
  );
}
