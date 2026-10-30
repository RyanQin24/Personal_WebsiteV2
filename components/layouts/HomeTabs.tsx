import {
  PATH_ABOUT,
  PATH_DSP,
  PATH_PROJECTS,
  PATH_WRITING,
} from "@/lib/constants";
import InlineLink from "../common/links/InlineLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function HomeTabs() {
  return (
    <Tabs
      defaultValue="exploring"
      className="w-full"
      aria-label="Visitor type"
      searchParam="visitor"
    >
      <TabsList className="flex h-fit flex-col xs:flex-row gap-4 mb-4 bg-transparent">
        <TabsTrigger value="exploring">A recruiter</TabsTrigger>
        <TabsTrigger value="gamer">An A/V enthusiast</TabsTrigger>
        <TabsTrigger value="recruiter">Just exploring</TabsTrigger>
      </TabsList>
      <TabsContent value="exploring">
        <p>
          Check out my latest{" "}
          <InlineLink href={PATH_ABOUT}>Experiences</InlineLink> and{" "}
          <InlineLink href={PATH_PROJECTS}>Projects</InlineLink>.
        </p>
      </TabsContent>
      <TabsContent value="gamer">
        <p>
          Start in the <InlineLink href={PATH_DSP}>DSP lab</InlineLink>:
          load a WAV and explore stereo VU meters and a live spectrum analyzer.
        </p>
      </TabsContent>
      <TabsContent value="recruiter" className="flex flex-col gap-3">
        <p>
          Just exploring? My{" "}
          <InlineLink href={PATH_WRITING}>writing</InlineLink>{" "}
          is a good place to start.
        </p>
        <p>
          {" "}
        </p>
        <p>
          You&apos;ll meet Leo &amp; Cate, the first cyber couple to communicate
          at 1.6 Tbps, in one of my stories. A little romance, a lot of bandwidth.
        </p>
      </TabsContent>
    </Tabs>
  );
}
